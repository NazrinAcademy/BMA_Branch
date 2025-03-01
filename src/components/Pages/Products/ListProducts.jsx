import { useState, useRef, useEffect } from "react";
import { Search, ListFilter, X, TriangleAlert , FileText, Printer, ChevronLeft, ChevronRight } from "lucide-react";
import {Link} from 'react-router-dom'
import successImage from '../../../assets/success.png'

import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

const ListProducts = () => {
    const products = [
        { id: 1, name: "DellD30Mouse", category: "Electronics", purchase: 700, sale: 850, gst: "18%", stock: "12 Pcs", amount: "₹12035" },
        { id: 2, name: "HP12Cable", category: "Electronics", purchase: 250, sale: 250, gst: "18%", stock: "20 Box", amount: "₹5900" },
        { id: 3, name: "Acern23Headset", category: "Electronics", purchase: 300, sale: 300, gst: "18%", stock: "35 Pcs", amount: "₹12390" },
        { id: 4, name: "Dell23Keyboard", category: "Electronics", purchase: 530, sale: 530, gst: "18%", stock: "5 Pcs", amount: "₹3127" },
        { id: 5, name: "HP34KMouse", category: "Electronics", purchase: 450, sale: 450, gst: "18%", stock: "50 Pcs", amount: "₹26550" },
        { id: 6, name: "OppoA54Mobile", category: "Electronics", purchase: 15000, sale: 15000, gst: "18%", stock: "73 Pcs", amount: "₹1292100" },
        { id: 7, name: "GalaxyQ23Mobile", category: "Electronics", purchase: 23000, sale: 23000, gst: "18%", stock: "53 Pcs", amount: "₹1438420" }
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const [showFilter, setShowFilter] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [unitFilter, setUnitFilter] = useState("");
    const [lowStockFilter, setLowStockFilter] = useState("");

    // Handle Export to Excel
    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(products);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "products.xlsx");
    };

    // Handle Export to PDF
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Product List", 20, 10);
        let y = 20;
        products.forEach((product, index) => {
            doc.text(`${index + 1}. ${product.name}`, 20, y);
            y += 10;
        });
        doc.save("products.pdf");
    };

    // Handle Print
    const handlePrint = () => {
        window.print();
    };

    // Toggle Filter Form
    const toggleFilter = () => {
        setShowFilter(!showFilter);
    };

    // Filtering Logic
    const filteredProducts = products.filter((product) => {
        const unit = product.stock.split(" ")[1];  // Extract unit from stock, like "Pcs", "Box"
        const isLowStock = parseInt(product.stock) <= 10; // Example low stock condition
        return (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (categoryFilter ? product.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true) &&
            (unitFilter ? unit.toLowerCase() === unitFilter.toLowerCase() : true) &&
            (lowStockFilter ? (lowStockFilter === "Yes" ? isLowStock : !isLowStock) : true)
        );
    });

    // Pagination Logic
    const startIndex = (currentPage - 1) * perPage;
    const totalPages = Math.ceil(filteredProducts.length / perPage);
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage);

    const handleCancelFilter = () => {
        setCategoryFilter("");
        setUnitFilter("");
        setLowStockFilter("");
        setShowFilter(false);
    };

    const handleSaveFilter = () => {
        setShowFilter(false); // Close the filter form
    };


    //   -------------------------------- edit , delete, view functions -----------------------------------
    const [contextMenu, setContextMenu] = useState(null);
    const [editRowId, setEditRowId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSuccessMessageUpdate, setShowSuccessMessageUpdate] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    // const [paginatedProducts, setPaginatedProducts] = useState()

    // Right-click event to show context menu
    const handleRightClick = (event, product) => {
        event.preventDefault(); // Prevent default right-click menu
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            product, // Store selected row data
        });
    };

    const inputRef = useRef(null);
    const [isEdited, setIsEdited] = useState(false);

    // Handle edit click
    const handleEdit = (product) => {
        setEditRowId(product.id);
        setEditedData({ ...product });
        setContextMenu(null);
        setIsEdited(false); // Reset edit tracking
    
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };
        


    // Handle delete click
    const handleDelete = (product) => {
        setSelectedRowId(product.id);
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
    const handleInputChange = (e, field) => {
        let value = e.target.value;
    
        if (field === "amount") value = value.replace("₹", "").trim();
        if (field === "stock") value = value.replace("Pcs", "").replace("Box", "").trim();
        if (field === "gst") value = value.replace("%", "").trim();
    
        // Prevent full delete on backspace
        if (value === "") return; 
    
        setEditedData((prevData) => ({
            ...prevData,
            [field]: value
        }));
        setIsEdited(true); // Mark that value is changed
    };
    


    // Save edited row
    // const handleSaveEdit = () => {
    //     if (!window.confirm("Are you sure you want to save changes?")) {
    //         return; // Stop execution if user cancels
    //     }

    //     setPaginatedProducts((prevData) =>
    //         prevData.map((item) =>
    //             item.id === editRowId ? { ...item, ...editedData } : item
    //         )
    //     );
    //     setEditRowId(null);
    //     setEditedData({});

    //     alert("Changes saved successfully!");
    // };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && isEdited) { // Only proceed if value is changed
            // setPaginatedProducts((prevData) =>
            //     prevData.map((item) =>
            //         item.id === editRowId ? { ...item, ...editedData } : item
            //     )
            // );
    
            setEditRowId(null);
            setEditedData({});
            setIsEdited(false); // Reset edit tracking
    
            setShowSuccessMessageUpdate(true);
            // Show success message only after saving
            setTimeout(() => {
                setShowSuccessMessageUpdate(false);
            }, 2000);
        }
    };


    // -------------------------------------------- view product --------------------------------------
    const [selectedProduct, setSelectedProduct] = useState(null);

    const viewProducts = [
        {
            name: "DellD30Mouse",
            brand: "Dell",
            category: "Electronics",
            subCategory: "Mouse",
            unit: "Pcs",
            code: "D30",
            barcode: "76543",
            image: "https://example.com/mouse.jpg",
            date: "13-02-2025",
            openingStock: "12 Pcs",
            stockValue: "₹12032",
            lowStockQty: "8",
            location: "Grafn Mobiles",
            purchasePrice: "400",
            salePrice: "550",
            minSalePrice: "500",
            mrp: "500",
            discount: "2",
            igst: "18",
            igstAmount: "99",
            cgst: "6",
            cgstAmount: "40",
            sgst: "6",
            sgstAmount: "40",
            cess: "--",
            totalAmount: "649",
        },
    ];

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
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
                <h2 className="text-xl font-semibold">Product List</h2>
                <div className="flex items-center gap-3">
                    <button onClick={toggleFilter} className="flex items-center px-4 py-2 border rounded text-gray-700">
                        Filter <ListFilter className="w-4 h-4 ml-2" />
                    </button>
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
                      <Link to={"/dashboard/addProduct"}
                         className="bg-purpleCustom text-nowrap text-white px-4 py-2 text-base font-semibold rounded flex items-center gap-2">
                      Add Product
                      </Link>  
                </div>
            </div>

            {/*------------------------------- Filter Form (Overlay) -------------------------------*/}
            {showFilter && (
                <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
                    <div className="bg-white overflow-hidden rounded w-2/3 h-48 px-7 py-5">
                        <h3 className="text-xl font-semibold text-left text-gray-700 mb-4">
                            Filter
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="relative">
                                <input
                                    placeholder=""
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                                />
                                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                                    Category
                                </label>
                            </div>

                            <div className="relative">
                                <label
                                    className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 z-10 transition-all 
                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                                >
                                    Unit
                                </label>
                                <div className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] flex items-center overflow-hidden text-sm focus-within:border-purpleCustom">
                                    <select className="peer w-full h-11 px-2 text-sm focus:outline-none appearance-none pr-8"
                                        value={unitFilter}
                                        onChange={(e) => setUnitFilter(e.target.value)}
                                    >
                                        <option value="" disabled>Select Unit</option>
                                        {/* Dynamically generate unit options */}
                                        {Array.from(new Set(products.map(p => p.stock.split(" ")[1]))).map((unit, idx) => (
                                            <option key={idx} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="relative">
                                <label
                                    className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 z-10 transition-all 
                                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                                >
                                    Unit
                                </label>
                                <div className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] flex items-center overflow-hidden text-sm focus-within:border-purpleCustom">
                                    <select className="peer w-full h-11 px-2 text-sm focus:outline-none appearance-none pr-8"
                                        value={lowStockFilter}
                                        onChange={(e) => setLowStockFilter(e.target.value)}
                                    >
                                        <option value="" disabled>Low Stock</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                                {/* Buttons aligned to the right */}
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        onClick={handleCancelFilter}
                                        className=" border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveFilter}
                                        className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/*----------------------------------------- Pagination Controls --------------------------------------------*/}

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
                        <span className="text-[#838383]">{currentPage}-{totalPages}</span>
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
                        Export Excel <FileText size={18} />
                    </button>
                    <button onClick={handleExportPDF} className="flex items-center gap-2 text-[#838383]">
                        Export PDF <FileText size={18} />
                    </button>
                    <button onClick={handlePrint} className="flex items-center gap-2 text-[#838383]">
                        Print <Printer size={18} />
                    </button>
                </div>
            </div>

            {/* ------------------------------------------- Table --------------------------------------------*/}
            <div className="mt-5">

            <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
      <table className="w-full ">
        <thead className="sticky top-0 bg-[#f8f8f8]">
        <tr className="text-sm font-semibold">
                                <th className="p-3 w-24">
                                    <input type="checkbox" />
                                </th>
                                <th className="p-3 w-72">Product</th>
                                <th className="p-3 w-72">Category</th>
                                <th className="p-3 w-52">Purchase Price</th>
                                <th className="p-3 w-52">Sale Price</th>
                                <th className="p-3 w-52">GST</th>
                                <th className="p-3 w-52">Opening Stock</th>
                                <th className="p-3 w-60">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 ">
                            {paginatedProducts.length > 0 ? (
                                paginatedProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b text-center text-sm font-normal cursor-pointer"
                                        onContextMenu={(e) => handleRightClick(e, product)} // Right-click event
                                    >
                                        <td className="px-6 py-4">
                                            <input type="checkbox" />
                                        </td>

                                        {/* Name Field */}
                                        <td className="py-4 bg-transparent focus:bg-slate-300">
                                            {editRowId === product.id ? (
                                                <input
                                                    type="text"
                                                    ref={inputRef} // Assign ref
                                                    value={editedData.name || product.name}
                                                    onChange={(e) => handleInputChange(e, "name")}
                                                    onKeyDown={handleKeyDown}  
                                                    className="text-center w-full px-2 py-1 focus:outline-none"                                                />
                                            ) : (
                                                product.name
                                            )}
                                        </td>

                                        {/* Category Field */}
                                        <td className=" py-4">
                                            {editRowId === product.id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.category || product.category}
                                                    onChange={(e) => handleInputChange(e, "category")}
                                                    onKeyDown={handleKeyDown}  
                                                    className="text-center w-full px-2 py-1  focus:outline-none"/>
                                            ) : (
                                                product.category
                                            )}
                                        </td>

                                        {/* Purchase Price */}
                                        <td className=" py-4">
                                            {editRowId === product.id ? (
                                                <input
                                                    type="number"
                                                    value={editedData.purchase || product.purchase}
                                                    onChange={(e) => handleInputChange(e, "purchase")}
                                                    onKeyDown={handleKeyDown}  
                                                    className="text-center w-full px-2 py-1  focus:outline-none"/>
                                            ) : (
                                                `₹ ${product.purchase}`
                                            )}
                                        </td>

                                        {/* Sale Price */}
                                        <td className=" py-4">
                                            {editRowId === product.id ? (
                                                <input
                                                    type="number"
                                                    value={editedData.sale || product.sale}
                                                    onChange={(e) => handleInputChange(e, "sale")}
                                                    onKeyDown={handleKeyDown}  
                                                    className="text-center w-full px-2 py-1 focus:outline-none"/>
                                            ) : (
                                                `₹ ${product.sale}`
                                            )}
                                        </td>

                                        {/* GST Field */}
                                        <td className=" py-4">
                                            {editRowId === product.id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.gst !== undefined ? editedData.gst : product.gst}
                                                    onChange={(e) => handleInputChange(e, "gst")}
                                                    onKeyDown={handleKeyDown}  
                                                    className="text-center w-full px-2 py-1  focus:outline-none "/>
                                            ) : (
                                                product.gst
                                            )}
                                        </td>

                                        {/* Stock Field */}
                                        <td className="py-4">
                                            {editRowId === product.id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.stock !== undefined ? editedData.stock : product.stock}
                                                    onChange={(e) => handleInputChange(e, "stock")}
                                                    onKeyDown={handleKeyDown}  
                                                    className="text-center w-full px-2 py-1  focus:outline-none" />
                                            ) : (
                                                product.stock
                                            )}
                                        </td>

                                        {/* Amount Field */}
                                        <td className="py-4">
                                            {editRowId === product.id ? (
                                                <input
                                                    type="text"
                                                    value={editedData.amount !== undefined ? editedData.amount : product.amount}
                                                    onChange={(e) => handleInputChange(e, "amount")}
                                                    onKeyDown={handleKeyDown}  
                                                    className="text-center w-full px-2 py-1  focus:outline-none"/>
                                            ) : (
                                                product.amount
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-4 text-center">
                                        No results found
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>

            {/* ------------------------------------------ Context Menu -----------------------------------------------*/}
            {contextMenu && (
                <div
                    className="absolute z-100 bg-white shadow-md border rounded"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <ul>
                        <li
                            onClick={() => handleViewProduct(viewProducts[0])}
                            className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            View
                        </li>
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
              
              
              {/* ------------------------------------- View product --------------------------------- */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-5xl rounded shadow-lg p-6 relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute  right-4 text-[#838383] hover:text-gray-900"
                        >
                            <X size={24} />
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-semibold border-b pb-3">{selectedProduct.name}</h2>

                        {/* Content */}
                        <div className="grid grid-cols-12 gap-6 mt-4">
                            {/* Image (Left Side) */}
                            <div className="col-span-4 flex items-center justify-center">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-48 h-48 object-cover rounded"
                                />
                            </div>

                            {/* Product Details (Middle) */}
                            <div className="col-span-4">
                                <h3 className="text-lg font-semibold">Product Details</h3>
                                <div className="flex flex-col gap-2 text-base font-normal mt-2">
                                    <p><span className="text-[#838383]">Brand:</span> {selectedProduct.brand}</p>
                                    <p><span className="text-[#838383]">Category:</span> {selectedProduct.category}</p>
                                    <p><span className="text-[#838383]">Sub Category:</span> {selectedProduct.subCategory}</p>
                                    <p><span className="text-[#838383]">Unit:</span> {selectedProduct.unit}</p>
                                    <p><span className="text-[#838383]">Product Code:</span> {selectedProduct.code}</p>
                                    <p><span className="text-[#838383]">Barcode/QR Code:</span> {selectedProduct.barcode}</p>
                                </div>
                            </div>

                            {/* Stock Details (Right Side) */}
                            <div className="col-span-4">
                                <h3 className="text-lg font-semibold">Stock Details</h3>
                                <div className="flex flex-col gap-2 text-base font-normal mt-2">
                                    <p><span className="text-[#838383]">Date:</span> {selectedProduct.date}</p>
                                    <p><span className="text-[#838383]">Opening Stock:</span> {selectedProduct.openingStock}</p>
                                    <p><span className="text-[#838383]">Stock Value:</span> {selectedProduct.stockValue}</p>
                                    <p><span className="text-[#838383]">Low Stock Qty:</span> {selectedProduct.lowStockQty}</p>
                                    <p><span className="text-[#838383]">Location:</span> {selectedProduct.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price & GST Details Table */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Product Pricing</h3>
                            <table className="w-full border-collapse border border-gray-300 mt-2 ">
                                <thead className="bg-gray-200">
                                    <tr className="text-base font-semibold">
                                        <th className=" px-3 py-2">Purchase Price(₹)</th>
                                        <th className=" px-3 py-2">Sale Price(₹)</th>
                                        <th className=" px-3 py-2">Min. Sale Price(₹)</th>
                                        <th className=" px-3 py-2">M.R.P(₹)</th>
                                        <th className=" px-3 py-2">Discount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center text-base font-normal  border border-gray-300">
                                        <td className=" px-3 py-2">₹{selectedProduct.purchasePrice}</td>
                                        <td className=" px-3 py-2">₹{selectedProduct.salePrice}</td>
                                        <td className=" px-3 py-2">₹{selectedProduct.minSalePrice}</td>
                                        <td className=" px-3 py-2">₹{selectedProduct.mrp}</td>
                                        <td className=" px-3 py-2">{selectedProduct.discount}%</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h3 className="text-lg font-semibold mt-4">GST Details</h3>
                            <table className="w-full border-collapse border border-gray-300 mt-2 text-sm">
                                <thead className="bg-gray-200">
                                    <tr className="text-base font-semibold">
                                        <th colSpan={2} className=" px-3 py-2">IGST (%)</th>
                                        <th colSpan={2} className=" px-3 py-2">CGST (%)</th>
                                        <th colSpan={2} className=" px-3 py-2">SGST (%)</th>
                                        <th colSpan={2} className=" px-3 py-2">Cess (%)</th>
                                        <th colSpan={2} className=" px-3 py-2">Total Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr className=" border border-gray-300 text-base font-normal">
                                        <td className=" border-r border-gray-300 px-3 py-2 text-center">{selectedProduct.igst}%</td>
                                        <td className=" px-3 py-2 text-center">₹{selectedProduct.igstAmount}</td>
                                        <td className=" border-r border-gray-300 px-3 py-2 text-center">{selectedProduct.cgst}%</td>
                                        <td className=" px-3 py-2 text-center">₹{selectedProduct.cgstAmount}</td>
                                        <td className=" border-r border-gray-300 px-3 py-2 text-center">{selectedProduct.sgst}%</td>
                                        <td className=" px-3 py-2 text-center">₹{selectedProduct.sgstAmount}</td>
                                        <td className=" px-3 py-2 text-center">{selectedProduct.cess || "--"}</td>
                                        <td className=" px-3 py-2 text-center">{selectedProduct.cessAmount || "--"}</td>
                                        <td className=" px-3 py-2 text-center font-semibold">₹{selectedProduct.totalAmount}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ListProducts;
