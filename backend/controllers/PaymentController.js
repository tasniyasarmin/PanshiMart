const stripe = require("stripe")(process.env.STRIPE_KEY);
const User = require("../models/User");
const OrderModel = require("../models/OrderModel");
const ProductModel = require("../models/ProductModel");

class PaymentController {
  async paymentProcess(req, res) {
    const { cart, id } = req.body;
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });

      const orderData = cart.map((item) => ({
        _id: item._id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        userId: user._id,
      }));

      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { cart: JSON.stringify(orderData) },
      });

      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: { allowed_countries: ["PK", "IN", "BD"] },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 0, currency: "usd" },
              display_name: "Free shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
        ],
        line_items: cart.map((item) => {
          const percentage = item.discount / 100;
          let actualPrice = item.price - item.price * percentage;
          actualPrice = Math.round(actualPrice * 100); // amount in cents
          return {
            price_data: {
              currency: "usd",
              product_data: { name: item.title },
              unit_amount: actualPrice,
            },
            quantity: item.quantity,
          };
        }),
        customer: customer.id,
        mode: "payment",
        success_url: `${process.env.CLIENT}/user?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT}/cart`,
      });

      res.json({ url: session.url });
    } catch (err) {
      console.log("Payment process error:", err.message);
      res.status(500).json({ error: "Server error" });
    }
  }

  async paymentVerify(req, res) {
    const { id } = req.params; // this is the Checkout Session ID
    try {
      // Retrieve the session and expand customer so we can read metadata easily
      const session = await stripe.checkout.sessions.retrieve(id, {
        expand: ["customer"],
      });

      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // If payment hasn't succeeded, return the status (no order creation)
      if (
        session.payment_status !== "paid" &&
        session.payment_status !== "no_payment_required"
      ) {
        return res.status(200).json({
          msg: "Payment not completed yet",
          status: session.payment_status,
        });
      }

      // customer object may be expanded
      const customer = session.customer;
      // metadata.cart is where you saved the cart when creating the customer
      let customerCart = [];
      try {
        if (customer && customer.metadata && customer.metadata.cart) {
          customerCart = JSON.parse(customer.metadata.cart);
        } else {
          // fallback: if you didn't expand customer or metadata, retrieve customer separately
          const cust = await stripe.customers.retrieve(session.customer);
          if (cust && cust.metadata && cust.metadata.cart) {
            customerCart = JSON.parse(cust.metadata.cart);
          }
        }
      } catch (err) {
        console.warn("Failed to parse customer cart metadata:", err.message);
        customerCart = [];
      }

      // Idempotency check: don't create duplicate orders for the same session
      const alreadyCreated = await OrderModel.findOne({
        sessionId: session.id,
      });
      if (alreadyCreated) {
        return res.status(200).json({
          msg: "Order already processed",
          status: session.payment_status,
        });
      }

      // Create orders and update stock
      for (const item of customerCart) {
        // create an order record
        await OrderModel.create({
          productId: item._id,
          userId: item.userId,
          size: item.size,
          color: item.color,
          quantities: item.quantity,
          address: session.customer_details
            ? session.customer_details.address
            : {},
          review: false,
          sessionId: session.id, // store the session id for idempotency
        });

        // update product stock
        const product = await ProductModel.findById(item._id);
        if (product) {
          let stock = product.stock - item.quantity;
          if (stock < 0) stock = 0;
          await ProductModel.findByIdAndUpdate(
            item._id,
            { stock },
            { new: true }
          );
        }
      }

      return res.status(200).json({
        msg: "Your payment has been verified",
        status: session.payment_status,
      });
    } catch (err) {
      console.error("paymentVerify error:", err);
      return res.status(500).json({ error: err.message || "Server error" });
    }
  }
}

module.exports = new PaymentController();
