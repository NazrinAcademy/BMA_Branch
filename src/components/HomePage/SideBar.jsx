
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
  { name: "Sale", icon: <ChartNoAxesCombined />, subMenu: [{ name: "Sale 1", path: "/sale1" }, { name: "Sale 2", path: "/sale2" }, {name:"Sale3",path:"/sale"}] },
  { name: "Purchase", icon: <WalletCards />, subMenu: [{ name: "Purchase 1", path: "/purchase1" },{name:"Purchase2",path:"/purchase"}] },
  { name: "Product", icon: <ShoppingBag />, subMenu: [{ name: "ListProducts", path: "/listproduct" }, { name: "Add Product", path: "/addProduct" },{ name: "Categories", path: "/categories" },{ name: "SubCategories", path: "/subCategories" },{ name: "Brand", path: "/brand" },{ name: "Units", path: "/units" },{ name: "PrintLabels", path: "/printlabels" }] },
  { name: "Expense", icon: <BadgeIndianRupee />, subMenu: [{ name: "Expense 1", path: "/expense1" }] },
  { name: "Contacts", icon: <UsersRound />, subMenu: [{ name: "Supplier", path: "/supplier" }, { name: "Customer", path: "/customer" }] },
  { name: "Report", icon: <ClipboardList />, subMenu: [{ name: "Report 1", path: "/report1" }] },
  { name: "Setting", icon: <Settings />, path: "/settings" },
];

const SidebarItem = ({ item, isOpen, activeDropdown, setActiveDropdown }) => {
  const location =useLocation()
  
  const isActive = activeDropdown === item.name;

  return (
    <div>
      <div
        className={`flex items-center gap-4 p-3 cursor-pointer text-white hover:bg-[#464646] rounded transition-all duration-300 ${
          isActive ? "bg-[#464646]" : ""
        }`}
        onClick={() => setActiveDropdown(isActive ? "" : item.name)}
      >
        {item.icon}
        {isOpen ? (
          <Link to={item.path || "#"} className="text-white transition-all font-jakarta duration-300">
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
                  className={`block text-white font-jakarta mt-3  py-2 hover:bg-[#464646] rounded cursor-pointer ${
                    isSubActive ? "bg-[#464646]" : ""
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
    <aside className={`rounded-sm bg-[#202020] ${isOpen ? "w-52 overflow-y-auto" : "w-14 overflow-hidden"} h-screen border border-gray-300 transition-all duration-500`}>
      <div className="flex items-center justify-center py-4">
        <img src={frame} className="w-9 h-auto" alt="Logo" />
        {isOpen && <h1 className="text-white font-jakarta text-base font-semibold ml-3 transition-all duration-300">Grafin Mobiles</h1>}
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
