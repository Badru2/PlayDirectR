import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../store/authSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";
import { createTransaction } from "../../store/transactionSlice";
import { clearCart } from "../../store/cartSlice";
import axios from "axios";

const CartPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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

  useEffect(() => {
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
  });

  const handleCheckout = async (e) => {
    e.preventDefault();

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
      dispatch(
        createTransaction({
          user_id: payload.user_id,
          products: payload.products,
          total: payload.total,
          status: payload.status,
        })
      )
        .then(fetchCart())
        .then(dispatch(clearCart(user.user.id)));
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex space-x-3">
          <div className="flex flex-col gap-2 bg-white shadow-md p-4 w-3/4">
            {carts && carts.length > 0 ? (
              carts.map((cart) => (
                <div key={cart.id} className="flex space-x-3">
                  <div>
                    <img
                      src={`/public/images/products/${cart.Product.images[0]}`} // Adjust path based on your setup
                      alt={cart.Product.name}
                      className="w-[80px] h-[80px] object-cover rounded-sm"
                    />
                  </div>

                  <div className="">
                    <div className="font-semibold text-xl">
                      {cart.Product.name}
                    </div>{" "}
                    <div className="font-bold text-2xl">
                      {showFormatRupiah(cart.Product.price * cart.quantity)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No items in the cart.</div>
            )}
          </div>

          <div className="w-1/4 ">
            <div className="bg-white shadow-md p-4 space-y-3">
              <div className="flex justify-between font-bold text-xl">
                Total: <span>{showFormatRupiah(totalPrice)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-green-500 w-full rounded-sm text-white font-bold"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
