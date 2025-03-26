import React, { useEffect, useState } from "react";

const BrandTable = ({ 
  brands,
  setBrands,
  contextMenu,
  handleEdit,
  setContextMenu,
  handleDelete
 }) => {


     // Open Context Menu on Right Click
     const handleContextMenu = (event, brand) => {
      event.preventDefault(); // 🚀 Prevent default context menu
      setContextMenu({
        x: event.pageX,
        y: event.pageY,
        product: brand, // 👈 Brand data set pannirukom
      });
    };
    
   // ---------------------------------  Handle Click Outside --------------------------
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest(".context-menu")) {
        setContextMenu(null);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);
     

  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto">
        <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#f8f8f8]">
              <tr className="text-sm font-semibold">
                <th className="p-3 w-24">S.No</th>
                <th className="p-3 w-auto">Brand</th>
              </tr>
            </thead>
            <tbody>
              {brands.length > 0 ? (
                brands?.map((brand, index) => (
                  <tr
                    key={brand.id || index}
                    onContextMenu={(e) => handleContextMenu(e, brand)} 
                    className="border-b text-center text-sm font-normal"
                  >
                    <td className="px-6 py-4">{ index + 1}</td>

                    {/* Brand Name Column */}
                    <td className="px-6 py-4">{brand.brand_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center">No results found</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>

        {/* ------------------------------------------ Context Menu -----------------------------------------------*/}
        {contextMenu && (
          <div
            className="absolute z-100 bg-white shadow-md border rounded"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <ul>

              <li
                onClick={() => handleEdit(contextMenu.product)}
                className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Edit
              </li>
              <li
                onClick={() => handleDelete(contextMenu.product)}
                className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Delete
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default BrandTable;
