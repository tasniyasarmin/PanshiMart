import { useState, useMemo } from "react";
import currency from "currency-formatter";
import { motion } from "framer-motion";
import h2p from "html2plaintext";
import htmlParser from "html-react-parser";
import toast, { Toaster } from "react-hot-toast";
import { BsCheck2, BsStarFill, BsStar } from "react-icons/bs"; // Added star icons
import { useDispatch } from "react-redux";
import Quantity from "./Quantity";
import { addCart } from "../../store/reducers/cartReducer";
import { discount } from "../../utils/discount";
import { useGetReviewsQuery } from "../../store/services/userOrdersService";
import AppImage from "../common/AppImage";

const DetailsCard = ({ product = {} }) => {
  const productId = product?._id || product?.id || "unknown-product";

  const { data, isFetching } = useGetReviewsQuery(productId, {
    skip: !productId || productId === "unknown-product",
  });

  const reviews = data?.reviews || [];

  const images = [product?.image1, product?.image2, product?.image3].filter(
    Boolean
  );

  const [sizeState, setSizeState] = useState(
    Array.isArray(product?.sizes) && product.sizes.length > 0
      ? product.sizes[0].name
      : ""
  );

  const [colorState, setColorState] = useState(
    Array.isArray(product?.colors) && product.colors.length > 0
      ? product.colors[0].color
      : ""
  );

  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const inc = () => {
    const stock = product?.stock || 0;
    if (quantity < stock) {
      setQuantity((q) => q + 1);
    } else {
      toast.error(`Only ${stock} items available in stock`);
    }
  };

  const dec = () => setQuantity((q) => Math.max(1, q - 1));

  const discountPrice = discount(product?.price || 0, product?.discount || 0);
  let desc = h2p(product?.description || "");
  desc = htmlParser(desc || "");

  const addToCart = () => {
    // 1. Check if product exists
    if (!productId || productId === "unknown-product") {
      toast.error("Product not loaded yet");
      return;
    }

    // 2. Check if product is out of stock
    if ((product?.stock || 0) === 0) {
      toast.error("This product is out of stock");
      return;
    }

    const {
      colors: _colors,
      sizes: _sizes,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...newProduct
    } = product;

    newProduct.size = sizeState;
    newProduct.color = colorState;
    newProduct.quantity = quantity;

    const cart = localStorage.getItem("cart");
    const cartItems = cart ? JSON.parse(cart) : [];
    const checkItem = cartItems.find((item) => item._id === newProduct._id);

    if (!checkItem) {
      dispatch(addCart(newProduct));
      cartItems.push(newProduct);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      toast.success("Added to cart");
    } else {
      toast.error(`${newProduct.title} is already in cart`);
    }
  };

  const avgRating = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    const s = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return Number((s / reviews.length).toFixed(2));
  }, [reviews]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap -mx-5"
    >
      <Toaster />
      <div className="w-full order-2 md:order-1 md:w-6/12 p-5">
        <div className="flex flex-wrap -mx-1">
          {images.length > 0 ? (
            images.map((img, i) => (
              <AppImage
                src={img}
                alt={product?.title || "image"}
                className="w-full sm:w-6/12 p-1"
                key={i} // Added key for map
              />
            ))
          ) : (
            <AppImage key={`${productId}-img-0`} image={null} />
          )}
        </div>
      </div>

      <div className="w-full order-1 md:order-2 md:w-6/12 p-5">
        <h1 className="text-2xl font-bold text-gray-900 capitalize">
          {product?.title}
        </h1>

        <div className="flex items-center gap-3 my-2">
          <span className="text-sm text-gray-600">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold mr-1">
                Average: {avgRating}
              </span>
              {/* Show Average Stars */}
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-500 text-sm">
                  {star <= Math.round(avgRating) ? <BsStarFill /> : <BsStar />}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between my-5">
          <span className="text-2xl font-bold text-gray-900">
            {currency.format(discountPrice, { code: "USD" })}
          </span>
          <span className="text-xl line-through text-gray-500">
            {currency.format(product?.price || 0, { code: "USD" })}
          </span>
        </div>

        {/* Sizes & Colors Sections (Unchanged) */}
        {Array.isArray(product?.sizes) && product.sizes.length > 0 && (
          <>
            <h3 className="text-base font-medium capitalize text-gray-600 mb-3">
              sizes
            </h3>
            <div className="flex flex-wrap -mx-1">
              {product.sizes.map((size, idx) => {
                const key = size?.name
                  ? `${productId}-size-${size.name}`
                  : `${productId}-size-${idx}`;
                return (
                  <div
                    key={key}
                    className={`p-2 m-1 border border-gray-300 rounded cursor-pointer ${
                      sizeState === size?.name ? "bg-indigo-600" : ""
                    }`}
                    onClick={() => setSizeState(size?.name)}
                  >
                    <span
                      className={`text-sm font-semibold uppercase ${
                        sizeState === size?.name
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {size?.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {Array.isArray(product?.colors) && product.colors.length > 0 && (
          <>
            <h3 className="text-base font-medium capitalize text-gray-600 mb-2 mt-3">
              colors
            </h3>
            <div className="flex flex-wrap -mx-1">
              {product.colors.map((color, idx) => {
                const key = color?.color
                  ? `${productId}-color-${color.color}`
                  : `${productId}-color-${idx}`;
                return (
                  <div
                    key={key}
                    onClick={() => setColorState(color?.color)}
                    className="border border-gray-300 rounded m-1 p-1 cursor-pointer"
                  >
                    <span
                      className="min-w-[40px] min-h-[40px] rounded flex items-center justify-center"
                      style={{ backgroundColor: color?.color || "#fff" }}
                    >
                      {colorState === color?.color && (
                        <BsCheck2 className="text-white" size={20} />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="flex -mx-3 items-center">
          <div className="w-full sm:w-6/12 p-3">
            <Quantity quantity={quantity} inc={inc} dec={dec} />
          </div>
          <div className="w-full sm:w-6/12 p-3">
            <button className="btn btn-indigo" onClick={addToCart}>
              add to cart
            </button>
          </div>
        </div>

        <h3 className="text-base font-medium capitalize text-gray-600 mb-2 mt-3">
          description
        </h3>
        <div className="mt-4 leading-[27px] description">{desc}</div>

        {/* --- UPDATED REVIEWS SECTION START --- */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">Customer reviews</h2>

          {isFetching ? (
            <div className="text-sm text-gray-500">Loading reviews…</div>
          ) : reviews.length === 0 ? (
            <div className="text-sm text-gray-500">No reviews yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((r, idx) => {
                const key = r?._id || r?.id || `${productId}-review-${idx}`;
                const author = r?.user?.name || r?.name || "Anonymous";
                const rating = r?.rating || 0;
                const created = r?.createdAt
                  ? new Date(r.createdAt).toLocaleString()
                  : "";

                return (
                  <div key={key} className="p-3 border rounded bg-white">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{author}</span>
                        {/* --- INDIVIDUAL RATING STARS --- */}
                        <div className="flex text-yellow-500 text-xs">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                              {star <= rating ? <BsStarFill /> : <BsStar />}
                            </span>
                          ))}
                        </div>
                        {/* ------------------------------ */}
                      </div>
                      <div className="text-sm text-gray-500">{created}</div>
                    </div>
                    <div className="mt-2 text-gray-700">
                      {r?.comment || r?.review || ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* --- UPDATED REVIEWS SECTION END --- */}
      </div>
    </motion.div>
  );
};

export default DetailsCard;
