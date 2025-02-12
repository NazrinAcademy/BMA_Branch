import React from "react";
import { Settings, MessageCircleQuestion, Calculator, Download, Bell } from "lucide-react";

const Nav = () => {
  return (
    <nav className="bg-white w-full h-[70px] border border-gray-300 ">
      <div className="container mx-auto  px-4 flex justify-end ">
        <ul className="flex gap-4 py-4 text-gray-500">
          <li className=""><MessageCircleQuestion /></li>
          <li><Calculator /></li>
          <li><Settings /></li>
          <li><Download /></li>
          <li><MessageCircleQuestion /></li>
          <li><Calculator /></li>
          <li><Settings /></li>
          <li><Bell /></li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;

