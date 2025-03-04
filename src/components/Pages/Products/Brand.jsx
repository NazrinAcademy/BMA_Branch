import { useState, useEffect } from "react";
import { Plus, Search, Sheet, FileText, Printer, ChevronLeft, ChevronRight , TriangleAlert, X} from "lucide-react";
import { addBrand, deleteBrand, getBrands, updateBrand } from "../../../apiService/AddProductAPI"; // Import your API functions
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import successImage from '../../../assets/success.png'
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";


const Brand = () => {
    const [brands, setBrands] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [showOverlay, setShowOverlay] = useState(false);
    const [newBrandName, setNewBrandName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const {userDetails}=useSelector((state)=>(state.auth))

    const startIndex = (currentPage - 1) * perPage;

    useEffect(() => {
      const fetchBrands = async () => {
        const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userDetails.access_token}`,
            },
          };
          try {
              const fetchedBrands = await getBrands(config);
              console.log("Fetched Brands:", fetchedBrands);
              setBrands(fetchedBrands.data || []);
          } catch (error) {
              console.error("Error fetching brands:", error);
          }
      };
  
      fetchBrands();
  }, []); // Empty dependency array ensures it runs only once
  
    // Handle Overlay
    const handleOpenOverlay = () => setShowOverlay(true);
    const handleCloseOverlay = () => setShowOverlay(false);

    // Handle Save Brand
    const handleSaveBrand = async () => {
        const userData = JSON.parse(localStorage.getItem("user"));
    
        const token = userData?.access_token;
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userDetails?.access_token}`
            }
        };
    
        const payload = {
            brand_name: newBrandName,
        };
    
        if (newBrandName.trim() !== "") {
            try {
                const newBrand = await addBrand(payload, config);
                if (newBrand?.data) {
                    setBrands([...brands, newBrand.data]);
                }
                setNewBrandName("");
                handleCloseOverlay();
            } catch (error) {
                toast.error(`Error saving brand: ${error.message}`);
            }
        }
    };
    
    // Handle Export to Excel
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(brands);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Brands");
        XLSX.writeFile(wb, "brands.xlsx");
    };

    // Handle Export to PDF
    const handleExportPDF = () => {
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

    // Filter brands based on search term
    const filteredBrands = searchTerm
    ? brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : brands;


    const totalPages = Math.ceil(filteredBrands.length / perPage);
    const paginatedBrands = filteredBrands.slice(startIndex, startIndex + perPage);


    // ------------------------ delete functions --------------------
    const [contextMenu, setContextMenu] = useState(null);
    const [showSuccessMessageUpdate, setShowSuccessMessageUpdate] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);



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
       const handleDelete = (brand) => {
        setSelectedBrand(brand);
        setShowDeleteConfirm(true);
        setContextMenu(null);
    };
    
   const confirmDelete = async () => {
      if (!selectedBrand) return;
      const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userDetails.access_token}`,
        },
    };
      try {
        await deleteBrand(selectedBrand.id, config); // API call
        setBrands(brands.filter((brand) => brand.id !== selectedBrand.id));
                setShowDeleteConfirm(false);
        // alert("Category deleted successfully!");
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category!");
      }
    };

    // -----------------------edit functions---------------------
    const [editingBrand, setEditingBrand] = useState(null);
    const [updatedBrand, setUpdatedBrand] = useState(null);
    
   const handleKeyPress = async (e) => {
    if (e.key === "Enter" && updatedBrand) {
        try {
            // API call to update brand
            await updateBrand(editingBrand, updatedBrand);

            console.log("Brand Updated in API. Fetching latest data...");

            // Fetch updated brands list
            const fetchedBrands = await getBrands();
            setBrands(fetchedBrands.data || []);

            setEditingBrand(null);
            setUpdatedBrand(null);

            setShowSuccessMessageUpdate(true);
            setTimeout(() => setShowSuccessMessageUpdate(false), 3000);
        } catch (error) {
            console.error("Error updating brand:", error);
            alert("Failed to update brand!");
        }
    }
};
 
    
    const handleEdit = (brand) => {
        setEditingBrand(brand.id);
        setUpdatedBrand({ ...brand }); // Ensure updatedBrand is set properly
        setContextMenu(null); 
    };
    
    const handleInputChange = (e, field) => {
        setUpdatedBrand((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };
    
    // useEffect(() => {
    //     console.log("Updated Brand State:", updatedBrand);
    // }, [updatedBrand]);
    
    

    return (
        <div className="bg-white h-full px-7 py-3 rounded shadow-md w-full max-w-6xl font-['Plus Jakarta Sans'] mx-auto">
            <div className="flex justify-between items-center border-b py-4">
                <h2 className="text-xl font-semibold">Brands</h2>
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
                        className="bg-purpleCustom text-white px-4 py-2 text-base font-semibold rounded flex items-center gap-2"
                    >
                        Add Brand
                    </button>
                </div>
            </div>

            {/* Overlay Form */}
            {showOverlay && (
                <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
                    <div className="bg-white overflow-hidden rounded-lg w-[692px] h-56 px-7 py-6">
                        <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
                            Add New Brand
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder=""
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                            />
                            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                                Brand Name *
                            </label>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={handleCloseOverlay} className="border border-purpleCustom font-semibold px-12 py-2 rounded">
                                Cancel
                            </button>
                            <button onClick={handleSaveBrand} className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded">
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
{/* Table */}
<div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
      <table className="w-full ">
        <thead className="sticky top-0 bg-[#f8f8f8]">
        <tr className="text-sm font-semibold">
                <th className="p-3 w-24">S.No</th>
                <th className="p-3 w-auto">Brand</th>
            </tr>
        </thead>
        <tbody>
            {paginatedBrands.length > 0 ? (
                paginatedBrands.map((brand, index) => (
                    <tr 
                        key={brand.id || index} 
                        className="border-b text-sm font-normal"
                        onContextMenu={(e) => handleContextMenu(e, brand)}
                    >
                        <td className="px-6 py-4">{startIndex + index + 1}</td>

                        {/* Brand Name Column */}
                        <td className="px-6 py-4">
                            {editingBrand === brand.id ? (
                                <input
                                    type="text"
                                    value={updatedBrand?.name || ""}
                                    onChange={(e) => handleInputChange(e, brand.id, "name")} 
                                    onKeyDown={handleKeyPress}
                                    autoFocus
                                    className="text-center w-full px-2 py-1 focus:outline-none"
                                />
                            ) : (
                                brand.name
                            )}
                        </td>
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
              <ToastContainer autoClose={3000} />
        </div>
    );
};

export default Brand;
