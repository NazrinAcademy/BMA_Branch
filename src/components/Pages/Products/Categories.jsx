import { useState } from "react";
import {
  Plus,
  Search,
  Sheet,
  FileText,
  Printer,
  Trash,
  Edit,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";

const Categories = () => {
  const allCategories = [
    { id: 1, name: "Fashion", igst: 12, cgst: 6, sgst: 6, image: "" },
    { id: 2, name: "Electronics", igst: 18, cgst: 9, sgst: 9, image: "" },
    { id: 3, name: "Food", igst: 5, cgst: 2.5, sgst: 2.5, image: "" },
    { id: 4, name: "Vegetables", igst: 10, cgst: 5, sgst: 5, image: "" },
    { id: 5, name: "Accessories", igst: 15, cgst: 7.5, sgst: 7.5, image: "" },
    { id: 6, name: "Home Appliances", igst: 24, cgst: 12, sgst: 12, image: "" },
    { id: 7, name: "Cloths", igst: 10, cgst: 5, sgst: 5, image: "" },
    { id: 8, name: "Toys", igst: 8, cgst: 4, sgst: 4, image: "" },
    { id: 9, name: "Books", igst: 7, cgst: 3.5, sgst: 3.5, image: "" },
    { id: 10, name: "Jewelry", igst: 20, cgst: 10, sgst: 10, image: "" },
  ];

  const [categories, setCategories] = useState(allCategories);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(7);

  const totalPages = Math.ceil(categories.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedCategories = categories.slice(startIndex, startIndex + perPage);


  // ----------------------------------
  const [showOverlay, setShowOverlay] = useState(false);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    igst: "",
    cgst: "",
    sgst: "",
  });

  // Overlay Open & Close Functions
  const handleOpenOverlay = () => setShowOverlay(true);
  const handleCloseOverlay = () => setShowOverlay(false);

  // Input Change Function
  const handleInputChange = (e, field) => {
    setNewCategory({ ...newCategory, [field]: e.target.value });
  };

  // Handle Save Category
  const handleSaveCategory = () => {
    console.log("Category Saved:", newCategory);
    handleCloseOverlay(); // Close after saving
  };

  // handle export excel

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(categories);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Categories');
    XLSX.writeFile(wb, 'categories.xlsx');
  };

  // handle export pdf

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Categories List", 20, 10);
    let y = 20;
    categories.forEach((category, index) => {
      doc.text(`${index + 1}. ${category.name} - IGST: ${category.igst}% - CGST: ${category.cgst}% - SGST: ${category.sgst}%`, 20, y);
      y += 10;
    });
    doc.save("categories.pdf");
  };

  // handle print

  const handlePrint = () => {
    window.print();
  };
  

  return (
    <div className="bg-white h-full px-7 py-3 rounded shadow-md w-full max-w-6xl font-sans mx-auto">
      <div>
        <div className="flex justify-between items-center border-b py-4">
          <h2 className="text-xl font-semibold font-jakarta">Categories</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded pl-10 py-2 w-60"
              />
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            </div>
            <button
              onClick={handleOpenOverlay}
              className="bg-[#593fa9] text-white  px-4 py-2 text-base font-semibold rounded flex items-center gap-2">
              Add Category
            </button>
          </div>

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
                        onChange={(e) => handleInputChange(e, field)}
                        placeholder=""
                        className="peer w-full h-11 pl-4 pr-8 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                      />
                      <label
                        className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
                    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
                    peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
                    peer-focus:bg-white"
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
                    onClick={handleCloseOverlay}
                    className="px-14 py-2 bg-[#fff] border border-t border-[#593fa9] font-jakarta font-semibold text-[#593fa9] rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCategory}
                    className="px-16 py-2 text-[#fff] bg-[#593fa9] text-base font-semibold font-jakarta rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="my-4 flex justify-between text-[#838383] items-center">

          <div className="flex">
            {/* Page Navigation */}
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-1 rounded-lg ${currentPage === 1 ? "text-[#838383]" : "text-[#202020]"}`}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-[#838383]">
                {currentPage}-{totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-1 rounded-lg ${currentPage >= totalPages ? "text-[#838383]" : "text-[#202020]"}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>


            {/* Per Page Dropdown */}
            <div className="flex items-center text-[#838383] gap-2">
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
                <option value="7">7</option> {/* Add this option */}
                <option value="10">10</option>
              </select>

            </div>

          </div>
          {/* Export Buttons */}
          <div className="flex gap-4">
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
        </div>

        {/* Table */}
        <div className="max-h-[350px] overflow-y-auto">
          <table className="w-full border-collapse border text-center rounded-lg">
            <thead className="bg-[#f8f8f8]">
              <tr className="text-base font-semibold font-jakarta text-[#202020]">
                <th className="p-3 ">S.No</th>
                <th className="p-3">Categories</th>
                <th className="p-3">IGST %</th>
                <th className="p-3">CGST %</th>
                <th className="p-3">SGST %</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category, index) => (
                <tr key={category.id} className="border-t text-base font-normal">
                  <td className="p-3 font-jakarta font-normal text-base text-[#202020]">{String(startIndex + index + 1).padStart(2, "0")}</td>
                  <td className="p-3 font-jakarta font-normal text-base text-[#202020]">{category.name}</td>
                  <td className="p-3 font-jakarta font-normal text-base text-[#202020]">{category.igst} %</td>
                  <td className="p-3 font-jakarta font-normal text-base text-[#202020]">{category.cgst} %</td>
                  <td className="p-3 font-jakarta font-normal text-base text-[#202020]">{category.sgst} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
