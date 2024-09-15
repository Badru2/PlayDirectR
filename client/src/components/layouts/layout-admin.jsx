import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <div className="bg-white shadow-md w-full px-3 py-3 sticky top-0 z-50">
        <div className="flex justify-between max-w-[1540px] mx-auto">
          <div className="font-bold text-2xl">PlayDirect</div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto mt-3">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
