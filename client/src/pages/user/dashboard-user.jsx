import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../store/productSlice";
import { getCart, addToCart } from "../../store/cartSlice";
import ProductGrid from "../../components/products/ProductGrid";
import axios from "axios";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.products);
  const [carousels, setCarousels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // Active carousel slide

  const carts = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [sortedProducts, setSortedProducts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    await dispatch(getProducts());

    if (user && user.user) {
      const userId = user.user.id;
      await dispatch(getCart(userId));
    }
  };

  const fetchCarousels = async () => {
    try {
      const response = await axios.get("/api/carousel/show");
      setCarousels(response.data);
    } catch (error) {
      console.error("Error fetching carousels:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCarousels();
    setLoading(false);
  }, [dispatch, user]);

  useEffect(() => {
    if (products && products.length > 0) {
      const sorted = products.slice().sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setSortedProducts(sorted.slice(0, 12));
    }
  }, [products]);

  const handleAddToCart = async (productId) => {
    if (!user || !user.user) {
      navigate("/login");
      return;
    }

    const formData = {
      user_id: user.user.id,
      product_id: productId,
      quantity: 1,
    };

    try {
      const resultAction = await dispatch(addToCart(formData));
      console.log("Added to cart successfully:", resultAction);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  // Carousel control functions
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % carousels.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + carousels.length) % carousels.length
    );
  };

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide(); // Automatically go to the next slide
    }, 5000); // Change slide every 5 seconds (adjust as needed)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [carousels.length]); // Re-run effect if the number of carousels changes

  return (
    <div className="px-3">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="pb-16">
          <div id="fade-carousel" className="relative w-full mb-4">
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
              {carousels.map((carousel, index) => (
                <div
                  key={carousel.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === activeIndex ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transition: "opacity 1s" }}
                >
                  <img
                    src={`/public/images/carousel/${carousel.images}`}
                    className="block w-full object-cover h-full"
                    alt={`carousel-${index}`}
                  />
                </div>
              ))}
            </div>

            {/* Previous button */}
            <button
              type="button"
              className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none bg-transparent"
              onClick={prevSlide} // Use prevSlide function
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50  group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1L1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>

            {/* Next button */}
            <button
              type="button"
              className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none bg-transparent"
              onClick={nextSlide} // Use nextSlide function
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30  group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>

          <ProductGrid
            products={sortedProducts}
            handleAddToCart={handleAddToCart}
            carts={carts}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
