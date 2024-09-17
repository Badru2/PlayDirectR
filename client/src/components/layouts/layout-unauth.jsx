import React from "react";
import { Outlet } from "react-router-dom";

const UnauthLayout = () => {
  return (
    <section>
      <div className="min-h-screen flex">
        <main className="w-1/3 mx-auto self-center">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default UnauthLayout;
