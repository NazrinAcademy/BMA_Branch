import React from "react";
import { SupplierAdd, SupplierUpdate } from "../../../../apiService/supplierAPI";
import { ToastContainer, toast } from "react-toastify";

const SupplierModel = ({ showModal, setShowModal, form, setForm, setSuccessMsg, isEdit, setIsEdit }) => {
  if (!showModal) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.supplierName || !form.phoneNo || !form.email || !form.address || !form.openingBalance) {
      toast("Please fill all required fields");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`,
      },
    };

    const payload = {
      User_id: userDetails?.access_token,
      supplier_name: form.supplierName,
      mobile_no: form.phoneNo,
      email: form.email,
      address: form.address,
      area: form.Area,
      pincode: form.pinCode,
      state: selectedState,
      opening_balance: form.openingBalance,
      gst_number: form.gstNumber,
    };

    if (isEdit) {
      // Update API Call
      SupplierUpdate(
        form.id, // Edit panna vendiya supplier ID
        payload,
        config,
        (res) => {
          setSuccessMsg((prevState) => ({ ...prevState, update: true }));
          setForm({});
          setShowModal(false);
          setIsEdit(false);
        },
        (err) => {
          alert("Update Failed");
          console.log("Error Response:", err);
        }
      );
    } else {
      // Add API Call
      SupplierAdd(
        payload,
        config,
        (res) => {
          setSuccessMsg((prevState) => ({ ...prevState, create: true }));
          setForm({});
          setShowModal(false);
        },
        (err) => {
          alert("Add Failed");
          console.log("Error Response:", err);
        }
      );
    }
  };
 
  return (
    <div className="fixed inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center">
    <div className="bg-white p-6 fixed top-0 rounded-lg w-[800px] shadow-lg">
      <h2 className="text-[#202020] font-semibold text-center font-jakarta text-xl">
        {isEdit ? "Edit Supplier" : "Add New Supplier"}
      </h2>
              <form className="grid grid-cols-3 gap-6 my-6">
          <div className="relative flex gap-4">
            <input
              type="text"
              id="supplierName"
              value={form.supplierName} 
              onChange={handleChange}
              name="supplierName"
              className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
              placeholder=""
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
                    //   value={selectedState}
                    //   onChange={(e) => setSelectedState(e.target.value)}
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
                  
          {/* Add other input fields here */}

          {/* Buttons */}
          <div className="col-span-3 flex justify-end gap-6 p-4 py-2 w-full">
            <button
              type="button"
              className="px-14 py-2 bg-[#fff] border border-[#593fa9] font-jakarta font-semibold text-[#593fa9] rounded"
              onClick={() => {
                setShowModal(false);
                setIsEdit(false);
                setForm({});
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-16 py-2 text-[#fff] bg-[#593fa9] text-base font-semibold font-jakarta rounded"
              onClick={handleSubmit}
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default SupplierModel;
