import React, { useRef, useEffect } from "react";

const SubCategoryTable = ({
  paginatedCategories,
  contextMenu,
  setContextMenu,
  setEditRowId,
  handleModalClose,
  setEditedData,
  handleDelete,
  setIsEdited,
  handleEdit,
  setIsShowModal,
  setForm,
  setSelectedState,
  setEditData,
  setEditDropdown,
  setHsnSacCode,
  setNewSubCategory
}) => {
  const categoryInputRef = useRef(null);

  // Debugging: Log categories when component renders
  useEffect(() => {
    console.log("Updated paginatedCategories:", paginatedCategories);
  }, [paginatedCategories]);

  // Debugging: Log context menu state changes
  useEffect(() => {
    console.log("Context Menu State:", contextMenu);
  }, [contextMenu]);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "hsnSacCode") {
      setHsnSacCode(value);
    } else if (field === "newSubCategory") {
      setNewSubCategory(value);
    }
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value
    }));
    setIsEdited(true);
  };

  const handleRightClick = (event, subCategory) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      subCategories: subCategory,
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#f8f8f8]">
              <tr className="text-sm font-semibold">
                <th className="p-3 w-24">S.No</th>
                <th className="p-3 w-72">Categories</th>
                <th className="p-3 w-72">Sub Categories</th>
                <th className="p-3 w-64">HSN/SAC Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(paginatedCategories) && paginatedCategories.length > 0 ? (
                paginatedCategories.map((item, index) => (
                  <tr
                    key={item.id}
                    onContextMenu={(e) => handleRightClick(e, item)}
                    className="text-center bg-white border-b cursor-pointer"
                  >
                    <td className="p-2 text-sm w-[5%]">{index + 1}</td>
                    <td className="p-2 text-sm w-[20%]">{item.category_name || "N/A"}</td>
                    <td className="p-2 text-sm w-[20%]">{item.subcategory_name || "N/A"}</td>
                    <td className="p-2 text-sm w-[20%]">{item.hsn_sac_code || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-white shadow-md border rounded"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ul>
            <li
              onClick={() => handleEdit(contextMenu.subCategories)}
              className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Edit
            </li>
            <li
              onClick={() => handleDelete(contextMenu.subCategories)}
              className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Delete
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default SubCategoryTable;
