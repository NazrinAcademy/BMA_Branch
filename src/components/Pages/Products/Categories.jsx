import { useState, useEffect } from "react";
import { Search, Sheet, FileText, Printer, ChevronLeft, ChevronRight, TriangleAlert, X } from "lucide-react";
import { fetchCategories, addCategory, deleteCategory, updateCategory } from "../../../apiService/AddProductAPI"; // Import API functions
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import successImage from '../../../assets/success.png'
import { useSelector } from "react-redux";


const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    igst: "",
    cgst: "",
    sgst: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {userDetails}=useSelector((state)=>(state.auth))



  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);


  // Function to handle IGST change and auto-fill CGST and SGST
  const handleIGSTChange = (e) => {
    const igstValue = e.target.value;
    setNewCategory({
      ...newCategory,
      igst: igstValue,
      cgst: (parseFloat(igstValue) / 2).toFixed(2), 
      sgst: (parseFloat(igstValue) / 2).toFixed(2),
    });
  };

  // Fetch categories when the component loads
  useEffect(() => {
    if (!userDetails?.token) return; // Prevents fetching if token is not available
  
    const getCategoriesData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails.token}`,
        },
      };
  
      try {
        const fetchedCategories = await fetchCategories(config);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    getCategoriesData();
  }, [userDetails?.token]); // Added dependency for token updates
  


  // Handle Save Category
  const handleSaveCategory = async () => {
    const config = {
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails?.token}`
      }
  };
    try {
      const category = {
        categoryName: newCategory.categoryName,
        igst: newCategory.igst,
        cgst: newCategory.cgst,
        sgst: newCategory.sgst,
      };
      const savedCategory = await addCategory(category, config); 

      setCategories((prevCategories) => [...prevCategories, savedCategory]);

      setShowOverlay(false); 
      setNewCategory({ categoryName: "", igst: "", cgst: "", sgst: "" }); 
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };


  // Handle Export to Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(categories);
