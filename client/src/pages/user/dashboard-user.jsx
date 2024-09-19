import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { useDispatch, useSelector } from "react-redux";

import { getUser } from "../../store/authSlice";
import { getProducts } from "../../store/productSlice";
import { getCart, addToCart } from "../../store/cartSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";

const ProductGrid = ({ products, handleAddToCart, carts, user }) => {
  const [hoveredProductId, setHoveredProductId] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {products.map((product) => {
        const isHovered = hoveredProductId === product.id;

        return (
          <div
            key={product.id}
            className="bg-white shadow-md hover:transition-transform hover:scale-105 hover:shadow-2xl hover:z-10 duration-300 relative rounded-t-md"
            onMouseEnter={() => setHoveredProductId(product.id)}
            onMouseLeave={() => setHoveredProductId(null)}
          >
            <Link to={`/detail?name=${product.name}&productId=${product.id}`}>
              <img
                src={"/public/images/products/" + product.images[0]}
                alt={product.name}
                className="h-80 md:h-720 lg:h-56 object-cover w-full object-top rounded-t-md"
              />
            </Link>
            <div className="p-2 space-y-3">
              <div className="text-lg font-bold h-12">
                <Link
                  to={`/detail?name=${product.name}&productId=${product.id}`}
                  className="text-black hover:text-black"
                >
                  {product.name}
                </Link>
              </div>
              <div className="font-bold">{showFormatRupiah(product.price)}</div>
            </div>

            <button
              disabled={product.quantity <= 0}
              className={
                "w-full bg-blue-600 text-white text-center py-2 rounded-b-md rounded-none absolute z-10 " +
                (isHovered ? "block " : "hidden ") +
                (product.quantity <= 0 ? "opacity-50 cursor-not-allowed " : "")
              }
              onClick={(e) => handleAddToCart(product.id)}
            >
              Add To Cart
            </button>
          </div>
        );
      })}
    </div>
  );
};

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add useNavigate for redirection
  const products = useSelector((state) => state.products.products);
  const carts = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch products without depending on user authentication
      await dispatch(getProducts());

      // Optionally fetch the user and cart if authenticated
      if (user && user.user) {
        const userId = user.user.id;
        await dispatch(getCart(userId));
      }

      setLoading(false);
    };

    fetchData();
  }, [dispatch, user]);

  useEffect(() => {
    if (products && products.length > 0) {
      const sorted = products.slice().sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      const limitedProducts = sorted.slice(0, 12);

      setSortedProducts(limitedProducts);
    }

    console.log("this is cart", carts);
  }, [products, carts]);

  const handleAddToCart = async (productId) => {
    if (!user || !user.user) {
      // If the user is not authenticated, redirect them to the login page
      navigate("/login");
      return;
    }

    // Prepare data as a plain object
    const formData = {
      user_id: user.user.id,
      product_id: productId,
      quantity: 1,
    };

    try {
      const resultAction = await dispatch(addToCart(formData));
      console.log("Added to cart successfully:", resultAction);
    } catch (error) {
      // Log detailed error for debugging
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="px-3">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ProductGrid
          products={sortedProducts}
          handleAddToCart={handleAddToCart}
          carts={carts}
          user={user}
        />
      )}
    </div>
  );
};

export default UserDashboard;
