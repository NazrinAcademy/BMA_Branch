import React, { useState } from "react";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  WalletCards,
  ShoppingBag,
  BadgeIndianRupee,
  ClipboardList,
  Settings,
} from "lucide-react";
// import frame from "../../assets/Frame 14.png";
import { ChevronRight } from "lucide-react";
import { UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [dropdownOpen, setdropdownOpen] = useState("");

  const toggleDropdown = (dropdownName) => {
    setdropdownOpen((prev) => (prev === dropdownName ? "" : dropdownName));
  };

  return (
    <aside className="bg-[#202020] w-[200px] h-screen border border-gray-300 overflow-y-auto   ">
      <div className="flex items-center justify-center py-4">
        {/* <img src={frame} className="w-9 h-auto" alt="Logo" /> */}
        <h1 className="text-white text-base font-jakarta font-semibold ml-3 ">
          Grafin Mobiles
        </h1>
      </div>

      <div className="border border-[#C9C9CD] container mx-auto px-auto w-40 mb-5"></div>
      <nav className="">
        <ul className="space-y-2 ">
          <li
            className={`flex font-jakarta font-normal items-center gap-4 p-3 cursor-pointer ${
              dropdownOpen === "dashboard"
                ? "bg-[#464646] rounded text-[#f2f1ff] "
                : "text-[#f2f1ff] hover:bg-[#464646] hover:rounded"
            }`}
            onClick={() => toggleDropdown("dashboard")}
          >
            <LayoutDashboard />
            Dashboard
            <ChevronRight
              className={`transition-transform ${
                dropdownOpen === "dashboard" ? "rotate-90" : ""
              } `}
            />
          </li>
          {dropdownOpen === "dashboard" && (
            <ul className=" space-y-2 ">
              <li className="flex pl-11 font-jakarta font-normal text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
                Dashboard1
              </li>
              <li className="flex pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
                Dashboard2
              </li>
              <li className="flex pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
                Dashboard3
              </li>
            </ul>
          )}
        </ul>
      </nav>
      <nav>
        <ul className="space-y-2 ">
          <li
            className={`flex items-center font-jakarta gap-4 p-3 cursor-pointer ${
              dropdownOpen === "sale"
                ? "bg-[#464646] rounded text-[#f2f1ff]"
                : "text-[#f2f1ff] hover:bg-[#464646] hover:rounded"
            }`}
            onClick={() => toggleDropdown("sale")}
          >
            <ChartNoAxesCombined />
            Sale
            <ChevronRight
              className={`transition-transform ${
                dropdownOpen === "sale" ? "rotate-90" : ""
              } ml-12`}
            />
          </li>
          {dropdownOpen === "sale" && (
            <ul className="space-y-2">
            
                <Link to={'/addSale'} className="text-[#f2f1ff] font-jakarta  pl-11 p-2 flex hover:bg-[#464646] hover:rounded">
                Add Sale
                </Link>
            
              <li className="text-[#f2f1ff] font-jakarta pl-11 p-2 hover:bg-[#464646] hover:rounded">
                Sale 2
              </li>
              <li className="text-[#f2f1ff] font-jakarta pl-11 p-2 hover:bg-[#464646] hover:rounded">
                Sale 3
              </li>
            </ul>
          )}
        </ul>
      </nav>
      <nav>
        <ul className="space-y-2 ">
          <li
            className={`flex items-center gap-4 p-3 font-jakarta cursor-pointer ${
              dropdownOpen === "purchase"
                ? "bg-[#464646] text-[#f2f1ff] rounded"
                : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
            }`}
            onClick={() => toggleDropdown("purchase")}
          >
            <WalletCards />
            Purchase
            <ChevronRight
              className={`transition-transform ${
                dropdownOpen === "purchase" ? "rotate-90" : ""
              } ml-3`}
            />
          </li>
          {dropdownOpen === "purchase" && (
            <ul>
              <li className="text-[#f2f1ff] font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                purchase 1
              </li>
              <li className="text-[#f2f1ff]  font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                purchase 2
              </li>
              <li className="text-[#f2f1ff] font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                purchase 3
              </li>
            </ul>
          )}
        </ul>
      </nav>
      <nav>
        <ul className="space-y-2">
          <li
            className={`flex items-center gap-4 p-3 font-jakarta cursor-pointer ${
              dropdownOpen === "product"
                ? "bg-[#464646] text-[#f2f1ff] rounded"
                : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
            }`}
            onClick={() => toggleDropdown("product")}
          >
            <ShoppingBag />
            Product
            <ChevronRight
              className={`transition-transform ${
                dropdownOpen === "product" ? "rotate-90" : ""
              } ml-5 `}
            />
          </li>

          {dropdownOpen === "product" && (
            <ul className=" space-y-2">
              <Link
                to="/listProduct"
                className="flex pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded"
              >
                List Product
              </Link>
              {/* <li className="flex pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
                  Add Product
                </li> */}
              <Link
                to="/addproduct"
                className="flex font-jakarta pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded"
              >
                Add Product
              </Link>

              <Link
                to="/category"
                className="flex pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded"
              >
                Category
              </Link>
              <Link
                to="/subCategory"
                className="flex pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded"
              >          
              Sub Category
              </Link>
              <Link
                to="/brand"
                className="flex pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded"
              >    
                           Brand
             </Link>
             <Link
                to="/unit"
                className="flex pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded"
              >    
                           Units
             </Link>
              <li className="flex pl-11 font-jakarta text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
                Print Lables
              </li>
            </ul>
          )}
        </ul>
      </nav>
      <nav>
        <ul className="space-y-2 ">
          <li
            className={`flex items-center font-jakarta gap-4 p-3 cursor-pointer ${
              dropdownOpen === "expense"
                ? "bg-[#464646] text-[#f2f1ff] rounded"
                : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
            }`}
            onClick={() => toggleDropdown("expense")}
          >
            <BadgeIndianRupee />
            Expense
            <ChevronRight
              className={`transition-transform ${
                dropdownOpen === "expense" ? "rotate-90" : ""
              } ml-4`}
            />
          </li>
          {dropdownOpen === "expense" && (
            <ul>
              <li className="text-[#f2f1ff] font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                Expense 1
              </li>
              <li className="text-[#f2f1ff] font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                Expense 2
              </li>
              <li className="text-[#f2f1ff] font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                Expense 3
              </li>
            </ul>
          )}
        </ul>
      </nav>
      <nav>
        <ul className="space-y-2 ">
          <li
            className={`flex items-center font-jakarta gap-4 p-3 cursor-pointer ${
              dropdownOpen === "Contacts"
                ? "bg-[#464646] text-[#f2f1ff] rounded"
                : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
            }`}
            onClick={() => toggleDropdown("Contacts")}
          >
            <UsersRound />
            Contacts
            <ChevronRight
              className={`transition-transform ${
                dropdownOpen === "Contacts" ? "rotate-90" : ""
              } ml-2`}
            />
          </li>
          {dropdownOpen === "Contacts" && (
            <ul>
              <Link
                to="/supplier"
                className="text-[#f2f1ff] font-jakarta flex p-2 pl-11 hover:bg-[#464646]  hover:rounded "
              >
                Supplier
              </Link>
              <li className="text-[#f2f1ff] font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                Customer
              </li>
            </ul>
          )}
        </ul>
      </nav>
      <nav>
        <ul className="space-y-2 ">
          <li
            className={`flex items-center font-jakarta gap-4 p-3 cursor-pointer ${
              dropdownOpen === "report "
                ? "bg-[#464646] text-[#f2f1ff] rounded"
                : "hover:bg-[#464646] text-[#f2f1ff] hover:rounded"
            }`}
            onClick={() => toggleDropdown("report")}
          >
            <ClipboardList />
            Report
            <ChevronRight
              className={`transition-transform ${
                dropdownOpen === "report" ? "rotate-90" : ""
              } ml-6`}
            />
          </li>
          {dropdownOpen === "report" && (
            <ul>
              <li className="text-[#f2f1ff] font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                report 1
              </li>
              <li className="text-[#f2f1ff] font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                report 2
              </li>
              <li className="text-[#f2f1ff] font-jakarta p-2 pl-11 hover:bg-[#464646] hover:rounded">
                report 3
              </li>
            </ul>
          )}
        </ul>
      </nav>
      <nav>
        <ul className="space-y-4 hover:bg-[#464646]  hover:rounded">
          <li className="flex items-center font-jakarta gap-4 text-[#f2f1ff] p-3">
            <Settings />
            Settings
          </li>
        </ul>
      </nav>
    </aside>
  );
};
export default SideBar;

