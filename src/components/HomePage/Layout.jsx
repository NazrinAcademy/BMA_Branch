// import SideBar from "../HomePage/SideBar";
// import React from "react";
// import Nav from "./Nav";
// import AddPage from "./AddPage";

// const Layout = () => {
//   return (
//     <>
//       <div className="flex fixed ">
//         <SideBar />
//         <div className="flex-1 ">
//           <Nav />
//           <main className="w-full h-full bg-[#E8E5FF]">
//             <AddPage />
//           </main>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Layout;

import React from "react";
import SideBar from "../HomePage/SideBar";
import Nav from "./Nav";
import AddPage from "./AddPage";

const Layout = () => {
  return (
    <div className="flex  ">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Nav />
        <main className="w-full h-full  bg-[#e8e5ff]  ">
          <AddPage />
        </main>
      </div>
    </div>
  );
};

export default Layout;
