import { useState, useEffect } from "react";
import { Search, Sheet, FileText, Printer, ChevronLeft, ChevronRight, TriangleAlert, X } from "lucide-react";
import { fetchCategories, addCategory, deleteCategory, updateCategory } from "../../api/categoryAPI"; // Import API functions
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import successImage from '../../assets/success.png'
import { useSelector } from "react-redux";
import CategoryModal from "./categoryModal";
import SuccessMessage from "../../components/common/SuccessMessage";
import { fetchSubCategories } from "../../api/subcategoryAPI";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isShowModal,setIsShowModal]=useState({edit:false})
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    igst: "",
    cgst: "",
    sgst: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {userDetails}=useSelector((state)=>(state.auth))
  const [successMsg,setSuccessMsg]=useState({add:false,edit:false})

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  // Function to handle IGST change and auto-fill CGST and SGST
  const handleIGSTChange = (e) => {
    const igstValue = parseFloat(e.target.value) || 0;  // Ensure it's a number
    setNewCategory({
        ...newCategory,
        igst: igstValue,
        cgst: (igstValue / 2).toFixed(2), 
        sgst: (igstValue / 2).toFixed(2),
    });
};

 
const fetchAllCategories = async () => {
  const config = {
      headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails?.access_token}`,
      },
  };
  try {
      const data = await fetchCategories(config);
      if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
      } else {
          setCategories([]);
      }
  } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
  }
};

// Call it inside useEffect
useEffect(() => {
  fetchAllCategories();
}, []);


 

  // Handle Save Category
  const handleSaveCategory = async () => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userDetails?.access_token}`,
        },
    };

    try {
        const category = {
            category_name: newCategory.category_name,
            igst: newCategory.igst || 0,  // Ensure default value
            cgst: newCategory.cgst || 0,
            sgst: newCategory.sgst || 0,
        };

        const savedCategory = await addCategory(category, config);

        if (savedCategory) {
            console.log("Saved Category:", savedCategory);

            setSuccessMsg((prevState) => ({ ...prevState, add: true }));
            setShowOverlay(false);
            handleModalClose();
            setNewCategory({ category_name: "", igst: "", cgst: "", sgst: "" });

            // ✅ Fetch the latest category list after adding
            fetchAllCategories();
        } else {
            console.error("Category not saved properly. Check API response.");
        }
    } catch (error) {
        console.error("Error saving category:", error);
    }
};

  
  useEffect(() => {
		setTimeout(() => {
			setSuccessMsg((prevState) => ({ ...prevState, add:false,edit:false }))
		}, 2000);
	}, [ successMsg?.add,successMsg?.edit]);

  const handleModalClose=()=>{
    setShowOverlay(false)
    setNewCategory({ category_name: "", igst: "", cgst: "", sgst: "" }); 
    setIsShowModal((prevState)=>({...prevState,edit:false}))
    // setSuccessMsg((prevState) => ({ ...prevState, add: false,edit:false }))
  }

  // Handle Export to Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(categories);
    const wb = XLSX.utils.book_new(); // Initialize workbook before appending
    XLSX.utils.book_append_sheet(wb, ws, "Categories");
    XLSX.writeFile(wb, "categories.xlsx");
  };
  

  // Handle Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Category List", 20, 10);
    let y = 20;
  
    categories.forEach((category, index) => {
      doc.text(`${index + 1}. ${category.category_name} - IGST: ${category.igst}%`, 20, y);
      y += 10;
    });
  
    doc.save("categories.pdf");
  };
  

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Filter categories based on search input:
  const filteredCategories = Array.isArray(categories)
  ? categories.filter((category) =>
      Object.values(category || {}).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  : [];


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
        Authorization: `Bearer ${userDetails.access_token}`,
      },
    };
    try {
      await deleteCategory(selectedCategory.id, config);
      setCategories(categories.filter((cat) => cat.id !== selectedCategory.id));
      setShowDeleteConfirm(false);
      getCategoriesData(); // Correct function to refresh the list
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  
  // -----------------------edit functions---------------------
  const [editingCategory, setEditingCategory] = useState(null);
const [updatedCategory, setUpdatedCategory] = useState(null);

const handleUpdate = async () => {
  try {
      const response = await updateCategory(editingCategory, newCategory);
      if (response) {
          setSuccessMsg((prevState) => ({ ...prevState, edit: true }));
          fetchAllCategories();  // ✅ Fetch updated categories
          console.log("Category updated successfully!");
          handleModalClose();
      }
  } catch (error) {
      console.error("Error updating category:", error);
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
    setNewCategory({ category_name: category?.category_name, igst: category?.igst, cgst: category?.cgst, sgst: category?.sgst

    })
    setIsShowModal((prevState)=>({...prevState,edit:true}))
    setUpdatedCategory({ ...category }); // Clone category data for editing
    setContextMenu(null); // Close context menu
  };
  
   // ---------------------------------  Handle Click Outside --------------------------
   useEffect(() => {
    console.log("categories");
    
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
<div className="bg-white h-full px-7 py-3 rounded shadow-md w-full max-w-full xl:max-w-7xl 2xl:max-w-screen-2xl font-['Plus Jakarta Sans'] mx-auto">
        <div className="flex justify-between items-center border-b text-nowrap py-4">
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
      {showOverlay && (
       <CategoryModal
       newCategory={newCategory}
       setNewCategory={setNewCategory}
       handleIGSTChange={handleIGSTChange}
       handleModalClose={handleModalClose}
       setIsShowModal={setIsShowModal}
       handleSubmit={handleSaveCategory}
       />
      )}
      {isShowModal?.edit && (
       <CategoryModal
       newCategory={newCategory}
       setNewCategory={setNewCategory}
       handleSubmit={handleUpdate}
       handleIGSTChange={handleIGSTChange}
       handleModalClose={handleModalClose}
       setIsShowModal={setIsShowModal}
       />
      )}
{successMsg?.add &&
<SuccessMessage  showMsg={successMsg?.add} onClose={handleModalClose} content={"Category Add SuccessFully"}/>}

{successMsg?.edit &&
<SuccessMessage showMsg={successMsg?.edit} onClose={handleModalClose} content={"Category Edit SuccessFully"}/>}
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
  {Array.isArray(categories) && categories.length > 0 ? (
  categories.map((category, index) => (
    <tr key={category.id} onContextMenu={(e) => handleContextMenu(e, category)}
    className="border-b text-center text-sm font-normal"
>
      <td className="px-6 py-4">{startIndex + index + 1}</td>
      <td className="px-6 py-4">{category.category_name || "N/A"}</td>
      <td className="px-6 py-4">{category.igst ? `${category.igst}%` : "N/A"}</td>
      <td className="px-6 py-4">{category.cgst ? `${category.cgst}%` : "N/A"}</td>
      <td className="px-6 py-4">{category.sgst ? `${category.sgst}%` : "N/A"}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="5" className="text-center">No results found</td>
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
