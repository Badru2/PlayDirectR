import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { showFormatRupiah } from "../themes/format-rupiah";
// import { io } from "socket.io-client";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [debouncedProductName, setDebouncedProductName] = useState("");
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const socket = io("http://localhost:5000", {
  //   transports: ["websocket"],
  // });

  const [isOpen, setIsOpen] = useState(false); // Dropdown state
  const toggleDropdown = () => setIsOpen(!isOpen); // Toggle dropdown
  const closeDropdown = () => setIsOpen(false); // Close dropdown

  const fetchProfile = async (userId) => {
    try {
      const response = await axios.get(`/api/auth/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

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

  const searchProduct = async () => {
    if (debouncedProductName.trim() === "") {
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/product/search?productName=${debouncedProductName}`
      );
      setProducts(response.data.products);
    } catch (error) {
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  // Debounce product name input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProductName(productName);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [productName]);

  // Trigger product search when debounced name changes
  useEffect(() => {
    searchProduct();
  }, [debouncedProductName]);

  // Fetch profile once user is available
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
      fetchCart(user.id);
    }
  }, [user]);

  return (
    <div>
      <div className="bg-blue-600 shadow-md w-full px-3 py-2 sticky top-0 z-50">
        <div className="flex justify-between max-w-[1540px] mx-auto items-center space-x-3">
          {/* <div className="space-x-3 flex items-center"> */}
          <Link
            to="/"
            className="font-bold text-2xl text-white hover:text-white"
          >
            PlayDirect
          </Link>

          <div className="relative md:w-1/3">
            <div className="relative w-full flex items-center">
              <div className="absolute text-black left-3 flex items-center justify-center">
                <span className="icon-[tdesign--search]"></span>
              </div>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full lg:w-full text-black border-gray-300 rounded-md ps-9 py-2 focus:outline-none appearance-none"
                placeholder="Search Product"
              />
            </div>

            {/* Show loading indicator */}
            {loading && (
              <div className="absolute left-0 right-0 bg-white text-black mt-1 p-2 rounded-md shadow-lg max-h-60 overflow-y-auto">
                Loading...
              </div>
            )}

            {/* Show search results */}
            {!loading && products.length > 0 && (
              <div className="absolute left-0 right-0 bg-white text-black mt-1 p-2 rounded-md shadow-lg max-h-60 overflow-y-auto flex flex-col">
                {products.map((product) => (
                  <Link
                    to={`/detail?name=${product.name}&productId=${product.id}`}
                    onClick={() => setProductName("")}
                    key={product.id}
                    className="p-2 hover:bg-gray-100 flex items-center text-black hover:text-black"
                  >
                    <img
                      src={`/public/images/products/${product.images[0]}`}
                      alt={product.name}
                      className="w-10 h-10 object-cover border-2 rounded-md me-3"
                    />
                    <div>
                      <div className="md:hidden block">
                        {product.name.length > 20
                          ? product.name.slice(0, 20) + "..."
                          : product.name}
                      </div>
                      <div className="md:block hidden">{product.name}</div>
                      <p className="ml-auto hidden md:block">
                        {showFormatRupiah(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Show error message */}
            {error && <div className="text-red-500">{error}</div>}
          </div>
          {/* </div> */}

          <div className="space-x-2 flex items-center">
            <div className="flex">
              <Link className="font-bold text-2xl relative text-white flex items-center hover:text-white rounded-full p-2">
                <span className="icon-[ion--notifcations]" />
              </Link>

              <Link
                to={"/cart"}
                className="font-bold text-2xl relative text-white flex items-center  hover:text-white rounded-full p-2"
              >
                {carts.length > 0 && (
                  <div className="absolute -top-1 -right-1 text-xs text-white bg-red-500 rounded-full w-5 h-5 flex justify-center items-center z-10">
                    {carts.length}
                  </div>
                )}
                <span className="icon-[mdi--cart-outline]" />
              </Link>
            </div>

            <div className="dropdown dropdown-end h-9 w-9">
              {/* Toggle Dropdown */}
              <div
                tabIndex={0}
                role="button"
                onClick={toggleDropdown}
                className=""
              >
                <img
                  src={
                    profile?.avatar
                      ? `/public/images/avatars/${profile?.avatar}`
                      : `https://ui-avatars.com/api/?name=${profile?.username}` ||
                        `https://ui-avatars.com/api/?name=Anonymous`
                  }
                  alt={profile?.username || "Anonymous"}
                  className="w-9 h-9 object-cover rounded-full"
                />
              </div>

              {/* Dropdown Content */}
              {isOpen && (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-sm z-[1] w-52 p-2 shadow space-y-3"
                >
                  <li>
                    <Link
                      to="/profile"
                      className="font-bold text-xl rounded-sm"
                      onClick={closeDropdown} // Close on click
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/transaction"
                      className="font-bold text-xl rounded-sm"
                      onClick={closeDropdown} // Close on click
                    >
                      Purchase
                    </Link>
                  </li>
                  <li>
                    {user ? (
                      <button
                        onClick={() => {
                          logout();
                          closeDropdown(); // Close dropdown on logout
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white text-center w-full rounded-sm font-bold flex justify-center"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="bg-blue-500 text-white text-center w-full"
                        onClick={closeDropdown} // Close on click
                      >
                        Login
                      </Link>
                    )}
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1340px] 2xl:max-w-[1440px] mx-auto mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
