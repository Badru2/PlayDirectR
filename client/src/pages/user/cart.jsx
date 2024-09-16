import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../store/cartSlice";
import { getUser } from "../../store/authSlice";
import axios from "axios";
import { showFormatRupiah } from "../../components/themes/format-rupiah";
// import showFormatRupiah from "../../components/themes/format-rupiah.jsx";

const CartPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [carts, setCarts] = useState([]);

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

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>
            {carts && carts.length > 0 ? (
              carts.map((cart) => (
                <div key={cart.id}>
                  <div>
                    <img
                      src={`/public/images/products/${cart.Product.images[0]}`} // Adjust path based on your setup
                      alt={cart.Product.name}
                      className="w-[50px] h-[50px] object-cover rounded-sm"
                    />
                  </div>
                  <div>{cart.Product.name}</div>{" "}
                  <div>{showFormatRupiah(cart.Product.price)}</div>
                </div>
              ))
            ) : (
              <div>No items in the cart.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
