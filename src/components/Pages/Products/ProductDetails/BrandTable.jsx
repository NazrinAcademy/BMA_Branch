import React, { useState } from "react";

const BrandTable = ({ brands, loading, startIndex, onEdit }) => {
  const [contextMenu, setContextMenu] = useState(null);

  const handleContextMenu = (event, brand) => {
    event.preventDefault();
    setContextMenu({
      brand,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleEdit = (brand) => {
    onEdit(brand); // Pass selected brand to the parent for modal
    setContextMenu(null);
  };

  return (
    <>
      {/* Table */}
      <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
        {loading.isLoading ? (
          <div className="p-4 text-center text-sm text-[#202020]">
            {loading.message || "Loading brands..."}
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-[#f8f8f8]">
              <tr className="text-sm font-semibold">
                <th className="p-3 w-24">S.No</th>
                <th className="p-3 w-auto">Brand</th>
              </tr>
            </thead>
            <tbody>
              {brands.length > 0 ? (
                brands.map((brand, index) => (
                  <tr
                    key={brand.id || index}
                    className="border-b text-sm font-normal"
                    onContextMenu={(e) => handleContextMenu(e, brand)}
                  >
                    <td className="px-6 py-4">{startIndex + index + 1}</td>
                    <td className="px-6 py-4">{brand.brand_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-6 py-4 text-center">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="absolute z-100 bg-white shadow-md border rounded"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ul>
            <li
              onClick={() => handleEdit(contextMenu.brand)}
              className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Edit
            </li>
            <li className="px-6 py-2 hover:bg-gray-100 cursor-pointer">
              Delete
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default BrandTable;
