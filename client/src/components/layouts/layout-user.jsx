import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { showFormatRupiah } from "../themes/format-rupiah";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [debouncedProductName, setDebouncedProductName] = useState("");
  const [loading, setLoading] = useState(false); // For loading indicator
  const [error, setError] = useState(null); // For error handling

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/auth/profile/" + user.id);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  const searchProduct = async () => {
    if (debouncedProductName.trim() === "") {
      setProducts([]); // Clear the search results if input is empty
      return;
    }
    setLoading(true); // Start loader
    try {
      const response = await axios.get(
        `/api/product/search?productName=${debouncedProductName}`
      );
      console.log("response.data", response.data.products);
      setProducts(response.data.products);
    } catch (error) {
      console.log("error", error);
      setError("Error fetching products");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProductName(productName);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [productName]);

  useEffect(() => {
    searchProduct();
  }, [debouncedProductName]);

  useEffect(() => {
    fetchProfile();
    console.log("this is user id");
  }, []);

  return (
    <div>
      <div className="bg-blue-600 shadow-md w-full px-3 py-2 sticky top-0 z-50">
        <div className="flex justify-between max-w-[1540px] mx-auto items-center">
          <Link
            to="/"
            className="font-bold text-2xl text-white hover:text-white"
          >
            PlayDirect
          </Link>

          <div className="relative md:w-1/3">
            <div className="relative w-full flex items-center">
              <div className="absolute text-black left-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M15.096 5.904a6.5 6.5 0 1 0-9.192 9.192a6.5 6.5 0 0 0 9.192-9.192M4.49 4.49a8.5 8.5 0 0 1 12.686 11.272l5.345 5.345l-1.414 1.414l-5.345-5.345A8.501 8.501 0 0 1 4.49 4.49"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full text-black border-gray-300 rounded-md ps-9 py-2 focus:outline-none appearance-none"
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

          <div className="space-x-3 flex items-center">
            <Link
              to={"/cart"}
              className="font-bold text-xl text-white hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z"
                />
              </svg>
            </Link>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="">
                <img
                  src={
                    profile?.avatar
                      ? `/public/images/avatars/${profile?.avatar}`
                      : `https://ui-avatars.com/api/?name=${profile?.username}` ||
                        `https://ui-avatars.com/api/?name=Anonymous`
                  }
                  alt={user?.username}
                  className="w-9 h-9 object-cover rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-sm z-[1] w-52 p-2 shadow space-y-3"
              >
                <li>
                  <Link
                    to={"/profile"}
                    className="font-bold text-xl rounded-sm"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/transaction"}
                    className="font-bold text-xl rounded-sm"
                  >
                    Purchase
                  </Link>
                </li>
                <li>
                  {user ? (
                    <button
                      onClick={logout}
                      className="bg-red-500 hover:bg-red-600 text-white text-center w-full rounded-sm font-bold flex justify-center"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      to={"/login"}
                      className="bg-blue-500 text-white text-center w-full"
                    >
                      Login
                    </Link>
                  )}
                </li>
              </ul>
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
