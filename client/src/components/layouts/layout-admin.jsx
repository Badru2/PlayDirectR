import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <div className="bg-white shadow-md w-full px-3 py-3 sticky top-0 z-50">
        <div className="flex justify-between max-w-[1540px] mx-auto items-center">
          <div className="space-x-3">
            <Link
              to={"/admin/dashboard"}
              className="font-bold text-2xl text-black"
            >
              PlayDirect
            </Link>
            <Link
              to={"/admin/product"}
              className="font-bold text-xl text-black"
            >
              Product
            </Link>
            <Link
              to={"/admin/transaction"}
              className="font-bold text-xl text-black"
            >
              Transaction
            </Link>
          </div>

          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="">
              <img
                src={
                  user.avatar
                    ? `/public/images/avatars/${user.avatar}`
                    : `https://ui-avatars.com/api/?name=${user.username}` ||
                      `https://ui-avatars.com/api/?name=Anonymous`
                }
                alt={user.username}
                className="w-9 h-9 object-cover rounded-full"
              />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow space-y-3"
            >
              <li>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white text-center w-full"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto mt-3">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
