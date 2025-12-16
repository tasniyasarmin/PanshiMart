import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import currency from "currency-formatter";
import { BsTrash } from "react-icons/bs";
import { motion } from "framer-motion";
import Nav from "../../components/home/Nav";
import { discount } from "../../utils/discount";
import Quantity from "../../components/home/Quantity";
import {
  incQuantity,
  decQuantity,
  removeItem,
} from "../../store/reducers/cartReducer";
import { useSendPaymentMutation } from "../../store/services/paymentService";
import AppImage from "../../components/common/AppImage";
import Swal from "sweetalert2"; // Import SweetAlert2

const Cart = () => {
  const { cart, total } = useSelector((state) => state.cartReducer);
  const { userToken, user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();

  const inc = (id) => {
    const item = cart.find((i) => i._id === id);
    if (!item) return;

    if (item.quantity >= item.stock) {
      Swal.fire({
        title: "Stock limit reached",
        text: `Only ${item.stock} piece(s) available for this product.`,
        icon: "info",
        timer: 1800,
        showConfirmButton: false,
        customClass: {
          popup:
            "bg-white text-gray-900 border border-gray-200 rounded-xl shadow-xl",
        },
      });
      return;
    }

    dispatch(incQuantity(id));
  };

  const dec = (id) => {
    dispatch(decQuantity(id));
  };

  // SweetAlert for Remove Item
  const remove = (id) => {
    Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        cancelButton:
          "bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        popup:
          "bg-white text-gray-900 border border-gray-200 rounded-xl shadow-xl", // Light theme for public cart
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeItem(id));
        Swal.fire({
          title: "Removed!",
          text: "Item removed from cart.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup:
              "bg-white text-gray-900 border border-gray-200 rounded-xl shadow-xl",
          },
        });
      }
    });
  };

  const navigate = useNavigate();
  const [doPayment, response] = useSendPaymentMutation();

  const pay = () => {
    if (userToken) {
      doPayment({ cart, id: user.id });
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (response?.isSuccess) {
      window.location.href = response?.data?.url;
    }
  }, [response]);

  return (
    <>
      <Nav />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="my-container mt-28"
      >
        {cart.length > 0 ? (
          <>
            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr className="thead-tr">
                    <th className="th">image</th>
                    <th className="th">name</th>
                    <th className="th">color</th>
                    <th className="th">size</th>
                    <th className="th">price</th>
                    <th className="th">quantities</th>
                    <th className="th">total</th>
                    <th className="th">delete</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const total = currency.format(
                      discount(item.price, item.discount) * item.quantity,
                      {
                        code: "USD",
                      }
                    );
                    return (
                      <tr className="even:bg-gray-50" key={item._id}>
                        <td className="td">
                          <AppImage
                            src={item.image1}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-full"
                          />
                        </td>
                        <td className=" td font-medium">{item.title}</td>
                        <td className="td">
                          <span
                            className="block w-[15px] h-[15px] rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></span>
                        </td>
                        <td className="td">
                          <span className="font-semibold">{item.size}</span>
                        </td>
                        <td className="td font-bold text-gray-900">
                          {currency.format(
                            discount(item.price, item.discount),
                            {
                              code: "USD",
                            }
                          )}
                        </td>
                        <td className="td">
                          <Quantity
                            quantity={item.quantity}
                            inc={() => inc(item._id)}
                            dec={() => dec(item._id)}
                            theme="indigo"
                          />
                        </td>
                        <td className="td font-bold ">{total}</td>
                        <td className="td">
                          <span
                            className="cursor-pointer"
                            onClick={() => remove(item._id)}
                          >
                            <BsTrash className="text-rose-600" size={20} />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-indigo-50 p-4 flex justify-end mt-5 rounded-md">
              <div>
                <span className="text-lg font-semibold text-indigo-800 mr-10">
                  {currency.format(total, { code: "USD" })}
                </span>
                <button
                  className="btn bg-indigo-600 text-sm font-medium py-2.5"
                  onClick={pay}
                >
                  {response.isLoading ? "Loading..." : "checkout"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-md text-sm font-medium text-indigo-800">
            Cart is empty!
          </div>
        )}
      </motion.div>
    </>
  );
};

export default Cart;
