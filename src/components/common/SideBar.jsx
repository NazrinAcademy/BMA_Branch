import React, { useState } from "react";
import { Link ,useLocation} from "react-router-dom";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  WalletCards,
  ShoppingBag,
  BadgeIndianRupee,
  ClipboardList,
  UsersRound,
  ChevronRight,
  Settings, 
} from "lucide-react";
import frame from "../../assets/Frame 14.png";

const menuItems = [
  { name: "Dashboard", icon: <LayoutDashboard />, subMenu: [{ name: "Dashboard1", path: "/dashboard1" }, { name: "Dashboard2", path: "/dashboard2" }, {name:"Dasboard3",path:"/dasboard"}] },
  { name: "Sale", icon: <ChartNoAxesCombined />, subMenu: [{ name: "Sale Invoice ", path: "/dashboard/saleInvoiceList" }, {name:"Quotation",path:"/dashboard/quotation"}] },
  { name: "Purchase", icon: <WalletCards />, subMenu: [{ name: "Purchase Invoice", path: "/dashboard/purchaseInvoiceList" },{name:"Purchase Return",path:"/dashboard/purchaseReturnList"}] },
  { name: "Product", icon: <ShoppingBag />, subMenu: [{ name: "List Products", path: "/dashboard/listProduct" }, { name: "Add Products", path: "/dashboard/addProduct" },{ name: "Categories", path: "/dashboard/categories" },{ name: "Sub Category", path: "/dashboard/subCategories" },{ name: "Brand", path: "/dashboard/brands" },{ name: "Units", path: "/dashboard/units" },{ name: "PrintLabels", path: "/printlabels" }] },
  { name: "Expense", icon: <BadgeIndianRupee />, subMenu: [{ name: "Expense 1", path: "/expense1" }] },
  { name: "Contacts", icon: <UsersRound />, subMenu: [{ name: "Supplier", path: "/dashboard/supplier" }, { name: "Customer", path: "/dashboard/customer" }] },
  { name: "Report", icon: <ClipboardList />, subMenu: [{ name: "Report 1", path: "/report1" }] },
  { name: "Setting", icon: <Settings />, path: "/settings" },
];

const SidebarItem = ({ item, isOpen, activeDropdown, setActiveDropdown }) => {
  const location =useLocation()
  
  const isActive = activeDropdown === item.name;

  return (
    <div>
      <div
        className={`flex items-center gap-4 p-3 cursor-pointer text-[#838383] hover:bg-[#F2F1FF] rounded-md transition-all duration-300 ${
          isActive ? "bg-[#F2F1FF]" : ""
        }`}
        onClick={() => setActiveDropdown(isActive ? "" : item.name)}
      >
        {item.icon}
        {isOpen ? (
          <Link to={item.path || "#"} className="text-[#838383] transition-all font-jakarta duration-300">
            {item.name}
          </Link>
        ) : (
          <span className="hidden">{item.name}</span>
        )}
        {item.subMenu && isOpen && (
          <ChevronRight className={`ml-auto transition-transform ${isActive ? "rotate-90" : ""}`} />
        )}
      </div>

      {isActive && item.subMenu && isOpen && (
        <ul className="text-center space-y-2 transition-all duration-300">
          {item.subMenu.map((sub, index) => {
            const isSubActive = location.pathname === sub.path;
            return (
              <li key={index}>
                <Link
                  to={sub.path}
                  className={`block text-[#838383] font-jakarta mt-3  py-2 hover:bg-[#F2F1FF] rounded cursor-pointer ${
                    isSubActive ? "bg-[#F2F1FF]" : ""
                  }`} 
                >
                  {sub.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const SideBar = ({ isOpen }) => {
  const [activeDropdown, setActiveDropdown] = useState("");

  return (
    <aside className={`rounded-sm bg-[#FFFFFF] ${isOpen ? "w-52 overflow-y-auto" : "w-14 overflow-hidden"} h-screen border border-gray-300 transition-all duration-500`}>
      <div className="flex items-center justify-center py-4">
        <img src={frame} className="w-9 h-auto" alt="Logo" />
        {isOpen && <h1 className="text-[#202020] font-jakarta text-base font-semibold ml-3 transition-all duration-300">Grafin Mobiles</h1>}
      </div>
      <div className="border border-[#C9C9CD] mx-auto w-40 mb-5"></div>

      <nav>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.name}
            item={item}
            isOpen={isOpen}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
          />
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
