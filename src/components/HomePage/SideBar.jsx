// import React, { useState } from "react";
// import {
//   LayoutDashboard,
//   ChartNoAxesCombined,
//   WalletCards,
//   ShoppingBag,
//   BadgeIndianRupee,
//   ClipboardList,
//   Settings,
// } from "lucide-react";
// import frame from "../../assets/Frame 14.png";
// import { ChevronRight } from "lucide-react";
// import { UsersRound } from "lucide-react";
// import { Link } from "react-router-dom";

// const SideBar = ({isOpen}) => {
//   const [dropdownOpen, setdropdownOpen] = useState("");
//   const [dropdownOpenChild, setdropdownOpenChild] = useState("");

//   const toggleDropdown = (dropdownName) => {
//     setdropdownOpen((prev) => (prev === dropdownName ? "" : dropdownName));
//   };
//   const toggleChidDropdown = (childdropdownName) => {
//     setdropdownOpenChild((prev) =>
//       prev === childdropdownName ? "" : childdropdownName
//     );
//   };

//   return (
//     <>

    
//   <aside className={`bg-[#202020] ${isOpen ?"w-14":"w-52"} duration-500 w-[200px] h-screen border border-gray-300 overflow-y-auto   `}>
//       <div className="flex items-center justify-center py-4">
//         <img src={frame} className="w-9 h-auto" alt="Logo" />
//         <h1 className={`${isOpen ?"w-0":"text-white text-base font-jakarta font-semibold ml-3"} `}>
//           Grafin Mobiles
//         </h1>
//       </div>

//       <div className="border border-[#C9C9CD] container mx-auto px-auto w-40 mb-5"></div>
//       <nav className="">
   
//         <ul className="flex justify-center ml-5 ">
//         <button className=" text-white">
//             <LayoutDashboard size={24}  className={``}/>
//             </button>
//           <li
//             className={`flex ${isOpen && "translate-x-28 overflow-hidden opacity-0"} font-jakarta font-medium text-base items-center gap-4 p-3 cursor-pointer ${
//               dropdownOpen === "dashboard"
//                 ? "bg-[#464646] rounded text-[#f2f1ff] "
//                 : "text-[#f2f1ff] hover:bg-[#464646] hover:rounded"
//             }`}
//             onClick={() => toggleDropdown("dashboard")}
//           >
             
          
//             Dashboard
//             <ChevronRight
//               className={`transition-transform ${
//                 dropdownOpen === "dashboard" ? "rotate-90" : ""
//               } `}
//             />
          
           
//           </li>
//           {dropdownOpen === "dashboard" && (
//             <ul className=" space-y-2 ">
//               <li className="flex pl-11 font-jakarta font-medium text-base text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 Dashboard1
//               </li>
//               <li className="flex pl-11 font-jakarta font-medium text-base text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 Dashboard2
//               </li>
//               <li className="flex pl-11 font-jakarta font-medium text-base text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 Dashboard3
//               </li>
//             </ul>
//           )}
//         </ul>
//       </nav>
//       <nav>
//         <ul className="flex justify-center ml-5 ">
//           <button className="text-white">
//           <ChartNoAxesCombined />
//           </button>
        
//           <li
//             className={`flex ${isOpen  && "translate-x-28 overflow-hidden opacity-0"} items-center font-medium text-base font-jakarta gap-4 p-3 cursor-pointer ${
//               dropdownOpen === "sale"
//                 ? "bg-[#464646] rounded text-[#f2f1ff]"
//                 : "text-[#f2f1ff] hover:bg-[#464646] hover:rounded"
//             }`}
//             onClick={() => toggleDropdown("sale")}
//           >
        
