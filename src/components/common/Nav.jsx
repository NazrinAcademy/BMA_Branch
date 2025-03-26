import React from "react";
import {
  Settings,
  MessageCircleQuestion,
  Calculator,
  BookKey,
  CalendarDays,
  Bell,
} from "lucide-react";
import { Text } from 'lucide-react';

const Nav = ({ toggleSidebar,isOpen}) => {
  return (
    <>
    <nav className="bg-white w-full h-[70px] border border-gray-300 ">
      <div className="container mx-auto  px-4 flex justify-between ">
        <div className={`py-5 text-gray-500 cursor-pointer  ${isOpen ?"rotate-180":"rotate-60"}`}onClick={ toggleSidebar}>
          <Text/>
        </div>
      
        <ul className="flex gap-4 py-4 text-gray-500">
          <li className="">
            <MessageCircleQuestion />
          </li>
          <li>
          <CalendarDays />
          </li>
       
          <li>
            <BookKey />
          </li>
       
          <li>
            <Calculator />
          </li>
          <li>
            <Settings />
          </li>
          <li>
            <Bell />
          </li>
        </ul>
      </div>
    </nav>
    </>
  );
};

export default Nav;


