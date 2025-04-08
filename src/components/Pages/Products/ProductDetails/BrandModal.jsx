import React, { useState, useEffect } from "react";

const BrandModal = ({ isOpen, onClose, onSave, selectedBrand }) => {
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    if (selectedBrand) {
      setBrandName(selectedBrand.brand_name);
    } else {
      setBrandName("");
    }
  }, [selectedBrand]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
      <div className="bg-white overflow-hidden rounded-lg w-[692px] h-56 px-7 py-6">
        <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
          {selectedBrand ? "Edit Brand" : "Add New Brand"}
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder=""
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Brand Name *
          </label>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="border border-purpleCustom font-semibold px-12 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(brandName)}
            className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;
