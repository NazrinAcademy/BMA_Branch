import { ChevronDown } from 'lucide-react'
import React from 'react'

const SubCategoryModal = ({
    handleSaveSubCategory,
    content,
    selectedCategory,
    setSelectedCategory,
    newSubCategory,
    setNewSubCategory,
    handleModalClose,
    categories 
}) => {
    const handleInputChange = (e) => {
        console.log("Typing input value:", e.target.value);
        setNewSubCategory(prev => ({
            ...prev, subcategory_name: e.target.value
        }));
    };
    
    
    return (
        <>
            <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg w-[692px] h-72 px-7 py-6">
                    <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
                        {content}
                    </h3>

                    {/* Form for Subcategory */}
                    <form className="grid grid-cols-2 gap-4"
                        onSubmit={(e) => {
                            e.preventDefault(); // ✅ Prevent form submission
                            handleSaveSubCategory();
                        }}>

                        {/* Category Dropdown */}
                        <div className="relative col-span-2">
                            <label className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 z-10 transition-all 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
                                Category
                            </label>
                            <div className="peer w-full h-11 pl-4 rounded border border-gray-300 flex items-center overflow-hidden text-sm">
                                <select
                                    className="peer w-full h-11 px-2 text-sm focus:outline-none appearance-none pr-8"
                                    value={selectedCategory?.id || ""}
                                    onChange={(e) => {
                                        const selectedCat = categories.find(cat => cat.id === e.target.value);
                                        setSelectedCategory(selectedCat);
                                        setNewSubCategory(prev => ({
                                            ...prev,
                                            category_id: selectedCat?.id || "",
                                            category_name: selectedCat?.category_name || ""
                                        }));
                                    }}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={20} className="absolute right-3 text-gray-500 pointer-events-none" />
                            </div>
                        </div>

                        {/* Sub Category Input */}
                        <div className="relative">
                        <input
    type="text"
    placeholder=""
    name="subcategory_name"
    value={newSubCategory?.subcategory_name || ""}
    onChange={(e) => setNewSubCategory(prev => ({
        ...prev, subcategory_name: e.target.value
    }))}
    className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
    required
/>


                            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
              peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
              peer-focus:bg-white">
                                Sub Category *
                            </label>
                        </div>

                        {/* HSN/SAC Code Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder=""
                                name='hsn_sac_code'
                                value={newSubCategory.hsn_sac_code || ""}
                                onChange={(e) => {
                                    setNewSubCategory(prev => ({
                                        ...prev,
                                        hsn_sac_code: e.target.value
                                    }));
                                }}
                                className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                            />
                            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
              peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
              peer-focus:bg-white">
                                HSN/SAC Code
                            </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={handleModalClose}
                                className="border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SubCategoryModal;
