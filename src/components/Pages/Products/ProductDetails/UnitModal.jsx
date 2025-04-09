import { ChevronDown } from 'lucide-react'
import React from 'react'

const UnitModal = ({
    handleSaveUnit,
    handleUpdate,
    unitName,
    setUnitName,
    unitFullName,
    setUnitFullName,
    allowDecimal,
    setAllowDecimal,
    handleModalClose,
    newUnitRef,
    newFullNameRef
}) => {

    console.log("Editing unit:", unitName);

    return (
        <>
            <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
                <div className="bg-white overflow-hidden rounded-lg w-[692px] h-72 px-7 py-6">
                    <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">Add New Unit</h3>
                    <form onSubmit={handleSaveUnit} className="grid grid-cols-2 gap-4">
                        {/* Unit Input */}
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

                        {/* Unit Full Name */}
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

                        {/* Allow Decimal */}
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

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={handleModalClose} className="border border-purpleCustom font-semibold px-12 py-2 rounded">
                                Cancel
                            </button>
                            <button className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UnitModal