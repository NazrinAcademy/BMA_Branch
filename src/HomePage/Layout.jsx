import React from "react";
import SideBar from "../HomePage/SideBar";
import Nav from "../HomePage/Nav";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex fixed w-full h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Nav />
        <main className="w-full h-full bg-[#e8e5ff] p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
