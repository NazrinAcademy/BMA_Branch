import React, { useState } from "react";
import SideBar from "../HomePage/SideBar";
import Nav from "../HomePage/Nav";
import { Outlet } from "react-router";

const Layout = () => {
  const [isOpen,setisOpen]=useState(false); 
  return (
    <div className={`flex fixed w-full h-scree`}>
      <SideBar isOpen={!isOpen}  />
      <div className="flex-1 flex flex-col">
        <Nav isOpen={! isOpen}  toggleSidebar={() => setisOpen(!isOpen)}/>
        <main className="w-full h-full bg-[#f3f3f3] p-5 ">

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
