// import React from "react";
// import product from "..//..//assets/product.png"

// const AddPage = () => {
//   return (
//     <>
//        <main className="flex-1 container mx-auto min-h-full flex items-center justify-center">
//           <div className="text-center  max-w-md  ">
//             <div className="flex justify-center mb-4">
//               <div className="w-24 h-24">
//                 <img src={product}/>
//               </div>
//             </div>
//             <h1 className="text-2xl font-semibold">Your Inventory Awaits!</h1>
//             <p className="text-[#838383] mt-2">
//               Your inventory is empty—add your first product to <br/>get started!
//               Start building your product list<br/> and take your business to the
//               next level.
//             </p>
//             <button className="mt-6 px-6 py-2 bg-[#593FA9] text-white rounded-lg shadow ">
//               Add New Product
//             </button>
//           </div>
//         </main>


  
//     </>
   
//   );
// };

// export default AddPage;

import React from "react";
import product from "../../assets/product.png";

const AddPage = () => {
  return (
    <main className="flex-1 container mx-auto flex items-center justify-center min-h-screen fixed"> 
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <img src={product} className="w-24 h-24" alt="Product" />
        </div>
        <h1 className="text-2xl font-semibold">Your Inventory Awaits!</h1>
        <p className="text-gray-500 mt-4">
          Your inventory is empty—add your first product to get<br/> started!
          
          Start building your product list and<br/> take your business to the next level.
        </p>
        <button className="mt-6 px-6 py-3 bg-[#593fa9] text-white rounded-lg shadow">
          Add New Product
        </button>
      </div>
    </main>
  );
};

export default AddPage;
