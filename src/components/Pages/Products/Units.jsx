import { useState, useEffect, useRef } from "react";
import { Plus, Search, Sheet, FileText, Printer, ChevronLeft, ChevronRight, ChevronDown, TriangleAlert, X } from "lucide-react";
import { fetchUnits, addNewUnit, deleteUnit, updateUnit } from "../../../apiService/AddProductAPI"; // Import your API functions
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import successImage from '../../../assets/success.png'
import { useSelector } from "react-redux";
import SuccessMessage from "../../SuccessMessage";
import UnitModal from "./ProductDetails/UnitModal";
import UnitTable from "../Products/ProductDetails/UnitTable";


const Units = () => {
  const [units, setUnits] = useState([
    { id: 1, unit: "m" , fullname:"meter", allow_decimal:"yes"},
    { id: 2, unit: "kg" , fullname:"kilogram", allow_decimal:"no"},
    { id: 3, unit: "box" , fullname:"box", allow_decimal:"no"},
    { id: 4, unit: "pkt" , fullname:"pocket", allow_decimal:"yes"},
]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [showOverlay, setShowOverlay] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [unitFullName, setUnitFullName] = useState("");
  const [allowDecimal, setAllowDecimal] = useState("yes");
  const [searchTerm, setSearchTerm] = useState("");

  const [successMsg, setSuccessMsg] = useState({ create: "", update: "" })
  const [triggerApi,setTriggerApi]=useState({getApi:false})
  const [isShowModal, setIsShowModal] = useState({ add: false, edit: false });
  const [loading, setLoading] = useState({ isLoading: false, message: "" });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)


  const startIndex = (currentPage - 1) * perPage;
  const { userDetails } = useSelector((state) => (state.auth))


  // Input Refs for Focus
  const newUnitRef = useRef(null);
  const newFullNameRef = useRef(null);
  const newAllowDecimalRef = useRef(null);

  useEffect(() => {
        setTimeout(() => {
          setShowSuccessMessage(false);
          setSuccessMsg((prevState) => ({...prevState, create:false, update:false}))
        }, 2000);
      
    }, [showSuccessMessage, successMsg?.create, successMsg?.update]);

  const loadUnits = async () => {
    setLoading({ isLoading: true, message: "Fetching units..." });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails.access_token}`,
      },
    };
    try {
      const fetchedUnits = await fetchUnits(config);
      console.log("Fetched Units:", fetchedUnits);
      setUnits(fetchedUnits?.unit_all);
      setLoading({ isLoading: false, message: "" });
    } catch (error) {
      console.error("Error loading units:", error);
      setLoading({ isLoading: false, message: "Failed to fetch data" });

    }
  };
  useEffect(() => {

    loadUnits();
  }, []);


  // Handle Overlay
  const handleOpenOverlay = () => {
    setIsShowModal({ add: true, edit: false });
    setUnitName("");
    setUnitFullName("");
    setAllowDecimal("");
}; 

// const handleCloseOverlay = () => setShowOverlay(false);

  // Handle Save Unit
  const handleSaveUnit = async () => {
    if (unitName.trim() !== "" && unitFullName.trim() !== "") {
      const newUnit = {
        unit: unitName,
        fullname: unitFullName,
        allow_decimal: allowDecimal === "yes",
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails?.access_token}`
        }
      };

      try {
        handleModalClose();
        console.log("Saving Unit:", newUnit); 

        const addedUnit = await addNewUnit(newUnit, config); 
        console.log("Unit Saved:", addedUnit); 

        setUnits([...units, addedUnit]); 
        console.log("Updated Units:", [...units, addedUnit]);

        setUnitName("");
        setUnitFullName("");
        setAllowDecimal("yes");
        setSuccessMsg((prevState) => ({ ...prevState, update: true }));

        await loadUnits();
        console.log("Units Loaded Successfully!"); 
      } catch (error) {
        console.error("Error saving unit:", error.response?.data || error.message);
      }
    }
  };


  const handleModalClose = () => {
    console.log("Modal Close Function Called!"); 
    setIsShowModal({ add: false, edit: false });
    setSelectedUnit(null);
    setUnitName("");
    setUnitFullName("");
    setAllowDecimal("");
};

  // Handle Export to Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(units);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "units");
    XLSX.writeFile(wb, "units.xlsx");
  };

  // Handle Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("unit List", 20, 10);
    let y = 20;
    units.forEach((unit, index) => {
      doc.text(`${index + 1}. ${unit.unit}`, 20, y);
      y += 10;
    });

    doc.save("units.pdf");
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };


  // Filter units based on search term
  const filteredUnits = units.filter(unit =>
    unit?.unit?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );


  const totalPages = Math.ceil(filteredUnits.length / perPage);
  const paginatedUnits = filteredUnits.slice(startIndex, startIndex + perPage);


  // ------------------------ delete functions --------------------
  const [contextMenu, setContextMenu] = useState(null);
  const [showSuccessMessageUpdate, setShowSuccessMessageUpdate] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);



  // Open Context Menu on Right Click
  const handleContextMenu = (event, unit) => {
    event.preventDefault();
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      product: unit, 
    });

  };

  // Handle Delete Click
  const handleDelete = (unit) => {
    setSelectedUnit(unit);
    setShowDeleteConfirm(true);
    setContextMenu(null);
  };

  const confirmDelete = async () => {
    setLoading({ isLoading: true, message: "Deleting units..." });

    if (!selectedUnit?.id) return;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails.access_token}`,
      }
    };
    try {
      await deleteUnit(selectedUnit.id, config);
      setUnits((units) => units.filter((unit) => unit.id !== selectedUnit.id));
      setShowDeleteConfirm(false);
      setSuccessMsg((prevState) => ({ ...prevState, update: true }));
    } catch (error) {
      console.error("Error deleting unit:", error);
      alert("Failed to delete unit!");
    }finally {
      setLoading({ isLoading: false, message: "" });
      setShowDeleteConfirm(false);
      setSelectedRowId(null);
    }
  };


  // -----------------------edit functions---------------------
  const [editingUnit, setEditingUnit] = useState(null);
  const [updatedUnit, setUpdatedUnit] = useState({});

  const handleUpdate = async () => {
    if (!updatedUnit.unit || !updatedUnit.fullName) {
      alert("Unit and Full Name are required!");
      return;
    }
  
    try {
      const payload = {
        unit: updatedUnit.unit,
        fullname: updatedUnit.fullName,
        allow_decimal: updatedUnit.allowDecimal === true, 
      };
  
      await updateUnit(editingUnit, payload);
      
      setUnits((prevUnits) =>
        prevUnits.map((unit) =>
          unit.id === editingUnit ? { ...unit, ...updatedUnit } : unit
        )
      );
  
      setSuccessMsg((prevState) => ({ ...prevState, update: true })); 
  
      setEditingUnit(null);
      setIsShowModal({ edit: false, add: false });
    } catch (error) {
      console.error("Error updating unit:", error);
      alert("Failed to update unit!");
    }
  };
    

  const handleEdit = (unit) => {
    console.log("Editing Unit:", unit); 
    setSelectedUnit(unit); 
    setUnitName(unit.unit);
    setUnitFullName(unit.fullname);
    setAllowDecimal(unit.allow_decimal ? "yes" : "no");
    setIsShowModal({ add: false, edit: true });
};


  const handleInputChange = (e, field) => {
    setUpdatedUnit((prev) => ({
      ...prev,
      [field]: field === "allowDecimal" ? e.target.checked : e.target.value,
    }));
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

  console.log("unitalll", units)

  return (
    <div className="bg-white h-full px-7 py-3 rounded shadow-md w-full max-w-6xl font-['Plus Jakarta Sans'] mx-auto">
      <div className="flex justify-between items-center border-b py-4">
        <h2 className="text-xl font-semibold">Units</h2>
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
          <button onClick={handleOpenOverlay} className="bg-purpleCustom text-white px-4 py-2 text-base font-semibold rounded flex items-center gap-2">
            Add Unit
          </button>
        </div>
      </div>

      {/* Overlay Form */}
      {/* {showOverlay && (
        <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
          <div className="bg-white overflow-hidden rounded-lg w-[692px] h-72 px-7 py-6">
            <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">Add New Unit</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder=""
                  value={unitName}
                  ref={newUnitRef}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Unit * (Kg.Pcs)
                </label>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder=""
                  value={unitFullName}
                  ref={newFullNameRef}
                  onChange={(e) => setUnitFullName(e.target.value)}
                  className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Full Name * (Kilogram)
                </label>
              </div>

              <div className="relative col-span-2">
                <label className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 z-10 transition-all">
                  Allow Decimal (0.5)
                </label>
                <div className="relative flex items-center">
                  <select
                    className="peer w-full h-11 pl-4 pr-8 rounded border border-gray-400 appearance-none focus:border-purpleCustom focus:ring-1 focus:ring-purpleCustom text-sm focus:outline-none"
                    value={allowDecimal}
                    onChange={(e) => setAllowDecimal(e.target.value)}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-3 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button onClick={handleCloseOverlay} className="border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded">Cancel</button>
              <button onClick={handleSaveUnit} className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )} */}

      {/* Pagination Controls */}
      <div className="my-4 flex flex-col sm:flex-row justify-between text-[#838383] items-center">
        <div className="flex items-center gap-2">
          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-1 rounded-lg text-purple-700">
              <ChevronLeft size={20} />
            </button>
            <span className="text-[#838383]">{currentPage} / {totalPages}</span>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-1 rounded-lg text-purple-700">
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

{isShowModal.add && (
  <UnitModal
    handleModalClose={handleModalClose}
    handleSaveUnit={handleSaveUnit}
    content={"Add New Unit"}
    unitName={unitName}
    setUnitName={setUnitName}
    unitFullName={unitFullName}
    setUnitFullName={setUnitFullName}
    allowDecimal={allowDecimal}
    setAllowDecimal={setAllowDecimal}
    newUnitRef={newUnitRef}
    newFullNameRef={newFullNameRef}
  />
)}

{isShowModal.edit && (
  <UnitModal
  handleUpdate={handleUpdate}
    handleModalClose={handleModalClose}
    content={"Update Unit"}
    unitName={unitName}
    selectedUnit={selectedUnit}
    setUnitName={setUnitName}
    unitFullName={unitFullName}
    setUnitFullName={setUnitFullName}
    allowDecimal={allowDecimal}
    setAllowDecimal={setAllowDecimal}
  />
)}
      {/* Units Table */}
      {/* <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
        <table className="w-full ">
          <thead className="sticky top-0 bg-[#f8f8f8]">
            <tr className="text-sm font-semibold">
              <th className="px-4 py-2">S.No</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Full Name</th>
              <th className="px-4 py-2">Allow Decimal</th>
            </tr>
          </thead>
          <tbody>
            {units.length > 0 ? (
              units.map((unit, index) => (
                <tr
                  key={unit.id}
                  className="border-b text-sm text-center font-normal"
                  onContextMenu={(e) => handleContextMenu(e, unit)}
                >
                  <td className="px-6 py-4">{startIndex + index + 1}</td>

                  <td className="px-6 py-4">
                    {editingUnit === unit.id ? (
                      <input
                        type="text"
                        value={updatedUnit?.unit || ""}
                        onChange={(e) => handleInputChange(e, "unit")}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        className="text-center w-full px-2 py-1 focus:outline-none"
                      />
                    ) : (
                      unit.unit
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingUnit === unit.id ? (
                      <input
                        type="text"
                        value={updatedUnit?.fullName || ""}
                        onChange={(e) => handleInputChange(e, "fullName")}
                        onKeyDown={handleKeyPress}
                        className="text-center w-full px-2 py-1 focus:outline-none"
                      />
                    ) : (
                      unit.fullname
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {editingUnit === unit.id ? (
                      <input
                        type="checkbox"
                        checked={updatedUnit?.allowDecimal}
                        onChange={(e) => handleInputChange(e, "allowDecimal")}
                        onKeyDown={handleKeyPress}
                        className="cursor-pointer"
                      />
                    ) : (
                      unit.allowDecimal ? "Yes" : "No"
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
      </div> */}

<UnitTable
  units={units}
  setUnits={setUnits}
  contextMenu={contextMenu}
  setContextMenu={setContextMenu}
  handleDelete={handleDelete}
  handleEdit={handleEdit}
/>
      {/* ------------------------------------------ Context Menu -----------------------------------------------*/}
      {/* {contextMenu?.product && (
        <div
          className="absolute z-100 bg-white shadow-md border rounded"
          style={{ top: contextMenu.y, left: contextMenu.x }}          >
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
      <SuccessMessage onClose={handleModalClose} showMsg={successMsg?.create} content={"Unit details have been created successfully!"}/>
       }
         {successMsg?.update &&
      <SuccessMessage onClose={handleModalClose} showMsg={successMsg?.update} content={"Unit details have been Updated successfully!"}/>
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
    </div>
  );
};

export default Units;
