import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../store/productSlice";
import { addToCart, getCart } from "../../store/cartSlice";
import ProductGrid from "../../components/products/ProductGrid";
import axios from "axios";
import Toast from "../../components/themes/alert";
import { getUser } from "../../store/authSlice";

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

  const fetchUserData = async () => {
    // Assuming you have an action to fetch user data if it's not available
    if (!user || !user.user) {
      // Fetch the user first, assuming there's an action for fetching user details
      await dispatch(getUser());
    }
  };

  const fetchData = async () => {
    setLoading(true);

    // Fetch user first
    await fetchUserData();

    // Fetch products and cart after user data is available
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
    fetchData().then(() => setLoading(false));
    fetchCarousels();
  }, [dispatch, user]);

  useEffect(() => {
    if (products && products.length > 0) {
      const sorted = products.slice().sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setSortedProducts(sorted.slice(0, 12));
    }
  }, [products]);

  const handleAddToCart = async (e, { productId, quantity }) => {
    e.preventDefault();

    if (!user || !user.user) {
      navigate("/login");
      return;
    }

    const formData = {
      user_id: user.user.id,
      product_id: productId,
      quantity: quantity,
    };

    try {
      const resultAction = await dispatch(addToCart(formData));

      if (resultAction.type === "cart/addToCart/fulfilled") {
        Toast.fire({
          icon: "success",
          title: "Added to Cart",
        });
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Failed to add to cart",
      });
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
    }, 15000); // Change slide every 15 seconds (adjust as needed)

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [carousels.length]); // Re-run effect if the number of carousels changes

  return (
    <div className="px-3">
      {loading ? (
        <div className="space-y-3">
          <div className="w-full h-96 animate-pulse bg-gray-500 rounded-lg flex justify-center items-center text-black " />

          {/* Loop product loading */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index}>
                <div
                  key={index}
                  className="w-full h-80 lg:h-60 animate-pulse bg-gray-500 rounded-t-lg flex justify-center items-center text-black "
                />
                <div className="p-2 space-y-3 lg:h-16 animate-pulse bg-gray-500 rounded-b-lg">
                  <div className="text-lg font-bold py-2 animate-pulse bg-gray-600 rounded-full" />
                  <div className="text-lg font-bold py-2 w-1/2 animate-pulse bg-gray-600 rounded-full mt-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
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
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
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
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
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

          <div>
            <div className="text-2xl lg:text-3xl font-bold pb-4">
              New On PlayDirect :
            </div>
            <ProductGrid
              products={sortedProducts}
              handleAddToCart={handleAddToCart}
              carts={carts}
              user={user}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