// import React, { useState } from "react";
// import {
//   LayoutDashboard,
//   ChartNoAxesCombined,
//   WalletCards,
//   ShoppingBag,
//   BadgeIndianRupee,
//   ClipboardList,
//   Settings,
//   ChevronDown,
// } from "lucide-react";
// import frame from "../../assets/Frame 14.png";
// import { Link } from "react-router-dom";

// const SideBar = () => {
//   const [activeDropdown, setActiveDropdown] = useState("");

//   const toggleDropdown = (dropdownName) => {
//     setActiveDropdown((prev) => (prev === dropdownName ? "" : dropdownName));
//   };

//   return (
//     <aside className="bg-[#202020] w-[200px] h-screen border border-gray-300 overflow-y-auto">
//       <div className="flex items-center justify-center py-4">
//         <img src={frame} className="w-9 h-auto" alt="Logo" />
//         <h1 className="text-white text-lg font-semibold ml-3">Grafin Mobiles</h1>
//       </div>

//       <div className="border border-[#C9C9CD] container mx-auto w-40"></div>

//       <nav>
//         <ul className="space-y-2">
//           {/* Dashboard */}
//           <li
//             className="flex items-center gap-4 text-[#f2f1ff] p-3 hover:bg-[#464646] hover:rounded cursor-pointer"
//             onClick={() => toggleDropdown("dashboard")}
//           >
//             <LayoutDashboard />
//             Dashboard
//             <ChevronDown
//               className={`ml-auto transition-transform ${
//                 activeDropdown === "dashboard" ? "rotate-180" : ""
//               }`}
//             />
//           </li>
//           {activeDropdown === "dashboard" && (
//             <ul className="space-y-2">
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/dashboard1">Dashboard 1</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/dashboard2">Dashboard 2</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/dashboard3">Dashboard 3</Link>
//               </li>
//             </ul>
//           )}

