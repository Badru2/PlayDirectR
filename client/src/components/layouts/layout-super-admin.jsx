import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const SuperAdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div>
      <div className="bg-white shadow-md w-full px-3 py-3 sticky top-0 z-50">
        <div className="flex justify-between max-w-[1540px] mx-auto items-center">
          <div className="space-x-3">
            <Link
              to={"/super-admin/dashboard"}
              className="font-bold text-2xl text-black hover:text-black"
            >
              PlayDirect
            </Link>
            <Link
              to={"/super-admin/admin"}
              className="font-bold text-black hover:text-black text-xl"
            >
              Admin
            </Link>
          </div>
          <button onClick={logout} className="p-0 text-red-500 bg-white">
            Logout
          </button>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto mt-3">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
