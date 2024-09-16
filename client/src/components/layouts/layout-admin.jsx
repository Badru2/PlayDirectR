import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
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
