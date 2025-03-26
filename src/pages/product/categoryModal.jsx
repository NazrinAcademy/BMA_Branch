const CategoryModal = ({
  newCategory,
  setNewCategory,
  handleModalClose,
  setIsShowModal,
  handleSubmit,
  content,
}) => {
  // Function to handle IGST change and auto-fill CGST & SGST
  const handleIGSTChange = (e) => {
    let igstValue = parseFloat(e.target.value) || 0;
    let halfValue = (igstValue / 2).toFixed(2); // Divide IGST into 2 parts (SGST & CGST)

    setNewCategory((prev) => ({
      ...prev,
      igst: igstValue,
      sgst: halfValue,
      cgst: halfValue,
    }));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
        <div className="bg-white overflow-hidden rounded-lg w-[692px] h-72 px-7 py-6">
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">{content}</h3>
          <div className="grid grid-cols-2 gap-4">
            {["category_name", "igst", "cgst", "sgst"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field === "category_name" ? "text" : "number"}
                  name={field}
                  value={newCategory[field]}
                  onChange={(e) => {
                    if (field === "igst") {
                      handleIGSTChange(e); // Auto-fill CGST/SGST if IGST changes
                    } else {
                      setNewCategory((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }));
                    }
                  }}
                  placeholder=""
                  className="peer w-full h-11 pl-4 pr-8 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  {field.toUpperCase()} {field === "categoryName" ? "*" : ""}
                </label>
                {field !== "category_name" && (
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleModalClose}
              className="border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryModal;
