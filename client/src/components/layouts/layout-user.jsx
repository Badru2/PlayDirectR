import React from "react";
import { Link, Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <div className="bg-white shadow-md w-full px-3 py-3 sticky top-0 z-50">
        <div className="flex justify-between max-w-[1540px] mx-auto items-center">
          <Link to="/" className="font-bold text-2xl">
            PlayDirect
          </Link>

          <Link to={"/cart"} className="font-bold text-xl">
            Cart
          </Link>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
