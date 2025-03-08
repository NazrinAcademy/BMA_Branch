import React from 'react'

const SupplierModal = ({
    form,
    setForm,
    handleSubmit,
    handleChange,
    setSelectedState,
    selectedState,
    handleModalClose,
    content
}
) => {
    console.log("content",content);
    console.log("form data", form);
    console.log("model clode:" ,handleModalClose);
    
    
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="bg-white p-6 fixed top-0 rounded-lg w-[800px] shadow-lg">
                    <h2 className="text-[#202020] font-semibold text-center font-jakarta text-xl">
                        {content}
                    </h2>
                    <form
                        className="grid grid-cols-3 gap-6 my-6"
                        onSubmit={(e)=>handleSubmit(e)}>
                        <div className="relative flex gap-4">
                            <input
                                type="text"
                                id="supplierName"
                                name="supplierName"
                                className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                                placeholder=""
                                value={form.supplierName}
                                onChange={(e) => handleChange(e)}
                                required
                            />
                            <label
                                htmlFor="supplierName"
                                className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
               peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
               peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
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
                                value={form.phoneNo}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="phoneNo"
                                className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
               peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
               peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
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
               peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
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
               peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
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
               peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
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
               peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
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
                                required>
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
               peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
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
                                value={form.openingBalance}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="openingBalance"
                                className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
               peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
               peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
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
                                value={form.gstNumber}
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="gstNumber"
                                className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
               peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
               peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
                                GST Number
                            </label>
                        </div>
                        <div className=" flex gap-6 p-[390px] py-2">
                            <button
                                className="px-14 py-2 bg-[#fff] border border-t border-[#593fa9] font-jakarta font-semibold text-[#593fa9] rounded"
                                onClick={handleModalClose}>
                                Cancel
                            </button>
                            <button className="px-16 py-2 text-[#fff] bg-[#593fa9] text-base font-semibold font-jakarta rounded">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SupplierModal