//             Sale
//             <ChevronRight
//               className={`transition-transform ${
//                 dropdownOpen === "sale" ? "rotate-90" : ""
//               } ml-12`}
//             />
//           </li>
//           {dropdownOpen === "sale" && (
//             <ul className="space-y-2">
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta  pl-11 p-2 flex hover:bg-[#464646] hover:rounded">
//                 Sale 1
//               </li>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta pl-11 p-2 hover:bg-[#464646] hover:rounded">
//                 Sale 2
//               </li>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta pl-11 p-2 hover:bg-[#464646] hover:rounded">
//                 Sale 3
//               </li>
//             </ul>
//           )}
//         </ul>
//       </nav>
//       <nav>
//         <ul className="flex justify-center ml-5">
//           <button className="text-white"><WalletCards /></button>
//           <li
//             className={`flex ${isOpen && "translate-x-28 overflow-hidden opacity-0"} items-center gap-4 p-3 font-medium text-base font-jakarta cursor-pointer ${
//               dropdownOpen === "purchase"
//                 ? "bg-[#464646] text-[#f2f1ff] rounded"
//                 : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
//             }`}
//             onClick={() => toggleDropdown("purchase")}
//           >
            
//             Purchase
//             <ChevronRight
//               className={`transition-transform ${
//                 dropdownOpen === "purchase" ? "rotate-90" : ""
//               } ml-3`}
//             />
//           </li>
//           {dropdownOpen === "purchase" && (
//             <ul>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 purchase 1
//               </li>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 purchase 2
//               </li>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 purchase 3
//               </li>
//             </ul>
//           )}
//         </ul>
//       </nav>
//       <nav>
//         <ul className="flex justify-center ml-5">
//           <button className="text-white"> <ShoppingBag /></button>
//           <li
//             className={`flex ${isOpen  && "translate-x-28 overflow-hidden opacity-0"} items-center font-medium text-base gap-4 p-3 font-jakarta cursor-pointer ${
//               dropdownOpen === "product"
//                 ? "bg-[#464646] text-[#f2f1ff] rounded"
//                 : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
//             }`}
//             onClick={() => toggleDropdown("product")}
//           >
           
//             Product
//             <ChevronRight
//               className={`transition-transform ${
//                 dropdownOpen === "product" ? "rotate-90" : ""
//               } ml-5 `}
//             />
//           </li>

//           {dropdownOpen === "product" && (
//             <ul className=" space-y-2">
//               <Link
//                 to="/addproduct"
//                 className={`flex pl-11 font-medium text-base font-jakarta p-2 ${
//                   dropdownOpenChild === "List Product"
//                     ? "bg-[#464646] text-[#f2f1ff] rounded"
//                     : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
//                 } `}
//                 onClick={() => toggleChidDropdown("List Product")}
//               >
//                 List Product
//               </Link>
//               {/* <li className="flex pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                   Add Product
//                 </li> */}
//               <Link
//                 to="/"
//                 className={`flex pl-11 font-medium text-base font-jakarta p-2 ${
//                   dropdownOpenChild === "Add Product"
//                     ? "bg-[#464646] text-[#f2f1ff] rounded"
//                     : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
//                 } `}
//                 onClick={() => toggleChidDropdown("Add Product")}
//               >
//                 Add Product
//               </Link>

//               <Link
//                 to="/Categories"
//                 className={`flex font-medium text-base pl-11 font-jakarta p-2 ${
//                   dropdownOpenChild === "Category"
//                     ? "bg-[#464646] text-[#f2f1ff] rounded"
//                     : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
//                 } `}
//                 onClick={() => toggleChidDropdown("Category")}
              
//               >
//                 Category
//               </Link>
//               <Link to="/pgDetails" className="flex font-medium text-base font-jakarta pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 Sub Category
//               </Link>
//               <li className="flex font-medium text-base pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 Brand
//               </li>
//               <li className="flex font-medium text-base pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 Units
//               </li>
//               <li className="flex font-medium text-base pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 Print Lables
//               </li>
//             </ul>
//           )}
//         </ul>
//       </nav>
//       <nav>
//         <ul className="flex justify-center ml-5">
//           <button className="text-white">   <BadgeIndianRupee /></button>
//           <li
//             className={`flex ${isOpen && "translate-x-28 overflow-hidden opacity-0"} items-center font-medium text-base font-jakarta gap-4 p-3 cursor-pointer ${
//               dropdownOpen === "expense"
//                 ? "bg-[#464646] text-[#f2f1ff] rounded"
//                 : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
//             }`}
//             onClick={() => toggleDropdown("expense")}
//           >
         
//             Expense
//             <ChevronRight
//               className={`transition-transform ${
//                 dropdownOpen === "expense" ? "rotate-90" : ""
//               } ml-4`}
//             />
//           </li>
//           {dropdownOpen === "expense" && (
//             <ul>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 Expense 1
//               </li>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 Expense 2
//               </li>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 Expense 3
//               </li>
//             </ul>
//           )}
//         </ul>
//       </nav>
//       <nav>
//         <ul className="flex justify-center ml-5 ">
//           <button className="text-white">   <UsersRound /></button>
//           <li
//             className={`flex ${isOpen && "translate-x-28 overflow-hidden opacity-0"} items-center font-medium text-base font-jakarta gap-4 p-3 cursor-pointer ${
//               dropdownOpen === "Contacts"
//                 ? "bg-[#464646] text-[#f2f1ff] rounded"
//                 : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
//             }`}
//             onClick={() => toggleDropdown("Contacts")}
//           >
         
//             Contacts
//             <ChevronRight
//               className={`transition-transform ${
//                 dropdownOpen === "Contacts" ? "rotate-90" : ""
//               } ml-2`}
//             />
//           </li>
//           {dropdownOpen === "Contacts" && (
//             <ul>
//               <Link
//                 to="/supplier"
//                 className={`flex pl-11 font-medium text-base font-jakarta p-2 ${
//                   dropdownOpenChild === "Supplier"
//                     ? "bg-[#464646] text-[#f2f1ff] rounded"
//                     : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
//                 } `}
//                 onClick={() => toggleChidDropdown("Supplier")}
//               >
//                 Supplier
//               </Link>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 Customer
//               </li>
//             </ul>
//           )}
//         </ul>
//       </nav>
//       <nav>
//         <ul className="flex justify-center ml-5 ">
//           <button className="text-white"><ClipboardList /></button>
//           <li
//             className={`flex ${isOpen && "translate-x-28 overflow-hidden opacity-0"} items-center font-medium text-base font-jakarta gap-4 p-3 cursor-pointer ${
//               dropdownOpen === "report "
//                 ? "bg-[#464646] text-[#f2f1ff] rounded"
//                 : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
//             }`}
//             onClick={() => toggleDropdown("report")}
//           >
        
//             Report
//             <ChevronRight
//               className={`transition-transform ${
//                 dropdownOpen === "report" ? "rotate-90" : ""
//               } ml-6`}
//             />
//           </li>
//           {dropdownOpen === "report" && (
//             <ul className="flex justify-center">
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 report 1
//               </li>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 report 2
//               </li>
//               <li className="text-[#f2f1ff] font-medium text-base font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
//                 report 3
//               </li>
//             </ul>
//           )}
//         </ul>
//       </nav>
//       <nav>
//         <ul className=" hover:bg-[#464646]  hover:rounded flex justify-center ml-5 " >
//           <button className="text-white"><Settings /></button>
//             <li className={`flex ${isOpen && "translate-x- overflow-hidden opacity-0"} items-center font-jakarta font-medium text-base  text-[#f2f1ff] p-3`}>
     
//             Settings
//           </li>
//         </ul>
//       </nav>
//     </aside>
//     </>
//   );
// };
// export default SideBar;
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
  { name: "Product", icon: <ShoppingBag />, subMenu: [{ name: "ListProducts", path: "/listproduct" }, { name: "Add Product", path: "/" },{ name: "Categories", path: "/Categories" },{ name: "SubCategories", path: "/subCategories" },{ name: "Brand", path: "/brand" },{ name: "Units", path: "/units" },{ name: "PrintLabels", path: "/printlabels" }] },
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
