import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const SupplierTable = ({
	Suppliers,
	editRowId,
	setEditRowId,
	editData,
	setEditData,
	editDropdown,
	setEditDropdown,
	inputRef,
	setLoading,
	setSuccessMsg,
	setSuppliers,
	setFilteredSuppliers,
	filteredSuppliers,
	setTriggerApi,
	handleDelete,
	setForm,
	setShowModal,
	setSelectedState,
	isShowModal,
	setIsShowModal
}) => {
	const menuRef = useRef(null);
	const inputRefs = useRef({});

	const { userDetails } = useSelector((state) => state.auth);

	useEffect(() => {
		if (editRowId && inputRefs.current[editRowId]) {
			inputRefs.current[editRowId].focus();
		}
	}, [editRowId]);

	// ----------- function to right click menu:
	const handleRightClick = (event, supplier) => {
		event.preventDefault();
		const tableContainer = event.target
			.closest("table")
			.getBoundingClientRect();

		setEditDropdown({
			x: event.clientX - tableContainer.left,
			y: event.clientY - tableContainer.top,
			data: supplier,
		});
	};

	// ------------ function to detect clicking outside:
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setEditDropdown(null);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// ------------- function to edit mode:
	const handleEditing = (supplier, index) => {
		setEditRowId(supplier.Supplier_id);
		//   setEditRowId((prevState) => ({
		//     ...prevState,
		//     [supplier?.Supplier_id]: true // Update only the specific key
		// }));
		setIsShowModal((prevState) => ({...prevState, edit:true}))
		console.log("Supplier State---", supplier?.state);
		setShowModal(true)
		setForm({
			supplierName:supplier?.supplier_name,
			phoneNo: supplier?.mobile_no,
			email: supplier?.email,
			address:supplier?.address,
			Area: supplier?.area,
			pinCode: supplier?.pincode,
			State: supplier?.state,
			openingBalance: supplier?.opening_balance,
			gstNumber: supplier?.gst_number,
		})
		setSelectedState(supplier?.state)
		setEditData(supplier);
		setEditDropdown(null);
		setTimeout(() => inputRef.current?.focus(), 0);
	};
	// -------------- function to input change:
	const handleInputChange = (e, field) => {
		setEditData({
			...editData,
			[field]: e.target.value,
		});
		setSuppliers((prevSuppliers) =>
			prevSuppliers.map((supplier) =>
				supplier.Supplier_id === editRowId
					? { ...supplier, [field]: e.target.value }
					: supplier
			)
		);
	};


	// -------------- function to handle saving the edit:

	// const handleKeyDown = (e, id) => {
	// 	if (e.key === "Enter") {
	// 		// setEditRowId((prevState) =>
	// 		//   prevState.map((item) => {
	// 		//       const key = Object.keys(item)[0]; // Get the key of the object
	// 		//       return key === id ? { [id]: false } : item; // Update if it matches
	// 		//   }))
	// 		setEditRowId(null);
	// 		handleUpdate();
	// 	}
	// };

	console.log("supplierTable data", Suppliers);

	return (
		<>
			<div className="relative">
				<div className="mt-5 rounded border border-[#c9c9cd]">
					<div className="max-h-[350px] overflow-y-auto">
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
									{/* <th className="p-2 text-center text-sm font-semibold w-[13%]">
										Balance Amount
									</th> */}
								</tr>
							</thead>
							<tbody>
								{Suppliers.length > 0 ? (
									Suppliers.map((supplier, index) => (
										<tr
											key={supplier.Supplier_id}
											onContextMenu={(e) => handleRightClick(e, supplier)}
											className="text-center bg-white border-b cursor-pointer">
											<td className="p-2 text-sm w-[5%]">{index + 1}</td>

											{/* Supplier Name */}
											<td className="p-2 text-sm w-[20%]">{supplier.supplier_name}</td>

											{/* Mobile No */}
											<td className="p-2 text-sm w-[17%]">{supplier.mobile_no
											}</td>

											{/* Email */}
											<td className="p-2 text-sm w-[20%]">{supplier.email}</td>

											{/* Address */}
											<td className="p-2 text-sm w-[15%]">{supplier.address}</td>

											{/* Opening Balance */}
											<td className="p-2 text-sm w-[10%]">{supplier.opening_balance.toLocaleString()}</td>

											{/* Balance Amount */}
											{/* <td className="p-2 text-sm w-[13%]">
                        							supplier.balance_amount !== null ? supplier.balance_amount.toLocaleString() : "N/A"
                    						</td> */}
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan="7"
											className="p-4 text-center text-sm text-[#202020]">
											Your table is ready! Start adding data to see it here.
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
						className="absolute z-50 bg-white shadow-md border rounded"
						style={{
							top: editDropdown.y,
							left: editDropdown.x,
						}}>
						<ul>
							<li className="px-6 py-2 hover:bg-gray-100 cursor-pointer">
								View
							</li>
							<li
								onClick={() => handleEditing(editDropdown.data)}
								className="px-6 py-2 hover:bg-gray-100 cursor-pointer">
								Edit
							</li>
							<li
								onClick={() => handleDelete(editDropdown.data)}
								className="px-6 py-2 hover:bg-gray-100 cursor-pointer">
								Delete
							</li>
						</ul>
					</div>
				)}
			</div>


		</>
	);
};

export default React.memo(SupplierTable)
