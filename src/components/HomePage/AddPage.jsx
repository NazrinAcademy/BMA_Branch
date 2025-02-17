import React from "react";
import productimg from "../../assets/productimg.png";

const AddPage = () => {
  return (
    <>
    <main className="flex-1 container mx-auto flex items-center  justify-center h-full  ">
      <div className="text-center max-w-lg ">
        <div className="flex justify-center mb-6">
          <img src={productimg} className="w-24 h-24" alt="Product" />
        </div>
        <h1 className="text-2xl font-semibold font-jakarta">Your Inventory Awaits!</h1>
        <p className="text-gray-500 font-jakarta mt-4">
          Your inventory is empty—add your first product to get
          <br /> started! Start building your product list and
          <br /> take your business to the next level.
        </p>
        <button className="mt-6 px-6 py-3 font-jakarta bg-[#593fa9] text-white rounded-lg shadow">
          Add New Product
        </button>
      </div>
    </main>
    </>
  );
};

export default AddPage;
