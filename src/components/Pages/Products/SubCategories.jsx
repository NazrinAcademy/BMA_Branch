import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  Sheet,
  FileText,
  Printer,
  X,
  TriangleAlert,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import successImage from '../../../assets/success.png'
import { useSelector } from "react-redux";

import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import { addSubCategory, fetchCategories } from "../../../apiService/AddProductAPI";
import SubCategoryModal from "./ProductDetails/SubCategoryModal";
import SubCategoryTable from "./ProductDetails/SubCategoryTable";

const SubCategories = () => {
  const allsubCategories = [
    { id: 1, categories: "Fashion", subCategories: "Women's Collection", hsnSacCode: 98765 },
    { id: 2, categories: "Electronics", subCategories: "Men's Collection", hsnSacCode: 45674 },
    { id: 3, categories: "Food", subCategories: "Kids Collection", hsnSacCode: 65468 },
    { id: 4, categories: "Vegetables", subCategories: "Spare Parts", hsnSacCode: 76543 },
    { id: 5, categories: "Accessories", subCategories: "Machines", hsnSacCode: 90874 },
    { id: 6, categories: "Home Appliances", subCategories: "Foot Wears", hsnSacCode: 12345, },
    { id: 7, categories: "Cloths", subCategories: "Leafs", hsnSacCode: 98464 },
    { id: 8, categories: "Toys", subCategories: "Remote controls", hsnSacCode: 78363 },
    { id: 9, categories: "Books", subCategories: "Story Books", hsnSacCode: 56838 },
    { id: 10, categories: "Jewelry", subCategories: "Gold", hsnSacCode: 47364 },
  ];

  // const categories = [
  //   { id: 1, categoryName: "Fashion" },
  //   { id: 2, categoryName: "Electronics" },
  //   { id: 3, categoryName: "Food" },
  //   { id: 4, categoryName: "Vegetables" },
  //   { id: 5, categoryName: "Accessories" },
  //   { id: 6, categoryName: "Home Appliances" },
  //   { id: 7, categoryName: "Cloths" },
  //   { id: 8, categoryName: "Toys" },
  //   { id: 9, categoryName: "Books" },
  //   { id: 10, categoryName: "Jewelry" },
  // ];


  const [subCategories, setsubCategories] = useState(allsubCategories);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [hsnSacCode, setHsnSacCode] = useState("");
  
  
  const { userDetails } = useSelector((state) => state.auth);
  
  const [isShowModal, setIsShowModal] = useState({
    add: false,
    edit: false
  });
    const [showModal, setShowModal] = useState(false);



  // Pagination
  // const [currentPage, setCurrentPage] = useState(1);
  // const perPage = 5;
  // const startIndex = (currentPage - 1) * perPage;
  // const paginatedCategories = subCategories.slice(startIndex, startIndex + perPage);

  // const handleOpenOverlay = () => setShowOverlaySubCategory(true);
  // const handleCloseOverlay = () => setShowOverlaySubCategory(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const startIndex = (currentPage - 1) * perPage;

  // ----------------------------------
  const [showOverlaySubCategory, setShowOverlaySubCategory] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // Overlay Open & Close Functions
  const handleOpenOverlay = () => {
    setIsShowModal({ add: true });
    setShowOverlaySubCategory(true);}
  const handleCloseOverlay = () => {
    console.log("Modal Closed");
    setIsShowModal({ add: false, edit: false });
};

  // Input Change Function
  // const handleInputChange = (e, field) => {
  //   const value = e.target.value;
  //   if (field === "hsnSacCode") {
  //     setHsnSacCode(value);
  //   } else if (field === "newSubCategory") {
  //     setNewSubCategory(value);
  //   }
  // };
  const getCategoriesData = async () => {
    console.log("Fetching category data...");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails.access_token}`,
      },
    };

    try {
      const fetchedCategories = await fetchCategories(config);
      console.log("Fetched categories:", fetchedCategories);

      setCategories(fetchedCategories?.all_stock || []); // ✅ Set categories
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {

    if (!userDetails?.access_token) return;
    console.log("Access token found, fetching categories...");

 

    getCategoriesData();
  }, [userDetails?.access_token]); // ✅ Trigger fetch when token updates

  // Handle Save Category
  const handleSaveSubCategory = async (e) => {
    e.preventDefault()
    if (!selectedCategory || !newSubCategory ) {
      alert("Please select a category, enter a subcategory name, and provide a stock category ID.");
      return;
    }
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`,
      },
    };
    const selectedCategoryObject = categories.find(cat => cat.id === selectedCategory);
  
    const newEntry = {
      subCategoryname: newSubCategory,
      Categoryname: selectedCategoryObject?.name, 
      StockCategory_id:selectedCategory,
      hsn_sac_code: hsnSacCode || Math.floor(10000 + Math.random() * 90000),
    };
  
    try {
      console.log("Saving subcategory...", newEntry); 
      const savedSubCategory = await addSubCategory(newEntry, config);
  
      // Update state only after a successful API response
      // setsubCategories([...subCategories, savedSubCategory]);
      getCategoriesData()
      setShowOverlaySubCategory(false);
      setNewSubCategory("");
      setSelectedCategory(""); // Clear stock category ID field
      setHsnSacCode("");
  
    } catch (error) {
      console.error("Error saving subcategory:", error);
      alert("Failed to save subcategory. Please try again.");
    }
  };
  // handle export excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(subCategories);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Categories');
    XLSX.writeFile(wb, 'categories.xlsx');
  };

  // handle export pdf
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("subcategories List", 20, 10);
    let y = 20;
    subCategories.forEach((category, index) => {
      doc.text(
        `${index + 1}. ${category.categories} - ${category.subCategories} - HSN/SAC: ${category.hsnSacCode}`,
        20,
        y
      );
      y += 10;
    });
    doc.save("subcategories.pdf");
  };

  // handle print:
  const handlePrint = () => {
    window.print();
  };

  // Filter categories based on search input:
  const filteredCategories = subCategories.filter((category) =>
    Object.values(category).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredCategories.length / perPage);
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + perPage);


  //------------------------ edit delete functions-----------
  const [contextMenu, setContextMenu] = useState(null);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessMessageUpdate, setShowSuccessMessageUpdate] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const categoryInputRef = useRef(null)
  const [isEdited, setIsEdited] = useState(false);
  const [categories, setCategories] = useState([]);



  const handleRightClick = (event, product) => {
    event.preventDefault(); // Prevent default right-click menu
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      product, // Store selected row data
    });
  };


  // const handleClickOutside = (event) => {
  //   if (menuRef.current && !menuRef.current.contains(event.target)) {
  //     setMenuOpen(null);
  //   }
  // };

  // Handle edit click
  const handleEdit = (subCategory) => {
    console.log("Edit button clicked", subCategory);
    setIsShowModal({ add: false, edit: true });
    setSelectedCategory(subCategory.categories);
    setNewSubCategory(subCategory.subCategories);
    setHsnSacCode(subCategory.hsnSacCode);
};

  

  //   // Small delay to ensure input is rendered before focusing
  //   setTimeout(() => {
  //     if (categoryInputRef.current) {
  //       categoryInputRef.current.focus();
  //     }
  //   }, 0);
  // };

  // Handle delete click
  const handleDelete = (subCategories) => {
    setSelectedRowId(subCategories.id);
    setShowDeleteConfirm(true);
    setContextMenu(null);
  };

  // Confirm delete
  const confirmDelete = () => {
    setPaginatedProducts((prevData) =>
      prevData.filter((item) => item.id !== selectedRowId)
    );
    setShowDeleteConfirm(false);
  };


  // Handle input change
  // const handleInputChange = (e, field) => {

  //   // Remove currency symbols or units when updating
  //   const value = e.target.value;
  //   if (field === "hsnSacCode") {
  //     setHsnSacCode(value);
  //   } else if (field === "newSubCategory") {
  //     setNewSubCategory(value);
  //   }
  //   setEditedData((prevData) => ({
  //     ...prevData,
  //     [field]: value
  //   }));
  //   setIsEdited(true);
  // };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isEdited) { // Only proceed if value is changed
        // Update the main subcategories list
        // setsubCategories((prevData) =>
        //   prevData.map((item) =>
        //     item.id === editRowId ? { ...item, ...editedData } : item
        //   )
        // );
      

      // Reset edit mode
      setEditRowId(null);
      setEditedData({});
      setShowSuccessMessageUpdate(true);
      // Show success message only after saving
      setTimeout(() => {
          setShowSuccessMessageUpdate(false);
      }, 2000);
  
    }
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
    <div className="bg-white h-full px-7 py-3 rounded shadow-md w-full max-w-6xl font-['Plus Jakarta Sans'] mx-auto">
      <div>
        <div className="flex justify-between items-center border-b text-nowrap py-4">
          <h2 className="text-xl font-semibold font-['Plus Jakarta Sans']">Sub Categories
            
          </h2>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-3/5">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#838383]" size={24} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 pl-10 w-full rounded focus:ring-1 focus:ring-[#838383] focus:outline-none"
              />
            </div>
            <button
              onClick={handleOpenOverlay}
              className="bg-purpleCustom text-white px-4 py-2 text-base font-semibold rounded flex items-center gap-2">
              Add Sub Category
            </button>
          </div>
        </div>

        {/* Overlay Form */}

        {/* Overlay Form */}
        {/* {showOverlaySubCategory && (
          <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-[692px] h-72 px-7 py-6">
              <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
                Add New Sub Category
              </h3>

              <div className="grid grid-cols-2 gap-4">
  <div className="relative col-span-2">
    <label className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 z-10 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
      Category
    </label>
    <div className="peer w-full h-11 pl-4 rounded border border-gray-300 flex items-center overflow-hidden text-sm">
      <select
        className="peer w-full h-11 px-2 text-sm focus:outline-none appearance-none pr-8"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <ChevronDown size={20} className="absolute right-3 text-gray-500 pointer-events-none" />
    </div>
  </div>

  <div className="relative">
    <input
      type="text"
      placeholder=""
      value={newSubCategory}
      onChange={(e) => setNewSubCategory(e.target.value)}
      className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
    />
    <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
      peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
      peer-focus:bg-white">
      Sub Category *
    </label>
  </div>

  <div className="relative">
    <input
      type="text"
      placeholder=""
      value={hsnSacCode}
      onChange={(e) => setHsnSacCode(e.target.value)}
      className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
    />
    <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
      peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
      peer-focus:bg-white">
      HSN/SAC Code
    </label>
  </div>
</div>

<div className="flex justify-end gap-4 mt-6">
  <button
    onClick={handleCloseOverlay}
    className="border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
  >
    Cancel
  </button>
  <button
    onClick={handleSaveSubCategory}
    className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
  >
    Save
  </button>
</div>  </div>
          </div>
        )} */}


        {/* Pagination Controls */}
        <div className="my-4 flex flex-col sm:flex-row justify-between text-[#838383] items-center">
          <div className="flex items-center gap-2">
            {/* Page Navigation */}
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-1 rounded-lg ${currentPage === 1 ? "text-[#838383]" : "text-purple-700"}`}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[#838383]">
                {currentPage}-{totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-1 rounded-lg ${currentPage >= totalPages ? "text-[#838383]" : "text-purple-700"}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Per Page Dropdown */}
            <div className="flex items-center text-[#838383] gap-3">
              <span>Per Page</span>
              <select
                className="border rounded p-1"
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button onClick={handleExportExcel} className="flex items-center gap-2 text-[#838383]">
              Export Excel
              <Sheet size={18} />
            </button>
            <button onClick={handleExportPDF} className="flex items-center gap-2 text-[#838383]">
              Export PDF
              <FileText size={18} />
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 text-[#838383]">
              Print
              <Printer size={18} />
            </button>
          </div>
        </div>{console.log("isShowModal",isShowModal)}

        {isShowModal?.add && (
  <SubCategoryModal
    categories={categories} 
    handleSaveSubCategory={handleSaveSubCategory}
    content={"Add New Sub Category"}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    newSubCategory={newSubCategory}
    setNewSubCategory={setNewSubCategory}
    hsnSacCode={hsnSacCode}
    setHsnSacCode={setHsnSacCode}
    handleCloseOverlay={handleCloseOverlay}
  />
)}

{isShowModal?.edit && (
  <SubCategoryModal
    categories={categories} 
    // handleSaveSubCategory={handleUpdateSubCategory}
    content={"Update Sub Category"}
    selectedCategory={selectedCategory}
    setSelectedCategory={setSelectedCategory}
    newSubCategory={newSubCategory}
    setNewSubCategory={setNewSubCategory}
    hsnSacCode={hsnSacCode}
    setHsnSacCode={setHsnSacCode}
    handleCloseOverlay={handleCloseOverlay}
  />
)}

        {/* Table */}
        {/* <div className="overflow-x-auto">
           <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
              <table className="w-full ">
                <thead className="sticky top-0 bg-[#f8f8f8]">
                <tr className="text-sm font-semibold">
                  <th className="p-3 w-24">S.No</th>
                  <th className="p-3 w-72">Categories</th>
                  <th className="p-3 w-72">Sub Categories</th>
                  <th className="p-3 w-64">HSN/SAC Code</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 ">
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((item) => (
                    <tr key={item.id}

                      onContextMenu={(event) => handleRightClick(event, item)} className="cursor-pointer text-sm text-center" >
                      <td className="p-2">{item.id}</td>

                      <td className="py-4">
                      {editRowId === item.id ? (
                          <input
                            type="text"
                            ref={categoryInputRef}
                            value={editedData.categories || item.categories}
                            onChange={(e) => handleInputChange(e, "categories")}
                            onKeyDown={handleKeyDown}
                            className="text-center w-full bg-transparent px-2 py-1 focus:outline-none"/>
                          ) : (
                          item.categories
                        )}
                      </td>

                      <td className="py-4">
                      {editRowId === item.id ? (
                          <input
                            type="text"
                            value={editedData.subCategories || item.subCategories}
                            onChange={(e) => handleInputChange(e, "subCategories")}
                            onKeyDown={handleKeyDown}
                            className="text-center w-full bg-transparent px-2 py-1 focus:outline-none"/>
                          ) : (
                          item.subCategories
                        )}
                      </td>

                      <td className="py-4">
                      {editRowId === item.id ? (
                          <input
                            type="text"
                            value={editedData.hsnSacCode || item.hsnSacCode}
                            onChange={(e) => handleInputChange(e, "hsnSacCode")}
                            onKeyDown={handleKeyDown}
                            className="text-center w-full px-2 bg-transparent py-1 focus:outline-none"/>
                          ) : (
                          item.hsnSacCode
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center">
                      No results found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
          </div> */}

        </div>

        <SubCategoryTable
           paginatedCategories={paginatedCategories}
           contextMenu={contextMenu}
           handleEdit={handleEdit} 
            handleDelete={handleDelete}
           setContextMenu = {setContextMenu}
           setEditRowId = {setEditRowId}
           setEditedData ={setEditedData}
           setIsEdited = {setIsEdited}
           setHsnSacCode ={setHsnSacCode}
           setNewSubCategory = {setNewSubCategory}
        />

        {/* ------------------------------------------ Context Menu -----------------------------------------------*/}
        {contextMenu && (
          <div
            className="absolute z-100 bg-white shadow-md border rounded"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <ul>

              <li
                onClick={() => contextMenu?.product && handleEdit(contextMenu.product)}
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

         {/* --------------------------- update successfull message --------------------------------- */}
        
                      {showSuccessMessageUpdate && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white w-96 max-w-3xl h-64 rounded-lg shadow-lg p-6 space-y-4 relative">
                            <div className="flex flex-col items-center justify-center">
                              <img src={successImage} alt="Success Logo" className="w-20 h-20" />
                                </div>
                                <div className="flex flex-col items-center text-center">
                                  <span className="text-black text-3xl font-bold font-[Plus Jakarta Sans]">
                                    Success!
                                  </span>
                                </div>
                                <div className="flex flex-col items-center text-center px-6">
                                  <p className="text-gray-500 text-base font-medium leading-6 font-[Plus Jakarta Sans]">
                                  Your product details have been updated successfully!
                                  </p>
                                </div>
                              </div>
                              </div>
                        )}
                      
                     

       {/* ----------------------------------------- Delete Confirmation --------------------------------------*/}
       {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-96 max-w-3xl h-64 rounded-lg shadow-lg p-6 space-y-4 relative">
                    
                    {/* TriangleAlert Icon */}
                    <div className="flex flex-col  text-[#E58448] items-center text-center">

                      <TriangleAlert size={54} />
                    </div>
              
                    {/* Title */}
                    <div className="flex flex-col  items-center text-center">
                    <span className="text-black text-base font-semibold font-[Plus Jakarta Sans]">
                        Are you sure you want to delete this product?
                      </span>
                    </div>
              
                    {/* Description */}
                    <div className="flex flex-col  items-center text-center">
                    <p className="text-gray-500 px-8 text-sm font-medium leading-6 font-[Plus Jakarta Sans]">
                        Deleting your order will remove all of your information from our database.
                      </p>
                    </div>
              
                    {/* Buttons */}
                    <div className="flex flex-cols-2 items-center justify-center text-center">
                    <button 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="text-[#17BE78] flex items-center text-sm font-semibold px-4 py-2 rounded"
                      >
                        <X size={20} /> Close
                      </button>
                      <button 
                        onClick={confirmDelete}
                        className="bg-[#E5484D] text-white text-sm font-semibold py-2 px-4 rounded"
                      >
                        Yes, Delete It
                      </button>
                    </div>
              
                  </div>
                </div>
              )}


      </div>
      );
};

      export default SubCategories;   