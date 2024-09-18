import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const UserLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <div className="bg-white shadow-md w-full px-3 py-2 sticky top-0 z-50">
        <div className="flex justify-between max-w-[1540px] mx-auto items-center">
          <Link to="/" className="font-bold text-2xl">
            PlayDirect
          </Link>

          <div className="space-x-3 flex items-center">
            <Link to={"/cart"} className="font-bold text-xl">
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
                    user?.avatar
                      ? `/public/images/avatars/${user?.avatar}`
                      : `https://ui-avatars.com/api/?name=${user?.username}` ||
                        `https://ui-avatars.com/api/?name=Anonymous`
                  }
                  alt={user?.username}
                  className="w-9 h-9 object-cover rounded-full"
                />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow space-y-3"
              >
                <li>
                  <Link to={"/transaction"} className="font-bold text-xl">
                    Purchase
                  </Link>
                </li>
                <li>
                  {user ? (
                    <button
                      onClick={logout}
                      className="bg-red-500 text-white text-center w-full"
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

      <main className="max-w-[1440px] mx-auto mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
