import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../store/authSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";
import { createTransaction } from "../../store/transactionSlice";
import { clearCart, deleteFromCart, updateCart } from "../../store/cartSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import Toast from "../../components/themes/alert";
import { Helmet } from "react-helmet";

const CartPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false); // State for checkout loading

  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(`/api/cart/show?userId=${userId}`);
      console.log("Fetched cart data:", response.data);

      setCarts(response.data.carts);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false); // Ensure loading is set to false after fetching data
    }
  };

  const fetchData = async () => {
    try {
      const userAction = await dispatch(getUser()).unwrap();

      if (userAction && userAction.user) {
        const userId = userAction.user.id;
        console.log("User ID:", userId);
        await fetchCart(userId);
      } else {
        console.error("User not found or userAction failed");
        setLoading(false); // Handle case where userAction does not return a user
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false); // Handle error and set loading to false
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let totalPrice = 0;
      if (carts) {
        carts.forEach((cart) => {
          totalPrice += cart.Product.price * cart.quantity;
        });
      }
      return totalPrice;
    };

    setTotalPrice(calculateTotalPrice());
  }, [carts]); // Add carts as dependency

  const handleUpdateCart = async (cartId, quantity) => {
    try {
      await dispatch(updateCart({ cartId, quantity }));
      await fetchCart(user.user.id);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true); // Set checkout loading to true when button is clicked

    const payload = {
      user_id: user.user.id,
      products: carts.map((cart) => ({
        product_id: cart.Product.id,
        product_name: cart.Product.name,
        image: cart.Product.images[0],
        price: cart.Product.price,
        quantity: cart.quantity,
      })),
      total: totalPrice,
      status: "pending",
    };

    console.log(payload);
    try {
      await dispatch(
        createTransaction({
          user_id: payload.user_id,
          products: payload.products,
          total: payload.total,
          status: payload.status,
        })
      );
      await dispatch(clearCart(user.user.id));
      await fetchCart(user.user.id);

      document.getElementById("transaction_modal").close();

      Toast.fire({
        icon: "success",
        title: "Transaction created successfully",
      });
    } catch (error) {
      console.error("Error creating transaction:", error);

      Toast.fire({
        icon: "error",
        title: "Failed to create transaction",
      });
    } finally {
      setCheckoutLoading(false); // Set checkout loading to false after checkout is complete
    }
  };

  return (
    <div className="pb-24 lg:pb-4">
      <Helmet>
        <title>PlayDirect | Cart</title>
      </Helmet>

      {loading ? (
        <div className="flex space-x-3">
          <div className="flex flex-col gap-2 shadow-md p-4 w-3/4 h-[200px] bg-gray-400 animate-pulse">
            <div className="h-5 w-1/4 bg-gray-500 animate-pulse rounded-full" />
            <div className="w-full h-1 bg-gray-500 animate-pulse rounded-full" />
          </div>

          <div className="flex flex-col gap-2 shadow-md p-4 w-1/4 h-[120px] bg-gray-400 animate-pulse justify-between">
            <div className="flex justify-between">
              <div className="h-5 w-1/4 bg-gray-500 animate-pulse rounded-full" />
              <div className="w-2/4 h-5 bg-gray-500 animate-pulse rounded-full" />
            </div>

            <div className="h-12 w-full bg-gray-500 animate-pulse rounded-md" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:space-x-3">
          <div className="flex flex-col gap-2 bg-white shadow-md p-4 w-full lg:w-3/4">
            <div>
              <div className="font-bold text-2xl">Cart</div>
              {/* <div className="w-full h-[2px] bg-black rounded-full mb-3" /> */}
            </div>
            {carts && carts.length > 0 ? (
              carts.map((cart) => (
                <div
                  key={cart.id}
                  className="flex flex-col lg:flex-row justify-between space-x-3 border-t-2 py-3"
                >
                  <div className="flex space-x-3">
                    <div>
                      <Link
                        to={`/detail?name=${cart.Product.name}&productId=${cart.Product.id}`}
                      >
                        <img
                          src={`/public/images/products/${cart.Product.images[0]}`} // Adjust path based on your setup
                          alt={cart.Product.name}
                          className="w-[80px] h-[80px] object-cover rounded-sm"
                        />
                      </Link>
                    </div>

                    <div className="">
                      <div className="font-semibold text-xl">
                        {cart.Product.name}
                      </div>
                      <div className="font-bold text-2xl">
                        {showFormatRupiah(cart.Product.price * cart.quantity)}
                      </div>
                    </div>
                  </div>

                  <div className="self-end flex space-x-3 items-center">
                    <div>
                      Stock: <b>{cart.Product.quantity}</b>
                    </div>

                    <button
                      onClick={() => {
                        dispatch(deleteFromCart(cart.id));
                        fetchData();
                        Toast.fire({
                          icon: "success",
                          title: "Cart deleted successfully",
                        });
                      }}
                      className="bg-white border-red-500 text-red-600 p-0 rounded-sm flex items-center justify-center w-8 h-8"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
                        />
                      </svg>
                    </button>

                    <div className="flex items-center ">
                      <button
                        onClick={() =>
                          handleUpdateCart(cart.id, cart.quantity - 1)
                        }
                        className="flex items-center justify-center bg-white border border-gray-400 rounded-sm p-0 w-8 h-8"
                      >
                        -
                      </button>
                      <div className="border px-4 py-[3.4px] rounded-none border-gray-400">
                        {cart.quantity}
                      </div>
                      <button
                        onClick={() =>
                          handleUpdateCart(cart.id, cart.quantity + 1)
                        }
                        className="flex items-center justify-center bg-white border border-gray-400 rounded-sm p-0 w-8 h-8"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No items in the cart.</div>
            )}
          </div>

          <div className="w-1/4 hidden lg:block">
            <div className="bg-white shadow-md p-4 space-y-3 sticky top-16">
              <div className="flex justify-between font-bold text-xl">
                Total: <span>{showFormatRupiah(totalPrice)}</span>
              </div>
              <button
                disabled={carts.length === 0 || checkoutLoading} // Disable button during loading
                onClick={() => {
                  document.getElementById("transaction_modal").showModal();
                }}
                className={`w-full rounded-sm font-bold ${
                  checkoutLoading ? "bg-gray-400" : "bg-green-500"
                } text-white ${
                  carts.length === 0 ? "cursor-not-allowed opacity-50" : ""
                } `}
              >
                {checkoutLoading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>

          <div className="bg-white shadow-md p-4 space-y-3 fixed bottom-0 w-full lg:hidden">
            <div className="flex justify-between font-bold text-xl">
              Total: <span>{showFormatRupiah(totalPrice)}</span>
            </div>
            <button
              disabled={carts.length === 0 || checkoutLoading} // Disable button during loading
              onClick={() => {
                document.getElementById("transaction_modal").showModal();
              }}
              className={`w-full rounded-sm font-bold ${
                checkoutLoading ? "bg-gray-400" : "bg-green-500"
              } text-white ${
                carts.length === 0 ? "cursor-not-allowed opacity-50" : ""
              } `}
            >
              {checkoutLoading ? "Processing..." : "Checkout"}
            </button>
          </div>

          <dialog id="transaction_modal" className="modal">
            <div className="modal-box w-7/12 max-w-5xl">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <div className="flex flex-wrap justify-center align-center space-x-3 space-y-5 py-12">
                <Link className="w-1/4 object-contain hover:bg-slate-300 flex items-center">
                  <img src="/images/BRI-Logo.jpg" alt="" />
                </Link>

                <Link className="w-1/4 object-contain hover:bg-slate-300 flex items-center">
                  <img src="/images/GoPay-Logo-2016.png" alt="" />
                </Link>

                <Link className="w-1/4 object-contain hover:bg-slate-300 flex items-center">
                  <img src="/images/Bank-BNI-Logo.jpeg" alt="" />
                </Link>

                <Link className="w-1/4 object-contain hover:bg-slate-300 flex items-center">
                  <img src="/images/Ovo-Logo.png" alt="" />
                </Link>

                <Link className="w-1/4 object-contain hover:bg-slate-300 flex items-center">
                  <img src="/images/Dana-Logo.jpg" alt="" />
                </Link>

                <Link className="w-1/4 object-contain hover:bg-slate-300 flex items-center">
                  <img src="/images/PayPal-Logo.jpeg" alt="" />
                </Link>
              </div>
              <button
                disabled={carts.length === 0 || checkoutLoading} // Disable button during loading
                onClick={handleCheckout}
                className={`w-full rounded-sm font-bold ${
                  checkoutLoading ? "bg-gray-400" : "bg-green-500"
                } text-white ${
                  carts.length === 0 ? "cursor-not-allowed opacity-50" : ""
                } `}
              >
                {checkoutLoading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default CartPage;
