// import React from 'react'
// import { Settings } from 'lucide-react';
// import { MessageCircleQuestion } from 'lucide-react';
// import { Calculator } from 'lucide-react';
// import { Download } from 'lucide-react';
// import { Bell } from 'lucide-react';



// const Nav = () => {
//   return (
//     <>
  
 
//     <nav className='bg-[#fff]  w-[1080px] h-[70px] float-end border border-[#C9C9CD]'>
//       <div className='container mx-auto px-auto w-[1000px] flex justify-end'>
//         <div className='text-[rgba(131,131,131,1)]'>
         
//         </div>
//         <ul className='flex gap-5 py-4  '>
//           <li className='text-[rgba(131,131,131,1)]'><MessageCircleQuestion/></li>
//           <li className='text-[rgba(131,131,131,1)]'><Calculator/></li>
//           <li className='text-[rgba(131,131,131,1)]'><Settings/></li>
//           <li className='text-[rgba(131,131,131,1)]'><Download/></li>
//           <li className='text-[rgba(131,131,131,1)]'><MessageCircleQuestion/></li>
//           <li className='text-[rgba(131,131,131,1)]'><Calculator/></li> 
//           <li className='text-[rgba(131,131,131,1)]'><Settings/></li>
//           <li className='text-[rgba(131,131,131,1)]'><Bell/></li>
//         </ul>
//       </div>
//     </nav> 
   

    
//     </>
//   )
// }

// export default Nav;

// // import React from "react";

// // const Nav = ({ toggleSidebar }) => {
// //   return (
// //     <nav className="flex items-center justify-between p-4 bg-blue-600 text-white">
// //       <button
// //         className="text-2xl md:hidden"
// //         onClick={toggleSidebar}
// //         aria-label="Open Sidebar"
// //       >
// //         &#9776;
// //       </button>
// //       <h1 className="text-lg font-bold">My App</h1>
// //     </nav>
// //   );
// // };

// // export default Nav;

import React from "react";
import { Settings, MessageCircleQuestion, Calculator, Download, Bell } from "lucide-react";

const Nav = () => {
  return (
    <nav className="bg-white w-full h-[70px] border border-gray-300 ">
      <div className="container mx-auto px-4 flex justify-end">
        <ul className="flex gap-4 py-4 text-gray-600">
          <li><MessageCircleQuestion /></li>
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

