import React, { useState, useEffect, useRef } from "react";
import { CustomerUpdate } from "../../../../apiService/customerAPI";
import { useSelector } from "react-redux";

const CustomerTable = ({
	Customers,
	editRowId,
	setEditRowId,
	editData,
	setEditData,
	editDropdown,
	setEditDropdown,
	inputRef,
	setLoading,
	setSuccessMsg,
	setCustomers,
	setFilteredCustomers,
	filteredCustomers,
  setTriggerApi,
  handleDelete
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
	const handleRightClick = (event, customer) => {
		event.preventDefault();
		const tableContainer = event.target
			.closest("table")
			.getBoundingClientRect();

		setEditDropdown({
			x: event.clientX - tableContainer.left,
			y: event.clientY - tableContainer.top,
			data: customer,
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
	const handleEditing = (customer, index) => {
		setEditRowId(customer.Customer_id);
		//   setEditRowId((prevState) => ({
		//     ...prevState,
		//     [customer?.Customer_id]: true // Update only the specific key
		// }));
		setEditData(customer);
		setEditDropdown(null);
		setTimeout(() => inputRef.current?.focus(), 0);
	};
	// -------------- function to input change:
	const handleInputChange = (e, field) => {
		setEditData({
			...editData,
			[field]: e.target.value,
		});
		setCustomers((prevCustomers) =>
			prevCustomers.map((customer) =>
				customer.Customer_id === editRowId
					? { ...customer, [field]: e.target.value }
					: customer
			)
		);
	};


	// -------------- function to handle saving the edit:
	const handleUpdate = (id) => {
		if (!editRowId) return;
		setLoading({ isLoading: true, message: "Updating customer..." });
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userDetails?.access_token}`,
			},
		};
		const payload = {
			User_id: editData?.User_id,
			customer_name: editData?.customer_name,
			mobile_no: editData?.Mobile_no,
			email: editData?.email,
			address: editData?.address,
			area: editData?.area,
			pincode: editData?.pincode,
			state: editData?.state,
			opening_balance: editData?.opening_balance,
			gst_number: editData?.GST_No,
		};
    setTriggerApi((prevState)=>({...prevState,getApi:false}))
		CustomerUpdate(
			editRowId,
			payload,
			config,
			(res) => {
				setSuccessMsg((prevState) => ({ ...prevState, update: true }));
        setTriggerApi((prevState)=>({...prevState,getApi:true}))
				setLoading({ isLoading: false, message: "" });
				setEditRowId(null);
			},
			(err) => {
				console.log(err);
				alert("Update failed");
				if (err?.response?.data?.message) {
					alert("Update failed");
				}
				setCustomers(filteredCustomers);
				setLoading({ isLoading: false, message: "" });
			}
		);
	};

	const handleKeyDown = (e, id) => {
		if (e.key === "Enter") {
			// setEditRowId((prevState) =>
			//   prevState.map((item) => {
			//       const key = Object.keys(item)[0]; // Get the key of the object
			//       return key === id ? { [id]: false } : item; // Update if it matches
			//   }))
			setEditRowId(null);
			handleUpdate();
		}
	};

	console.log("customertable data", Customers);

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
										Customer Name
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
									{/* <th className="p-2 text-center text-sm font-semibold w-[13%]">Balance Amount</th> */}
								</tr>
							</thead>
							<tbody>
								{Customers.length > 0 ? (
									Customers.map((customer, index) => (
										<tr
											key={customer.Customer_id}
											// onClick={() => handleEditing(customer,index)}
											onContextMenu={(e) => handleRightClick(e, customer)}
											className="text-center bg-white border-b cursor-pointer">
											<td className="p-2 text-sm w-[5%]">{index + 1}</td>

											{/* Customer Name */}
											<td className="p-2 text-sm w-[20%]">
												{editRowId === customer.Customer_id ? (
													<input
														ref={(el) =>
															(inputRefs.current[customer.Customer_id] = el)
														}
														className="text-center w-full px-2 py-1 focus:outline-none border border-gray-300"
														type="text"
														value={editData.customer_name || ""}
														onChange={(e) =>
															handleInputChange(e, "customer_name")
														}
														onKeyDown={(e) =>
															handleKeyDown(e, customer.Customer_id)
														}
													/>
												) : (
													customer.customer_name
												)}
											</td>

											{/* Mobile No */}
											<td className="p-2 text-sm w-[17%]">
												{editRowId === customer.Customer_id ? (
													<input
														className="text-center w-full px-2 py-1 focus:outline-none border border-gray-300"
														type="text"
														value={editData.Mobile_no || ""}
														onChange={(e) => handleInputChange(e, "Mobile_no")}
														onKeyDown={handleKeyDown}
													/>
												) : (
													customer.Mobile_no
												)}
											</td>

											{/* Email */}
											<td className="p-2 text-sm w-[20%]">
												{editRowId === customer.Customer_id ? (
													<input
														className="text-center w-full px-2 py-1 focus:outline-none border border-gray-300"
														type="text"
														value={editData.email || ""}
														onChange={(e) => handleInputChange(e, "email")}
														onKeyDown={handleKeyDown}
													/>
												) : (
													customer.email
												)}
											</td>

											{/* Address */}
											<td className="p-2 text-sm w-[15%]">
												{editRowId === customer.Customer_id ? (
													<input
														className="text-center w-full px-2 py-1 focus:outline-none border border-gray-300"
														type="text"
														value={editData.address || ""}
														onChange={(e) => handleInputChange(e, "address")}
														onKeyDown={handleKeyDown}
													/>
												) : (
													customer.address
												)}
											</td>

											{/* Opening Balance */}
											<td className="p-2 text-sm w-[10%]">
												{editRowId === customer.Customer_id ? (
													<input
														className="text-center w-full px-2 py-1 focus:outline-none border border-gray-300"
														type="text"
														id="opening_balance"
														name="opening_balance"
														value={editData.opening_balance || ""}
														onChange={(e) =>
															handleInputChange(e, "opening_balance")
														}
														onKeyDown={handleKeyDown}
													/>
												) : (
													customer.opening_balance.toLocaleString()
												)}
											</td>

											{/* Balance Amount */}
											{/* <td className="p-2 text-sm w-[13%]">
                      {editRowId[customer.Customer_id]? (
                        <input
                          className="text-center w-full px-2 py-1 focus:outline-none border border-gray-300"
                          type="text"
                          value={editData.balance_amount || ""}
                          onChange={(e) => handleInputChange(e, "balance_amount")}
                          onKeyDown={(e)=>handleKeyDown(e,customer.Customer_id)}
                        />
                      ) : (
                        customer.balance_amount !== null ? customer.balance_amount.toLocaleString() : "N/A"
                      )}
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
export default CustomerTable;