//           {/* Sale */}
//           <li
//             className="flex items-center gap-4 text-[#f2f1ff] p-3 hover:bg-[#464646] hover:rounded cursor-pointer"
//             onClick={() => toggleDropdown("sale")}
//           >
//             <ChartNoAxesCombined />
//             Sale
//             <ChevronDown
//               className={`ml-auto transition-transform ${
//                 activeDropdown === "sale" ? "rotate-180" : ""
//               }`}
//             />
//           </li>
//           {activeDropdown === "sale" && (
//             <ul className="space-y-2">
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/sale1">Sale 1</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/sale2">Sale 2</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/sale3">Sale 3</Link>
//               </li>
//             </ul>
//           )}

//           {/* Purchase */}
//           <li
//             className="flex items-center gap-4 text-[#f2f1ff] p-3 hover:bg-[#464646] hover:rounded cursor-pointer"
//             onClick={() => toggleDropdown("purchase")}
//           >
//             <WalletCards />
//             Purchase
//             <ChevronDown
//               className={`ml-auto transition-transform ${
//                 activeDropdown === "purchase" ? "rotate-180" : ""
//               }`}
//             />
//           </li>
//           {activeDropdown === "purchase" && (
//             <ul className="space-y-2">
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/purchase1">Purchase 1</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/purchase2">Purchase 2</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/purchase3">Purchase 3</Link>
//               </li>
//             </ul>
//           )}

//           {/* Product */}
//           <li
//             className="flex items-center gap-4 text-[#f2f1ff] p-3 hover:bg-[#464646] hover:rounded cursor-pointer"
//             onClick={() => toggleDropdown("product")}
//           >
//             <ShoppingBag />
//             Product
//             <ChevronDown
//               className={`ml-auto transition-transform ${
//                 activeDropdown === "product" ? "rotate-180" : ""
//               }`}
//             />
//           </li>
//           {activeDropdown === "product" && (
//             <ul className="space-y-2">
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/listproduct">List Product</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/addproduct">Add Product</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/category">Category</Link>
//               </li>
//             </ul>
//           )}

//           {/* Expense */}
//           <li
//             className="flex items-center gap-4 text-[#f2f1ff] p-3 hover:bg-[#464646] hover:rounded cursor-pointer"
//             onClick={() => toggleDropdown("expense")}
//           >
//             <BadgeIndianRupee />
//             Expense
//             <ChevronDown
//               className={`ml-auto transition-transform ${
//                 activeDropdown === "expense" ? "rotate-180" : ""
//               }`}
//             />
//           </li>
//           {activeDropdown === "expense" && (
//             <ul className="space-y-2">
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/expense1">Expense 1</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/expense2">Expense 2</Link>
//               </li>
//             </ul>
//           )}

//           {/* Report */}
//           <li
//             className="flex items-center gap-4 text-[#f2f1ff] p-3 hover:bg-[#464646] hover:rounded cursor-pointer"
//             onClick={() => toggleDropdown("report")}
//           >
//             <ClipboardList />
//             Report
//             <ChevronDown
//               className={`ml-auto transition-transform ${
//                 activeDropdown === "report" ? "rotate-180" : ""
//               }`}
//             />
//           </li>
//           {activeDropdown === "report" && (
//             <ul className="space-y-2">
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/report1">Report 1</Link>
//               </li>
//               <li className="pl-11 text-[#f2f1ff] p-2 hover:bg-[#464646] hover:rounded">
//                 <Link to="/report2">Report 2</Link>
//               </li>
//             </ul>
//           )}

//           {/* Settings */}
//           <li className="flex items-center gap-4 text-[#f2f1ff] p-3 hover:bg-[#464646] hover:rounded cursor-pointer">
//             <Settings />
//             <Link to="/settings">Settings</Link>
//           </li>
//         </ul>
//       </nav>
//     </aside>
//   );
// };

// export default SideBar;
