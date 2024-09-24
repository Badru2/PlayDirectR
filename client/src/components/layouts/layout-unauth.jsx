import React from "react";
import { Outlet } from "react-router-dom";

const UnauthLayout = () => {
  return (
    <section
    // style={{
    //   background:
    //     "radial-gradient(circle, rgba(9,9,121,1) 8%, rgba(0,73,255,1) 50%, rgba(9,9,121,1) 90%)",
    // }}
    >
      <div className="min-h-screen flex bg-[#F6DCAC]">
        <main className="w-full mx-16 lg:w-1/4 lg:mx-auto self-center relative">
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 rounded-full bg-[#FAA968]" />
          <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 rounded-full bg-[#FAA968]" />
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default UnauthLayout;
