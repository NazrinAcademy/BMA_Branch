import { useRef, useState, useEffect, useCallback } from "react";
import {
  Search,
  FileText,
  Printer,
  Sheet,
  ChevronRight,
  ChevronLeft,
  TriangleAlert,
  X,
  AppleIcon,
} from "lucide-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import successImage from '../../../assets/success.png'
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { SupplierAdd, SupplierDelete, Supplierget, SupplierUpdate } from "../../../apiService/supplierAPI";

const Supplier = () => {
  const allSuppliers = [
    {
      id: 1,
      supplierName: "Niyas",
      phoneNo: 7695822683,
      email: "niyas@gmail.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 2,
      supplierName: "Mohamed",
      phoneNo: 9695822683,
      email: "mohamed@gmail.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 30000,
      gstNumber: 1000,
    },
    {
      id: 3,
      supplierName: "Ismail",
      phoneNo: 7995822683,
      email: "ismai@gmaill.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 40000,
      gstNumber: 2000,
    },
    {
      id: 4,
      supplierName: "Raja",
      phoneNo: 8895822683,
      email: "raja@gmail.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 9000,
      gstNumber: 3000,
    },
    {
      id: 5,
      supplierName: "joe",
      phoneNo: 7195822681,
      email: "joe@gmail.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 80000,
      gstNumber: 4000,
    },
    {
      id: 6,
      supplierName: "Maddy",
      phoneNo: 8695822688,
      email: "maddy@gmail.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 70000,
      gstNumber: 5000,
    },
    {
      id: 7,
      supplierName: "Ram",
      phoneNo: 7611822684,
      email: "ram@gmail.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 60000,
      gstNumber: 6000,
    },
    {
      id: 8,
      supplierName: "Vincy",
      phoneNo: 7695822685,
      email: "vinc@gmail.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 90000,
      gstNumber: 7000,
    },
    {
      id: 9,
      supplierName: "Kalai",
      phoneNo: 6595822685,
      email: "kalai@gmail.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 110000,
      gstNumber: 9000,
    },
    {
      id: 10,
      supplierName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 11,
      supplierName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 12,
      supplierName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 13,
      supplierName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 14,
      supplierName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      pinCode: 627811,
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 15,
      supplierName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      area: "Tenkasi",
      pinCode: "627814",
      state: "TamilNadu",
      address: "South Main Road",
      openingBalance: 20000,
      gstNumber: 5000,
    },
  ];

  const { userDetails } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState({ isLoading: false, message: "" });

  const [Suppliers, setSuppliers] = useState(allSuppliers);
  const navigate = useNavigate();

  // -------------------Pagenation Function----------------------------z
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQurey, setsearchQurey] = useState("");

  //  -------------------Edit, Delete,View function------------------
  const [contextDropdown, setContextDropdown] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editUpdateSupplier, setUpdateSupplier] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [SuccessMeg, setSuccessMsg] = useState({ create: "", update: "" })
  const [filteredSuppliers, setFilteredSuppliers] = useState(Suppliers);
  const inputRef = useRef(null);





  useEffect(() => {
    const handlePressOutside = (event) => {
      if (contextDropdown && !event.target.closest(".context-dropdown")) {
        setContextDropdown(null);
      }
    };

    document.addEventListener("click", handlePressOutside);
    return () => {
      document.removeEventListener("click", handlePressOutside);
    };
  }, [contextDropdown]);

  useEffect(() => {
    if (showSuccessMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    }
  }, [showSuccessMessage]);

  //-------------- edit function-----------------

  const handleEditing = (tableData) => {
    setEditingSupplier(tableData.id);

    if (!tableData.address.includes(tableData.area)) {
      setUpdateSupplier({
        ...tableData,
        address: ` ${tableData.area}, ${tableData.state}, ${tableData.pinCode}`,
      });
    } else {
      setUpdateSupplier(tableData);
    }
  };


  const handleInputChanges = (e, field) => {
    setUpdateSupplier({
      ...editUpdateSupplier,
      [field]: e.target.value,
    });
  };

  const handleUpdate = () => {
    if (!editingSupplier) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`,
      },
    };

    SupplierUpdate(
      { id: editingSupplier, ...editUpdateSupplier },
      config,
      (res) => {
        setFilteredSuppliers((prevSuppliers) =>
          prevSuppliers.map((supplier) =>
            supplier.id === editingSupplier ? { ...supplier, ...editUpdateSupplier } : supplier
          )
        );
        setEditingSupplier(null);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 2000);
      },
      (err) => {
        console.log(err);
        alert("Update failed!");
      }
    );
  };


  const handleKeyClick = (e) => {
    if (e.key === "Enter") {
      handleUpdate();
    }
  };

  const handleRightClick = (event, tableData) => {
    event.preventDefault();
    setContextDropdown({ x: event.pageX, y: event.pageY, tableData });
  };


  // ----------------- delete functions ------------------

  const handleDelete = (tableData) => {
    setSelectedRowId(tableData.id);
    setDeleteMessage(true);
    setContextDropdown(null);
  };

  const confirmDeleteData = () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`,
      },
    };

    SupplierDelete(
      selectedRowId,
      config,
      (res) => {
        setFilteredSuppliers((prevData) =>
          prevData.filter((item) => item.id !== selectedRowId)
        );
        setDeleteMessage(false);
      },
      (err) => {
        console.log(err);
        alert("Delete failed!");
      }
    );
  };

  // ----------------------Search Function------------------------------
  useEffect(() => {
    const filteredData = Suppliers.filter(
      (supplier) =>
        supplier.supplierName
          .toLowerCase()
          .includes(searchQurey.toLowerCase()) ||
        supplier.phoneNo.toString().includes(searchQurey) ||
        supplier.email.toLowerCase().includes(searchQurey.toLowerCase()) ||
        supplier.address.toLowerCase().includes(searchQurey.toLowerCase())
    );
    setFilteredSuppliers(filteredData);
  }, [searchQurey, Suppliers]);

  const totalPage = Math.ceil(filteredSuppliers.length / perPage);
  const starterIndex = (currentPage - 1) * perPage;
  const pagenationSupplier = filteredSuppliers.slice(
    starterIndex,
    starterIndex + perPage
  );
  // ------------------------Export,Pdf,Print--------------------------------
  const handleExcel = () => {
    const ws = XLSX.utils.json_to_sheet(Suppliers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Suppliers");
    XLSX.writeFile(wb, "Suppliers.xlsx");
  };
  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text("Suppliers List", 20, 10);
    let y = 15;
    Suppliers.forEach((Supp, index) => {
      doc.text(
        `${index + 1}-${Supp.supplierName} - PhoneNo: ${Supp.phoneNo} -Email: ${Supp.email
        }-Address ${Supp.address}-Area ${Supp.area}-PinCode${Supp.pinCode
        }-State${Supp.state}-OpeningBalance${Supp.openingBalance
        }-BalanceAmount${Supp.balanceAmount}`,
        15,
        y
      );
      y += 10;
    });
    doc.save("Suppliers.pdf");
  };
  const handelPrint = () => {
    window.print();
  };


  // -----------------------Supplier from---------------------------
  const [selectedState, setSelectedState] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setform] = useState({
    supplierName: "",
    phoneNo: "",
    email: "",
    address: "",
    Area: "",
    pinCode: "",
    State: "",
    openingBalance: "",
    gstNumber: "",
  });

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.supplierName ||
      !form.phoneNo ||
      !form.email ||
      !form.address ||
      !form.openingBalance || !selectedState
    ) {
      toast("Please fill all required fields");
    }
    else {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails?.access_token}`,
        },
      }
      const payload = {
        User_id: userDetails?.access_token,
        customer_name: form?.supplierName,
        mobile_no: form?.phoneNo,
        email: form?.email,
        address: form?.address,
        area: form?.Area,
        pincode: form?.pincode,
        state: selectedState,
        openging_balance: form?.openingBalance,
        gst_number: form?.gstNumber,
      };
      SupplierAdd(
        payload,
        config,
        (res) => {
          setSuccessMsg((prevState) => ({ ...prevState, create: true }))
          setform({})
          setShowModal(false);
        },
        (err) => {
          if (err?.response?.data?.error) {
            alert(err?.response?.data?.error);
            console.log(err);
          }
          else {
            alert("failed")
          }

        }
      );

    }
  };

  // -------- get function:

  const getDetails = useCallback(() => {
    setLoading({ isLoading: true, message: "Fetching supplier details..." });
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`
      },

    };
    Supplierget(
      config,
      (res) => {
        setSuppliers(res?.data)
        setLoading({ isLoading: false, message: "" });
      },
      (err) => {
        console.log(err);
        setLoading({ isLoading: false, message: "Failed to fetch data" });
      }
    );


  }, [userDetails?.access_token])

  useEffect(() => {
    getDetails();
  }, [getDetails]);



  useEffect(() => {
    setFilteredSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) => ({
        ...supplier,
        address: `${supplier.address}, ${supplier.area}, ${supplier.state}, ${supplier.pinCode}`,
      }))
    );
  }, []);

  return (
    <>
      <div className="flex h-screen  bg-[#ffff] rounded-md">
        <div className="bg-[#ffff] p-5 rounded-lg w-full shadow ">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold font-jakarta">Supplier List</h1>
            <div className="flex items-center space-x-2">
              <div className="relative flex gap-6 ">
                <Search className="absolute font-medium left-3 top-1/2 transform -translate-y-1/2 text-[#838383] font-jakarta text-sm" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQurey}
                  onChange={(e) => {
                    setsearchQurey(e.target.value);
                  }}
                  className="pl-14 text-sm  font-medium  pr-4 py-[8px] font-jakarta border border-[#838383] rounded-md focus:ring-1 focus:ring-[#838383] focus:outline-none"
                />

                <div
                  className="bg-[#593fa9] text-white  px-4 py-2 text-base font-semibold rounded flex items-center gap-2"
                  onClick={() => setShowModal(true)}
                >
                  Add Supplier
                </div>
              </div>
            </div>
          </div>
          <div className="border-b border-[#c9c9cd] p-3 w-full "></div>

          <div className="my-4 flex justify-between text-[#838383] items-center">
            <div className="flex">
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`px-1 rounded-lg ${currentPage === 1 ? "text-[#838383]" : "text-[#202020]"
                    }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-[#838383]">
                  {currentPage}-{totalPage}
                </span>
                <button
                  disabled={currentPage >= totalPage}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`px-1 rounded-lg ${currentPage >= totalPage ? "text-[#838383]" : "text-[#202020]"
                    }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="flex items-center text-[#838383] gap-2">
                <span>Per Page</span>
                <select
                  className="border rounded py-1 px-2 "
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="flex gap-1 items-center space-x-1 font-medium text-sm font-jakarta text-[#838383]"
                onClick={handleExcel}
              >
                <span>Export Excel</span>
                <Sheet size={20} />
              </button>
              <button
                className="flex gap-1 items-center space-x-1 text-sm font-medium font-jakarta text-[#838383]"
                onClick={handlePDF}
              >
                <span>Export PDF</span>
                <FileText size={20} />
              </button>
              <button
                className="flex gap-2 items-center text-sm font-medium font-jakarta text-[#838383]"
                onClick={handelPrint}
              >
                <span>Print</span>
                <Printer size={20} />
              </button>
            </div>
          </div>
          <div className="mt-5 rounded-md border border-[#c9c9cd]">
            <div className="max-h-[350px] overflow-y-auto">
              {loading.isLoading ? (
                <div className="p-4 text-center text-sm text-[#202020]">
                  {loading.message || "Loading suppliers..."}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="sticky top-0 bg-[#f8f8f8]">
                    <tr className="text-left">
                      <th className="p-2 text-center text-sm font-semibold w-[5%]">
                        S.No
                      </th>
                      <th className="p-2 text-center text-sm font-semibold w-[20%]">
                        Supplier Name
                      </th>
                      <th className="p-2 text-center text-sm font-semibold w-[17%]">
                        Mobile No
                      </th>
                      <th className="p-2 text-center text-sm font-semibold w-[20%]">
                        Email
                      </th>
                      <th className="p-2 text-center text-sm font-semibold w-[15%]">
                        Address
                      </th>
                      <th className="p-2 text-center text-sm font-semibold w-[10%]">
                        Opening Balance
                      </th>
                      <th className="p-2 text-center text-sm font-semibold w-[13%]">
                        Balance Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagenationSupplier.length > 0 ? (
                      pagenationSupplier.map((tableData, index) => (
                        <tr
                          className="text-center bg-white border-b"
                          key={tableData.id}
                          onContextMenu={(e) => handleRightClick(e, tableData)}
                        >
                          <td className="p-2 text-sm text-wrap w-[5%]">{starterIndex + index + 1}</td>
                          {[
                            "supplierName",
                            "phoneNo",
                            "email",

                            "address",
                            "openingBalance",
                            "gstNumber",
                          ].map((field, idx) => (
                            <td
                              key={idx}
                              className={`p-2 text-sm ${field === "address"
                                  ? "break-words whitespace-normal w-[25%]"
                                  : ""
                                }`}
                            >
                              {editingSupplier === tableData.id ? (
                                <input
                                  className="text-center w-full px-2 py-1 focus:outline-none"
                                  type="text"
                                  value={editUpdateSupplier[field] || ""}
                                  onChange={(e) => handleInputChanges(e, field)}
                                  onKeyDown={handleKeyClick}
                                  ref={inputRef}
                                />
                              ) : (
                                tableData[field]
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="p-4 text-center text-sm text-[#202020]"
                        >
                          Your table is ready! Start adding data to see it here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/*---------------------- Context Dropdown (Right Click)------------------------ */}
            {contextDropdown && (
              <div
                className="absolute z-100 bg-white shadow-md border rounded"
                style={{ top: contextDropdown.y, left: contextDropdown.x }}
              >
                <ul>
                  <li className="px-6 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/viewpage")}>
                    View
                  </li>
                  <li
                    onClick={() => handleEditing(contextDropdown.tableData)}
                    className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Edit
                  </li>
                  <li
                    onClick={() => handleDelete(contextDropdown.tableData.id)}
                    className="px-6 py-2 hover:bg-gray-100 cursor-pointer "
                  >
                    Delete
                  </li>
                </ul>
              </div>
            )}

            {/* ----------------------------Success Message Model------------------------------ */}
            {showSuccessMessage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-96 max-w-3xl h-64 rounded-lg shadow-lg p-6 space-y-4 relative">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={successImage}
                      alt="Success Logo"
                      className="w-20 h-20"
                    />
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-black text-3xl font-bold">
                      Success!
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center px-6">
                    <p className="text-gray-500 text-base font-medium leading-6">
                      Supplier details have been updated successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* ------------------------Confirm Delete Model--------------------------- */}
            {deleteMessage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-96 max-w-3xl h-64 rounded-lg shadow-lg p-6 space-y-4 relative">


                  <div className="flex flex-col  text-[#E58448] items-center text-center">

                    <TriangleAlert size={54} />
                  </div>


                  <div className="flex flex-col  items-center text-center">
                    <span className="text-black text-base font-semibold font-[Plus Jakarta Sans]">
                      Are you sure you want to delete this product?
                    </span>
                  </div>

                  <div className="flex flex-col  items-center text-center">
                    <p className="text-gray-500 px-8 text-sm font-medium leading-6 font-[Plus Jakarta Sans]">
                      Deleting your order will remove all of your information from our database.
                    </p>
                  </div>

                  <div className="flex flex-cols-2 items-center justify-center text-center">
                    <button
                      onClick={() => setDeleteMessage(false)}
                      className="text-[#17BE78] flex items-center text-sm font-semibold px-4 py-2 rounded"
                    >
                      <X size={20} /> Close
                    </button>
                    <button
                      onClick={confirmDeleteData}
                      className="bg-[#E5484D] text-white text-sm font-semibold py-2 px-4 rounded"
                    >
                      Yes, Delete It
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
          {/* ------------------------Supplier from page -------------------------- */}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="bg-white p-6 fixed top-0 rounded-lg w-[800px] shadow-lg">
                <h2 className="text-[#202020] font-semibold text-center font-jakarta text-xl">
                  Add New Supplier
                </h2>
                <form
                  className="grid grid-cols-3 gap-6 my-6"
                  onSubmit={handleSubmit}
                >
                  <div className="relative flex gap-4">
                    <input
                      type="text"
                      id="supplierName"
                      name="supplierName"
                      className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                      placeholder=""
                      value={form.supplierName}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="supplierName"
                      className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                      Supplier Name *
                    </label>
                  </div>
                  <div className="relative flex gap-4">
                    <input
                      type="text"
                      id="phoneNo"
                      name="phoneNo"
                      className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                      placeholder=""
                      value={form.mobileNumber}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="phoneNo"
                      className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                      Mobile No
                    </label>
                  </div>
                  <div className="relative flex gap-4">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                      placeholder=""
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                      Email
                    </label>
                  </div>
                  <div className="relative flex gap-4">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                      placeholder=""
                      value={form.address}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="address"
                      className="absolute left-4 -top-3 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                      Address
                    </label>
                  </div>
                  <div className="relative flex gap-4">
                    <input
                      type="text"
                      id="Area"
                      name="Area"
                      className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                      placeholder=""
                      value={form.Area}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="Area"
                      className="absolute left-4 -top-3 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                      Area
                    </label>
                  </div>
                  <div className="relative flex gap-4">
                    <input
                      type="text"
                      id="pinCode"
                      name="pinCode"
                      className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                      placeholder=""
                      value={form.pinCode}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="pinCode"
                      className="absolute left-4 -top-3 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                      PinCode
                    </label>
                  </div>
                  <div className="relative ">
                    <select
                      id="State"
                      name="State"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="peer w-full h-11 px-2 text-sm border border-gray-300 focus:outline-none focus:border-[#593FA9] rounded bg-white"
                      required
                    >
                      <option value="" disabled>
                        Select state
                      </option>

                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Telangana">Telangana</option>
                    </select>
                    <label
                      htmlFor="state"
                      className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                      State
                    </label>
                    <span className="absolute right-4 top-2 text-gray-500 pointer-events-none"></span>
                  </div>
                  <div className="relative flex gap-4">
                    <input
                      type="text"
                      id="openingBalance"
                      name="openingBalance"
                      className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                      placeholder=""
                      value={form.balanceAmount}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="openingBalance"
                      className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                      Opening Balance
                    </label>
                  </div>
                  <div className="relative flex gap-4">
                    <input
                      type="text"
                      id="gstNumber"
                      name="gstNumber"
                      className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                      placeholder=""
                      value={form.balanceAmount}
                      onChange={handleChange}
                      required
                    />
                    <label
                      htmlFor="gstNumber"
                      className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                    >
                      GST Number
                    </label>
                  </div>
                  <div className=" flex gap-6 p-[390px] py-2">
                    <button
                      className="px-14 py-2 bg-[#fff] border border-t border-[#593fa9] font-jakarta font-semibold text-[#593fa9] rounded"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button className="px-16 py-2 text-[#fff] bg-[#593fa9] text-base font-semibold font-jakarta rounded">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
export default Supplier;
