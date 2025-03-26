import { useState, useEffect } from "react";
import { Plus, Search, Sheet, FileText, Printer, ChevronLeft, ChevronRight , TriangleAlert, X} from "lucide-react";
import { addBrand, deleteBrand, getBrands, updateBrand } from "../../api/brandAPI"; // Import your API functions
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import successImage from '../../assets/success.png'
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import SuccessMessage from "../../assets/success.png";
import BrandTable from "./BrandTable";
import BrandModal from "./BrandModal";


const Brand = () => {
 
    const [brands, setBrands] = useState([
        { id: 1, brand_name: "Nike" },
        { id: 2, brand_name: "Adidas" },
        { id: 3, brand_name: "Puma" },
        { id: 4, brand_name: "Reebok" }
    ]);
        const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [showOverlay, setShowOverlay] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const {userDetails}=useSelector((state)=>(state.auth))
    const [loading, setLoading] = useState({ isLoading: false, message: "" });

  
    const [successMsg, setSuccessMsg] = useState({ create: "", update: "" })
    const [triggerApi,setTriggerApi]=useState({getApi:false})
    const [isShowModal, setIsShowModal] = useState({ add: false, edit: false });
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [newBrandName, setNewBrandName] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    
    
    const startIndex = (currentPage - 1) * perPage;

    useEffect(() => {
          setTimeout(() => {
            setShowSuccessMessage(false);
            setSuccessMsg((prevState) => ({...prevState, create:false, update:false}))
          }, 2000);
        
      }, [showSuccessMessage, successMsg?.create, successMsg?.update]);


    useEffect(() => {
      const fetchBrands = async () => {
        setLoading({ isLoading: true, message: "Fetching brands..." });
        const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userDetails.access_token}`,
            },
          };
          try {
              const fetchedBrands = await getBrands(config);
              console.log("Fetched Brands:", fetchedBrands?.brand);
              setBrands(fetchedBrands.brand);
              setLoading({ isLoading: false, message: "" });
          } catch (error) {
              console.error("Error fetching brands:", error);
              setLoading({ isLoading: false, message: "Failed to fetch data" });
          }
      };
  
      fetchBrands();
  }, []); // Empty dependency array ensures it runs only once

  
    // Handle Overlay
    const handleOpenOverlay = () => {
        setIsShowModal({ add: true, edit: false });
        setNewBrandName("");
    };    // const handleCloseOverlay = () => setShowOverlay(false);

    // Handle Save Brand
    // console.log("newBrandName",newBrandName)
    const handleSaveBrand = async () => {
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
                const newBrand = await addBrand(newBrandName, config);
                
                if (!newBrand) {
                    throw new Error("Failed to save brand");
                }
    
                console.log("Brand saved successfully:", newBrand);
    
                if (newBrand?.data) {
                    setBrands([...brands, newBrand.data]);
                }
    
                setSuccessMsg((prev) => ({ ...prev, create: "Brand added successfully!" })); 
                setNewBrandName("");
    
                console.log("Closing modal...");
                handleModalClose();
            } catch (error) {
                toast.error(`Error saving brand: ${error.message}`);
            }
        }
    };
     
     
    const handleModalClose = () => {
        console.log("Modal Close Function Called!"); // Debugging
        setIsShowModal({ add: false, edit: false });
        setSelectedBrand(null);
        setNewBrandName("");
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
        console.log("handledeleted",brand?.brand_id)
        setSelectedBrand(brand?.brand_id);
        setShowDeleteConfirm(true);
        setContextMenu(null);
    };
    
    const confirmDelete = async () => {
        setLoading({ isLoading: true, message: "Deleting brand..." });
    
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userDetails.access_token}`,
            },
        };
    
        try {
            await deleteBrand(selectedBrand, config);
    
            // ✅ Update UI immediately by filtering out the deleted brand
            setBrands((prevBrands) => prevBrands.filter((brand) => brand.brand_id !== selectedBrand));
    
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error("Error deleting brand:", error);
            alert("Failed to delete brand!");
        } finally {
            setLoading({ isLoading: false, message: "" });
            setShowDeleteConfirm(false);
            setSelectedBrand(null); // ✅ Reset selected brand
        }
    };
    
    

    // -----------------------edit functions---------------------
    const [editingBrand, setEditingBrand] = useState(null);
    const [updatedBrand, setUpdatedBrand] = useState(null);
    
   
    
    const handleUpdateBrand = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        if (!updatedBrand?.brand_name?.trim()) {
            alert("Brand name is required!");
            return;
        }
    
        if (!selectedBrand?.brand_id) { // ✅ Use `brand_id` instead of `id`
            alert("Error: Missing brand ID");
            return;
        }
    
        console.log("Updating Brand ID:", selectedBrand?.brand_id);
        console.log("Updated Name:", updatedBrand?.brand_name);
    
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userDetails?.access_token}`
            }
        };
    
        const payload = { brand_name: updatedBrand?.brand_name };
    
        try {
            await updateBrand(selectedBrand?.brand_id, payload, config); // ✅ Pass correct ID
    
            // ✅ Refresh brands list after update
            const fetchedBrands = await getBrands(config);
            setBrands(fetchedBrands.brand);
    
            setSuccessMsg((prev) => ({ ...prev, update: "Brand updated successfully!" }));
            setIsShowModal({ edit: false, add: false }); // ✅ Close modal
            setUpdatedBrand(null); // ✅ Clear state
        } catch (error) {
            console.error("Error updating brand:", error);
            alert("Failed to update brand!");
        }
    };
    
    
     
    const handleEdit = (brand) => {
        console.log("Editing Brand:", brand); // Debugging
        setUpdatedBrand({ brand_name: brand.brand_name }); // ✅ Store brand name
        setSelectedBrand(brand); // ✅ Ensure selectedBrand has full data
        setIsShowModal({ add: false, edit: true });
    };
    
    
    const handleInputChange = (e) => {
        setUpdatedBrand((prev) => ({
            ...prev,
            brand_name: e.target.value,
        }));
    };
    
    
    // useEffect(() => {
    //     console.log("Updated Brand State:", updatedBrand);
    // }, [updatedBrand]);
    
    

    return (
<div className="bg-white h-full px-7 py-3 rounded shadow-md w-full  font-['Plus Jakarta Sans'] mx-auto">
        <div className="flex justify-between items-center border-b text-nowrap py-4">
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

            {isShowModal?.add && (
    <BrandModal
        handleSaveBrand={handleSaveBrand}
        content={"Add New Brand"}
        handleModalClose={handleModalClose}
        newBrandName={newBrandName}
        setNewBrandName={setNewBrandName}
    />
)}

{isShowModal?.edit && (
    <BrandModal
        handleSaveBrand={handleUpdateBrand}
        content={"Update Brand"}
        handleModalClose={handleModalClose}
        newBrandName={updatedBrand?.brand_name}  // ✅ Ensure correct data binding
        setNewBrandName={(value) => setUpdatedBrand((prev) => ({ ...prev, brand_name: value }))} // ✅ Fix update logic
    />
)}




{/* Table */}
{/* <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
{loading.isLoading ? (
                <div className="p-4 text-center text-sm text-[#202020]">
                  {loading.message || "Loading brands..."}
                </div>
              ) : (
      <table className="w-full ">
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
                        className="border-b text-sm font-normal"
                        onContextMenu={(e) => handleContextMenu(e, brand)}
                    >
                        <td className="px-6 py-4">{startIndex + index + 1}</td>

                        <td className="px-6 py-4">
                            {editingBrand === brand.brand_id ? (
                                <input
                                    type="text"
                                    value={updatedBrand?.brand_name || ""}
                                    onChange={(e) => handleInputChange(e, "brand_name")} 
                                    onKeyDown={handleKeyPress}
                                    autoFocus
                                    className="text-center w-full px-2 py-1 focus:outline-none"
                                />
                            ) : (
                                brand.brand_name
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
              )}
</div> */}

<BrandTable
    brands={brands}
    setBrands={setBrands}
    contextMenu={contextMenu}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    setContextMenu={setContextMenu}
/>
            
        {/* ------------------------------------------ Context Menu -----------------------------------------------*/}
        {/* {contextMenu && (
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
        )} */}

         
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
                      

                {successMsg?.create &&
      <SuccessMessage onClose={handleModalClose} showMsg={successMsg?.create} content={"Brand details have been created successfully!"}/>
       }
         {successMsg?.update &&
      <SuccessMessage onClose={handleModalClose} showMsg={successMsg?.update} content={"Brand details have been Updated successfully!"}/>
          }
                     

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