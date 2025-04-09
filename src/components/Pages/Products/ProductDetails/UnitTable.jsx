import React from 'react'

const UnitTable = ({
    units,
    contextMenu,
    handleDelete,
    handleEdit,
    setUnits,
    setContextMenu
}) => {

    const handleContextMenu = (event, unit) => {
        event.preventDefault();
        setContextMenu({
          x: event.pageX,
          y: event.pageY,
          product: unit,  // Make sure 'unit' is not undefined
        });
    
      };
    
    return (
        <>
            {/* Units Table */}
            <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
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
                                    <td className="px-6 py-4">{ index + 1}</td>

                                    {/* Unit Column */}
                                    <td className="px-6 py-4">  { unit.unit}</td>

                                    {/* Unit Full Name Column */}
                                    <td className="px-6 py-4"> {unit.fullname} </td>

                                    {/* Allow Decimal Column (No Dropdown) */}
                                    <td className="px-6 py-4"> { unit.allowDecimal ? "Yes" : "No"} </td>
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
            </div>
            {contextMenu?.product && (
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
            )}
    </>
    )
}

export default UnitTable