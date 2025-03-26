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

} from "lucide-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import successImage from '../../../assets/success.png'
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { SupplierAdd, SupplierDelete, Supplierget, SupplierUpdate } from "../../../api/supplierAPI";
import SuccessMessage from "../../../components/common/SuccessMessage";
import SupplierTable from "./SupplierTable";
import SupplierModal from "./SupplierModal";

const Supplier = () => {
  const allSuppliers = [
    {
      "supplier_id": 1,
      "user_id":"252",
      "supplier_name": "Niyas",
      "mobile_no": 7695822683,
      "email": "niyas@gmail.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 20000,
      "balance_amount":null,
      "gst_number": 5000,
    },
    {
      "supplier_id": 2,
      "user_id":"324",
      "supplier_name": "Mohamed",
      "mobile_no": 9695822683,
      "email": "mohamed@gmail.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 30000,
      "balance_amount":null,
      "gst_number": 1000,
    },
    {
      "supplier_id": 3,
      "user_id":"222",
      "supplier_name": "Ismail",
      "mobile_no": 7995822683,
      "email": "ismai@gmaill.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 40000,
      "balance_amount":null,
      "gst_number": 2000,
    },
    {
      "supplier_id": 4,
      "user_id":"021",
      "supplier_name": "Raja",
      "mobile_no": 8895822683,
      "email": "raja@gmail.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 9000,
      "balance_amount":null,
      "gst_number": 3000,
    },
    {
      "supplier_id": 5,
      "user_id":"192",
      "supplier_name": "joe",
      "mobile_no": 7195822681,
      "email": "joe@gmail.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 80000,
      "balance_amount":null,
      "gst_number": 4000,
    },
    {
      "supplier_id": 6,
      "user_id":"718",
      "supplier_name": "Maddy",
      "mobile_no": 8695822688,
      "email": "maddy@gmail.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 70000,
      "balance_amount":null,
      "gst_number": 5000,
    },
    {
      "supplier_id": 7,
      "user_id":"161",
      "supplier_name": "Ram",
      "mobile_no": 7611822684,
      "email": "ram@gmail.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 60000,
      "balance_amount":null,
      "gst_number": 6000,
    },
    {
      "supplier_id": 8,
      "user_id":"415",
      "supplier_name": "Vincy",
      "mobile_no": 7695822685,
      "email": "vinc@gmail.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 90000,
      "balance_amount":null,
      "gst_number": 7000,
    },
    {
      "supplier_id": 9,
      "user_id":"131",
      "supplier_name": "Kalai",
      "mobile_no": 6595822685,
      "email": "kalai@gmail.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 110000,
      "balance_amount":null,
      "gst_number": 9000,
    },
    {
      "supplier_id": 10,
      "user_id":"112",
      "supplier_name": "niyas",
      "mobile_no": 7695822683,
      "email": "niyas@g.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 20000,
      "balance_amount":null,
      "gst_number": 5000,
    },
    {
      "supplier_id": 11,
      "user_id":"101",
      "supplier_name": "niyas",
      "mobile_no": 7695822683,
      "email": "niyas@g.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 20000,
      "balance_amount":null,
      "gst_number": 5000,
    },
    {
      "supplier_id": 12,
      "user_id":"789",
      "supplier_name": "niyas",
      "mobile_no": 7695822683,
      "email": "niyas@g.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 20000,
      "balance_amount":null,
      "gst_number": 5000,
    },
    {
      "supplier_id": 13,
      "user_id":"456",
      "supplier_name": "niyas",
      "mobile_no": 7695822683,
      "email": "niyas@g.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 20000,
      "balance_amount":null,
      "gst_number": 5000,
    },
    {
      "supplier_id": 14,
      "user_id":"123",
      "supplier_name": "niyas",
      "mobile_no": 7695822683,
      "email": "niyas@g.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "pincode": 627811,
      "opening_balance": 20000,
      "balance_amount":null,
      "gst_number": 5000,
    },
    {
      "supplier_id": 15,
      "user_id":"124",
      "supplier_name": "niyas",
      "mobile_no": 7695822683,
      "email": "niyas@g.com",
      "area": "Tenkasi",
      "pincode": "627814",
      "state": "TamilNadu",
      "address": "South Main Road",
      "opening_balance": 20000,
      "balance_amount":null,
      "gst_number": 5000,
    },
  ];

  const { userDetails } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState({ isLoading: false, message: "" });

  const [Suppliers, setSuppliers] = useState(allSuppliers);
  const [triggerApi, setTriggerApi] = useState({getApi:false})

  // -------------------Pagenation state Function----------------------------z
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  //  -------------------Edit, Delete,View function------------------
  const [contextDropdown, setContextDropdown] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [editUpdateSupplier, setUpdateSupplier] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [filteredSuppliers, setFilteredSuppliers] = useState(Suppliers); 
  const inputRef = useRef(null);
  
  const [successMsg, setSuccessMsg] = useState({ create: "", update: "" })
    const [editRowId, setEditRowId] = useState({});
    const [isShowModal,setIsShowModal]=useState({edit:false})
    const [editData, setEditData] = useState({})
const [editDropdown, setEditDropdown] = useState(null);

const [selectedItem, setSelectedItem] = useState(null);



  useEffect(() => {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMsg((prevState) => ({...prevState, create:false, update:false}))
      }, 2000);
    
  }, [showSuccessMessage, successMsg?.create, successMsg?.update]);


  // ----------------- delete functions ------------------
  const handleDelete = (tableData) => {
    setSelectedRowId(tableData.supplier_id);
    setDeleteMessage(true);
    setEditDropdown(null);
    };

    
    const confirmDeleteData = () => {
      if (!selectedRowId) return;
    
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
            prevData.filter((item) => item.supplier_id !== selectedRowId)
          );
    
          
          setSuppliers((prevData) =>
            prevData.filter((item) => item.supplier_id !== selectedRowId)
          );
    
          setDeleteMessage(false);
          setSelectedRowId(null); 
        },
        (err) => {
          console.log(err);
          alert("Delete failed!");
        }
      );
    };

