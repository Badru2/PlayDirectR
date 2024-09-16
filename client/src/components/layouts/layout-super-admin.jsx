import React from "react";
import { Link, Outlet } from "react-router-dom";

const SuperAdminLayout = () => {
  return (
    <div>
      <div className="bg-white shadow-md w-full px-3 py-3 sticky top-0 z-50">
        <div className="flex justify-between max-w-[1540px] mx-auto items-center">
          <Link to={"/super-admin/dashboard"} className="font-bold text-2xl">
            PlayDirect
          </Link>
          <Link to={"/super-admin/admin"} className="font-bold">
            Admin
          </Link>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto mt-3">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;