XLSX.utils.book_append_sheet(wb, ws, "Categories");
XLSX.writeFile(wb, "categories.xlsx");
    const wb = XLSX.utils.book_new();
  };

  // Handle Export to PDF
  const handleExportPDF = () => {
    categories.forEach((category, index) => {
      doc.text(`${index + 1}. ${category.categoryName} - IGST: ${category.igst}%`, 20, y);
      y += 10;
    });
    

    const doc = new jsPDF();
    doc.text("Brand List", 20, 10);
    let y = 20;
    brands.forEach((brand, index) => {
      doc.text(`${index + 1}. ${brand.name}`, 20, y);
      y += 10;
    });
    doc.save("brands.pdf");
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };


  // Filter categories based on search input:
  const filteredCategories = categories.filter((category) =>
    Object.values(category).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredCategories.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + perPage);


  //  ------------------------------- edit , delete functions ---------------------------
  // const [categories, setCategories] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSuccessMessageUpdate, setShowSuccessMessageUpdate] = useState(false);


    // Open Context Menu on Right Click
    const handleContextMenu = (event, category) => {
      event.preventDefault();
      setContextMenu({
        x: event.pageX,
        y: event.pageY,
        product: category,
      });
    };


  // Handle Delete Click
  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteConfirm(true);
    setContextMenu(null);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    const config = {
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails.token}`,
      },
    };
    try {
      await deleteCategory(selectedCategory.id, config); // Using API function
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      setShowDeleteConfirm(false);
      // alert("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category!");
    }
  };
  // -----------------------edit functions---------------------
  const [editingCategory, setEditingCategory] = useState(null);
const [updatedCategory, setUpdatedCategory] = useState(null);

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      try {
        await updateCategory(editingCategory, updatedCategory); // Call API
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.id === editingCategory ? updatedCategory : cat
          )
        );
        setEditingCategory(null); // Exit edit mode
        setShowSuccessMessageUpdate(true); // Show success message
  
        setTimeout(() => setShowSuccessMessageUpdate(false), 3000); // Hide message after 3s
      } catch (error) {
        console.error("Error updating category:", error);
        alert("Failed to update category!");
      }
    }
  };

  const handleInputChange = (e, field) => {
    setUpdatedCategory({
      ...updatedCategory,
      [field]: e.target.value,
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category.id);
    setUpdatedCategory({ ...category }); // Clone category data for editing
    setContextMenu(null); // Close context menu
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
      <div className="flex justify-between items-center border-b py-4">
        <h2 className="text-xl font-semibold">Categories</h2>
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
            onClick={() => setShowOverlay(true)}
            className="bg-purpleCustom text-white  px-4 py-2 text-base font-semibold rounded flex items-center gap-2"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Overlay Form */}
      {/* Overlay Form */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
          <div className="bg-white overflow-hidden rounded-lg w-[692px] h-72 px-7 py-6">
            <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
              Add New Category
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {["categoryName", "igst", "cgst", "sgst"].map((field) => (
                <div key={field} className="relative">
                  <input
                    type={field === "categoryName" ? "text" : "number"}
                    name={field}
                    value={newCategory[field]}
                    onChange={(e) => {
                      if (field === "igst") {
                        handleIGSTChange(e); // Auto-fill CGST/SGST if IGST changes
                      } else {
                        setNewCategory({
                          ...newCategory,
                          [field]: e.target.value,
                        });
                      }
                    }}
                    placeholder=""
                    className="peer w-full h-11 pl-4 pr-8 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                  />
                  <label
                    className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
                  >
                    {field.toUpperCase()} {field === "categoryName" ? "*" : ""}
                  </label>
                  {field !== "categoryName" && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      %
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowOverlay(false)}
                className="border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="my-4 flex flex-col sm:flex-row justify-between text-[#838383] items-center">
        <div className="flex items-center gap-2">
          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-1 rounded-lg text-purple-700"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[#838383]">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-1 rounded-lg text-purple-700"
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
            Export Excel <Sheet size={18} />
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 text-[#838383]">
            Export PDF <FileText size={18} />
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 text-[#838383]">
            Print <Printer size={18} />
          </button>
        </div>
      </div>


      {/* Table */}
      <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
      <table className="w-full ">
        <thead className="sticky top-0 bg-[#f8f8f8]">
        <tr className="text-sm font-semibold">
              <th className="p-3 w-24">S.No</th>
              <th className="p-3 w-72">Categories</th>
              <th className="p-3 w-64">IGST %</th>
              <th className="p-3 w-64">CGST %</th>
              <th className="p-3 w-64">SGST %</th>
            </tr>
          </thead>
          <tbody>
  {paginatedCategories.length > 0 ? (
    paginatedCategories.map((category, index) => (
      <tr
        key={category.id}
        className="border-b text-sm text-center font-normal"
        onContextMenu={(e) => handleContextMenu(e, category)}
      >
        <td className="px-6 py-4">{startIndex + index + 1}</td>

        {/* Categories Column */}
        <td className="px-6 py-4">
          {editingCategory === category.id ? (
            <input
              type="text"
              value={updatedCategory.categoryName}
              onChange={(e) => handleInputChange(e, "categoryName")}
              onKeyDown={handleKeyPress}
              autoFocus
              className="text-center w-full px-2 py-1 focus:outline-none"/>
          ) : (
            category.categoryName
          )}
        </td>
        
        {/* IGST Column */}
        <td className="px-6 py-4">
          {editingCategory === category.id ? (
            <input
              type="number"
              value={updatedCategory.igst}
              onChange={(e) => handleInputChange(e, "igst")}
              onKeyDown={handleKeyPress}
              className="text-center w-full px-2 py-1 focus:outline-none"/>
            ) : (
            `${category.igst}%`
          )}
        </td>
        
        {/* CGST Column */}
        <td className="px-6 py-4">
          {editingCategory === category.id ? (
            <input
              type="number"
              value={updatedCategory.cgst}
              onChange={(e) => handleInputChange(e, "cgst")}
              onKeyDown={handleKeyPress}
              className="text-center w-full px-2 py-1 focus:outline-none"/>
            ) : (
            `${category.cgst}%`
          )}
        </td>

        {/* SGST Column */}
        <td className="px-6 py-4">
          {editingCategory === category.id ? (
            <input
              type="number"
              value={updatedCategory.sgst}
              onChange={(e) => handleInputChange(e, "sgst")}
              onKeyDown={handleKeyPress}
              className="text-center w-full px-2 py-1 focus:outline-none"/>
            ) : (
            `${category.sgst}%`
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="px-6 py-4 text-center">
        No results found
      </td>
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

export default Categories;