//-------------- pagenation function------------
   const [searchQuery, setSearchQuery] = useState("");
   const totalPage = Math.ceil(filteredSuppliers.length / perPage);
   const starterIndex = (currentPage - 1) * perPage;
   const pagenationSuppliers = filteredSuppliers.slice(
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
        `${index + 1}-${Supp.supplier_name} - PhoneNo: ${Supp.phoneNo} -Email: ${Supp.email
        }-Address ${Supp.address}-Area ${Supp.area}-PinCode${Supp.pincode
        }-State${Supp.state}-OpeningBalance${Supp.opening_balance
        }-BalanceAmount${Supp.balance_amount}`,
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
    console.log("onchange---", e.target.name, e.target.value);
    setform({ ...form, [e.target.name]: e.target.value });
  };
// -------------------post function----------------
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
        user_id: userDetails?.access_token,
        supplier_name: form?.supplierName,
        mobile_no: form?.phoneNo,
        email: form?.email,
        address: form?.address,
        area: form?.Area,
        pincode: form?.pinCode,  
        state: selectedState,
        opening_balance: form?.openingBalance,
        gst_number: form?.gstNumber,
      };
      
      SupplierAdd(
        payload,
        config,
        (res) => {
          setSuccessMsg((prevState) => ({ ...prevState, create: true }));
          setform({});
          getDetails();
          setShowModal(false);
        },
        (err) => {
          console.log("Error Response:", err.response);
          if (err?.response?.data) {
            alert(JSON.stringify(err.response.data)); // Show full error response
          } else {
            alert("Request failed");
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
        console.log("Full Supplier Response:", res?.data);
        console.log("Supplier Data:", res?.data?.Supplier);
    
        if (res?.data?.Supplier) {
          console.log("Setting Suppliers with data:", res?.data?.Supplier);
          setSuppliers(res?.data?.Supplier); 
          setFilteredSuppliers(res?.data?.Supplier); 
        } else {
          console.log("No Supplier data received!");
        }
    
        setEditRowId(
          res?.data?.Supplier.reduce((acc, el) => {
            acc[el?.supplier_id] = false;
            return acc;
          }, {})
        );
    
        setLoading({ isLoading: false, message: "" });
      },
      (err) => {
        console.log("API Error:", err);
        setLoading({ isLoading: false, message: "Failed to fetch data" });
      }
    );
      

  }, [userDetails?.access_token])
  console.log("edit row", editRowId);
  

  useEffect(() => {
    getDetails();
  }, [userDetails?.access_token, triggerApi?.getApi]);



  const handleModalClose = () => {
    setShowModal(false)
    setform({})
    setIsShowModal((prevState) => ({...prevState, edit:false}))
    setSelectedState("")
  }
console.log("editRowId--",editData)

  // ----- update function:

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Supplier ID (before API call):", editData?.supplier_id);

    console.log("Edit Data Before Update:", editData);
console.log("Supplier ID:", editData?.supplier_id); 

