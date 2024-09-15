import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { getUser } from "../../store/authSlice";
import { getProducts } from "../../store/productSlice";
import { getCart, addToCart } from "../../store/cartSlice";
import { showFormatRupiah } from "../../components/themes/format-rupiah";

const ProductGrid = ({ products, handleAddToCart, carts, user }) => {
  const [hoveredProductId, setHoveredProductId] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {products.map((product) => {
        const isHovered = hoveredProductId === product.id;

        return (
          <div
            key={product.id}
            className="bg-white shadow-md hover:transition-transform hover:scale-105 hover:shadow-2xl duration-300 relative rounded-t-md"
            onMouseEnter={() => setHoveredProductId(product.id)}
            onMouseLeave={() => setHoveredProductId(null)}
          >
            <Link to={`/detail?name=${product.name}&productId=${product.id}`}>
              <img
                src={"/public/images/products/" + product.images[0]}
                alt={product.name}
                className="h-72 object-cover w-full object-top"
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
              className={
                "w-full bg-blue-600 text-white text-center py-2 rounded-b-md rounded-none absolute " +
                (isHovered ? "block" : "hidden")
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
  const products = useSelector((state) => state.products.products.products);
  const carts = useSelector((state) => state.cart.cart.cart);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch user first and wait for it to complete
      const userAction = await dispatch(getUser()).unwrap();

      // Now fetch products
      await dispatch(getProducts());

      // If the user is successfully fetched, get their cart
      if (userAction && userAction.user) {
        const userId = userAction.user.id;
        await dispatch(getCart(userId));
      }

      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const sorted = products.slice().sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      const limitedProducts = sorted.slice(0, 10);

      setSortedProducts(limitedProducts);
    }

    if (carts && carts.length > 0) {
      console.log(carts);
    }
  }, [products, carts]);

  const handleAddToCart = async (productId) => {
    if (!user.user) {
      console.error("User not found");
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
    <div>
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
