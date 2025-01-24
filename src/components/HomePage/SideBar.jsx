//  import { LayoutDashboard, Settings } from 'lucide-react';
//  import { ChartNoAxesCombined } from 'lucide-react';
//  import { WalletCards } from 'lucide-react';
//  import { ShoppingBag } from 'lucide-react';
//  import { BadgeIndianRupee } from 'lucide-react';
//  import { ClipboardList } from 'lucide-react';
//  import frame from "../../assets/Frame 14.png";




//  const SideBar = () => {
 
//    return (
//     <>
  
//     <aside className='bg-[#202020]  w-[200px] h-screen border   border-[#C9C9CD]'>
//        <div className='flex justify-evenly py-4 text-center items-center'>
//          <div className='w-9 h-auto'>
//            <img src={frame} />
//          </div>
//          <div>
//            <h1 className='text-[#F2F1FF] text-lg font-semibold '>Grafin Mobiles </h1>
//          </div>    
//        </div>
//        <div className='border border-[#C9C9CD] container mx-auto px-auto w-40  '></div>
//        <nav className='py-4'>
//          <ul className='py-2 px-6'>
//            <li className=' flex gap-4 text-[#F2F1FF]'>   <LayoutDashboard />Dashboard </li>        
//          </ul>
//          <ul className='py-2 px-6'>
//          <li className='flex gap-4 text-[#F2F1FF]'>  <ChartNoAxesCombined /> Sale </li>               
//          </ul>
//          <ul className='py-2 px-6'>
//          <li className='flex  gap-4 text-[#F2F1FF]'>     <WalletCards /> Purchase </li>      
//          </ul>
//          <ul className='py-2 px-6'>
//            <li className='flex gap-4 text-[#F2F1FF]'>  <ShoppingBag/>    Product </li>           
//          </ul>
//          <ul className='py-2 px-6'>
//         <li className='flex  gap-4 text-[#F2F1FF]'>  <BadgeIndianRupee/>   Expense </li>      
//          </ul>
//          <ul className='py-2 px-6'>
//         <li className='flex gap-4 text-[#F2F1FF]'>  <ClipboardList/>   Report </li>      
//          </ul>
//          <ul className='py-2 px-6'>
//         <li className='flex gap-4 text-[#F2F1FF] '>  <Settings/>   Settings </li>      
//          </ul>
//        </nav>
//      </aside>    
//      </>
//    )
//  }

//  export default SideBar;

import React from "react";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  WalletCards,
  ShoppingBag,
  BadgeIndianRupee,
  ClipboardList,
  Settings,
} from "lucide-react";
import frame from "../../assets/Frame 14.png";

const SideBar = () => {
  return (
    <aside className="bg-gray-800 w-[200px] h-screen border border-gray-300">
      <div className="flex items-center justify-center py-4">
        <img src={frame} className="w-9 h-auto" alt="Logo" />
        <h1 className="text-white text-lg font-semibold ml-3">Grafin Mobiles</h1>
      </div>
      <div className="border-t border-gray-600 my-4"></div>
      <nav className="space-y-2 px-4">
        <ul className="space-y-4">
          <li className="flex items-center gap-4 text-white">
            <LayoutDashboard />
            Dashboard
          </li>
          <li className="flex items-center gap-4 text-white">
            <ChartNoAxesCombined />
            Sale
          </li>
          <li className="flex items-center gap-4 text-white">
            <WalletCards />
            Purchase
          </li>
          <li className="flex items-center gap-4 text-white">
            <ShoppingBag />
            Product
          </li>
          <li className="flex items-center gap-4 text-white">
            <BadgeIndianRupee />
            Expense
          </li>
          <li className="flex items-center gap-4 text-white">
            <ClipboardList />
            Report
          </li>
          <li className="flex items-center gap-4 text-white">
            <Settings />
            Settings
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;

