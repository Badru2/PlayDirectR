import React from "react";
import { Outlet } from "react-router-dom";

const UnauthLayout = () => {
  return (
    <section
      style={{
        background:
          "radial-gradient(circle, rgba(9,9,121,1) 8%, rgba(0,73,255,1) 50%, rgba(9,9,121,1) 90%)",
      }}
    >
      <div className="min-h-screen flex">
        <main className="w-1/3 mx-auto self-center">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default UnauthLayout;
