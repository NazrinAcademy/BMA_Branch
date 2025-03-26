import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SupplierTable = ({
	Suppliers,
	setFilteredSuppliers,
	handleDelete,
	setForm,
	setEditRowId,
	setEditDropdown,
	editRowId,
	filteredSuppliers,
	editDropdown,
	setShowModal,
	setSelectedState,
	setIsShowModal,
	searchQuery,
	starterIndex,
	pagenationSuppliers,
}) => {
	const menuRef = useRef(null);
	const inputRefs = useRef({});
	const navigate = useNavigate();

;

	// Focus on input when editing
	useEffect(() => {
		if (inputRefs.current[editRowId]) {
			inputRefs.current[editRowId].focus();
		}
	}, [editRowId]);

	// Search Function
	useEffect(() => {
		const filteredData = Suppliers.filter((supplier) =>
			[supplier.supplier_name, supplier.mobile_no, supplier.email, supplier.address]
				.some((field) => field?.toLowerCase().includes(searchQuery.toLowerCase()))
		);
		setFilteredSuppliers(filteredData);
	}, [searchQuery, Suppliers]);

	// Handle right-click menu
	const handleRightClick = (event, supplier) => {
		event.preventDefault();
	
		// Get viewport dimensions
		const { clientX: x, clientY: y } = event;
	
		setEditDropdown({
			x,
			y,
			data: supplier,
		});
	};
	
	// Close context menu on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setEditDropdown(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle View button click
	const handleView = () => {
		navigate("/dashboard/viewPage");
	};

	// Handle Edit button click
	const handleEditing = (supplier) => {
		setEditRowId(supplier.supplier_id); // Ensure correct key name
		setIsShowModal((prevState) => ({ ...prevState, edit: true }));
		setShowModal(true);
		setForm({
			supplierName: supplier.supplier_name,
			phoneNo: supplier.mobile_no,
			email: supplier.email,
			address: supplier.address,
			Area: supplier.area,
			pinCode: supplier.pincode,
			State: supplier.state,
			openingBalance: supplier.opening_balance,
			gstNumber: supplier.gst_number,
		});
		setSelectedState(supplier.state);
		setEditDropdown(null);
	};

	console.log("supplierTable data", Suppliers);

	return (
		<>
			
				<div className="mt-5 rounded border border-[#c9c9cd]">
					<div className="max-h-[350px] overflow-y-auto">
						<table className="w-full">
							<thead className="sticky top-0 bg-[#f8f8f8]">
								<tr className="text-left">
									<th className="p-2 text-center text-sm font-semibold w-[5%]">S.No</th>
									<th className="p-2 text-center text-sm font-semibold w-[20%]">Supplier Name</th>
									<th className="p-2 text-center text-sm font-semibold w-[17%]">Mobile No</th>
									<th className="p-2 text-center text-sm font-semibold w-[20%]">Email</th>
									<th className="p-2 text-center text-sm font-semibold w-[15%]">Address</th>
									<th className="p-2 text-center text-sm font-semibold w-[10%]">Opening Balance</th>
								</tr>
							</thead>
							<tbody>
								{pagenationSuppliers.length > 0 ? (
								pagenationSuppliers.map((supplier, index) => (
										<tr
											key={supplier.supplier_id}
											onContextMenu={(e) => handleRightClick(e, supplier)}
											className="text-center bg-white border-b cursor-pointer">
											<td className="p-2 text-sm w-[5%]">  {starterIndex + index +1}</td>
											<td className="p-2 text-sm w-[20%]">{supplier.supplier_name}</td>
											<td className="p-2 text-sm w-[17%]">{supplier.mobile_no}</td>
											<td className="p-2 text-sm w-[20%]">{supplier.email}</td>
											<td className="p-2 text-sm w-[15%]">{supplier.address}</td>
											<td className="p-2 text-sm w-[10%]">{supplier.opening_balance?.toLocaleString()}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="6" className="p-4 text-center text-sm text-[#202020]">
											No suppliers found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Context Menu */}
				{editDropdown && (
    <div
        ref={menuRef}
        className="absolute bg-white shadow-lg border rounded-lg "
        style={{
            top: `${editDropdown.y}px`,
            left: `${editDropdown.x}px`,
            zIndex: 1000,
        }}
    >
        <button className="block w-full text-left px-6 py-2 hover:bg-gray-100" onClick={handleView}>
            View
        </button>
        <button
            className="block w-full text-left px-6 py-2 hover:bg-gray-100"
            onClick={() => handleEditing(editDropdown.data)}
        >
            Edit
        </button>
        <button className="block w-full text-left px-6 py-2 hover:bg-gray-100" onClick={() => handleDelete(editDropdown.data)}>
            Delete
        </button>
    </div>
)}
			
		</>
	);
};

export default React.memo(SupplierTable);