if (!editData?.supplier_id) {
    alert("Error: Supplier ID is missing!");
    return;
}



    if (!selectedState) {
        alert("Please select a state before updating.");
        return;
    }

    console.log("Updating Supplier ID:", editData?.supplier_id);
    
    setLoading({ isLoading: true, message: "Updating supplier..." });

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userDetails?.access_token}`,
        },
    };

const payload = {
    user_id: userDetails?.access_token,
    supplier_name: form?.supplierName,
    mobile_no: form?.phoneNo,
    email: form?.email,
    address: form?.address,
    area: form?.Area,
    pincode: form?.pinCode,
    state: selectedState,
    opening_balance: form?.openingBalance,
    gst_number: form?.gstNumber,
    balance_amount: form?.balanceAmount || 0
};

    console.log("Payload Data being sent:", payload);

    SupplierUpdate(
      editData?.supplier_id,  
      payload,  
      config,
        (res) => {
            console.log("Update Successful:", res);
            handleModalClose();
            setSuccessMsg((prevState) => ({ ...prevState, update: true }));
            setTriggerApi((prevState) => ({ ...prevState, getApi: true }));
            setLoading({ isLoading: false, message: "" });
            setEditRowId(null);
        }, 
        (err) => {
            console.error("Update Failed:", err?.response?.data || err);
            alert("Update failed! " + (err?.response?.data?.message || "Unknown error"));
            setLoading({ isLoading: false, message: "" });
        }
    );
};

useEffect(() => {
  getDetails();
}, [triggerApi?.getApi]);

  return (
    <>
      <div className="flex h-full bg-[#ffff] rounded-md">
        <div className="bg-[#ffff] p-5 rounded-lg w-full shadow ">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold font-jakarta">Supplier List</h1>
            <div className="flex items-center space-x-2">
              <div className="relative flex gap-6 ">
                <Search className="absolute font-medium left-3 top-1/2 transform -translate-y-1/2 text-[#838383] font-jakarta text-sm" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 text-sm  font-medium  pr-4 py-[8px] font-jakarta border border-[#838383] rounded-md focus:ring-1 focus:ring-[#838383] focus:outline-none"
                />

                <div
                  className="bg-[#593fa9] text-white cursor-pointer  px-4 py-2 text-base font-semibold rounded flex items-center gap-2"
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
                  onClick={() => setCurrentPage(currentPage -1)}
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

                      {console.log("successMsg",successMsg)}
                      {successMsg?.create &&
                      <SuccessMessage onClose={handleModalClose} showMsg={successMsg?.create} content={"Supplier details have been created successfully!"}/>
                      }
                            {successMsg?.update &&
                      <SuccessMessage onClose={handleModalClose} showMsg={successMsg?.update} content={"Supplier details have been Updated successfully!"}/>
                      }
            

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

          {/* </div> */}
          <SupplierTable
					Suppliers={Suppliers}
          starterIndex={starterIndex}
          pagenationSuppliers={pagenationSuppliers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
					editRowId={editRowId}
					setEditRowId={setEditRowId}
					editData={editData}
					setEditData={setEditData}
					editDropdown={editDropdown}
					setEditDropdown={setEditDropdown}
					inputRef={inputRef}
					setLoading={setLoading}
					setSuccessMsg={setSuccessMsg}
					setSuppliers={setSuppliers}
					filteredSuppliers={filteredSuppliers}
					setFilteredSuppliers={setFilteredSuppliers}
					setTriggerApi={setTriggerApi}
					handleDelete={handleDelete}
					setForm={setform}
					form={form}
					setShowModal={setShowModal}
					setSelectedState={setSelectedState}
					handleModalClose={handleModalClose}
					isShowModal={isShowModal}
					setIsShowModal={setIsShowModal}
				
				 />

				{showModal && (
					
					<SupplierModal
					form={form}
					handleSubmit={handleSubmit}
					handleChange={handleChange}
					setSelectedState={setSelectedState}
					handleModalClose={handleModalClose}
					content={"Add Supplier"}
					setForm={setform}
					selectedState={selectedState}
				
					/>
				)}
				{
					isShowModal?.edit &&(
						<SupplierModal
						form={form}
						handleSubmit={handleUpdate}
						handleChange={handleChange}
						setSelectedState={setSelectedState}
						handleModalClose={handleModalClose}
						content={"Edit Supplier"}
						setForm={setform}
						selectedState={selectedState}
					
						/>
					)
				}
          </div>
      </div>
      <ToastContainer />
    </>
  );
};
export default Supplier;
