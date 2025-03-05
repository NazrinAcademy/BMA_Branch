import { useRef, useState, useEffect, useCallback } from "react";
import {
	Search,
	FileText,
	Printer,
	Sheet,
	ChevronRight,
	ChevronLeft,
} from "lucide-react";
import { TriangleAlert, X } from "lucide-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import successImage from "../../../assets/success.png";
import { CustomerAdd, CustomerDelete, Customerget, CustomerUpdate } from "../../../apiService/customerAPI";
import { useSelector } from "react-redux";
import SuccessMessage from "../../SuccessMessage";
import CustomerTable from "./CustomerDetails/customerTable";

const Customer = () => {
	const allCustomers =[
	
					{
							"Customer_id": "67c719e9e2717a50276bb006",
							"User_id": "123",
							"customer_name": "John Doe",
							"Mobile_no": "9876543210",
							"email": "johndoe@example.com",
							"address": "123 Street",
							"area": "Downtown",
							"pincode": "560001",
							"state": "Karnataka",
							"opening_balance": 5000.0,
							"balance_amount": null,
							"GST_No": "GST12345"
					},
					{
							"Customer_id": "67c7228ae2717a50276bb008",
							"User_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMDk5NTgzLCJpYXQiOjE3NDEwOTkyODMsImp0aSI6ImUwNDQ0MGU3ZTRmZDRlMTE5ZjI4MGM4NDA5MDBhNzM3IiwidXNlcl9pZCI6IjY3YzMxZTdkZWE0MTQxMjZlNzRiOTE1NSJ9.bWWvhvRqPlkT4K4-HJWiHIbjf16P32l3YKxX3TsciPY",
							"customer_name": "prema",
							"Mobile_no": "09384191526",
							"email": "salvatore@gmail.com",
							"address": "yyyyy",
							"area": "kadayanllur",
							"pincode": "627751",
							"state": "Tamil Nadu",
							"opening_balance": 345555.0,
							"balance_amount": null,
							"GST_No": "12345678"
					},
					{
							"Customer_id": "67c72454e2717a50276bb00a",
							"User_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMDk5NTgzLCJpYXQiOjE3NDEwOTkyODMsImp0aSI6ImUwNDQ0MGU3ZTRmZDRlMTE5ZjI4MGM4NDA5MDBhNzM3IiwidXNlcl9pZCI6IjY3YzMxZTdkZWE0MTQxMjZlNzRiOTE1NSJ9.bWWvhvRqPlkT4K4-HJWiHIbjf16P32l3YKxX3TsciPY",
							"customer_name": "prema",
							"Mobile_no": "9567678712",
							"email": "prema@gmail.com",
							"address": "yyyyy",
							"area": "kadayanllur",
							"pincode": "627751",
							"state": "Tamil Nadu",
							"opening_balance": 345555.0,
							"balance_amount": null,
							"GST_No": "123456677"
					},
					{
							"Customer_id": "67c724d3e2717a50276bb00c",
							"User_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMDk5NTgzLCJpYXQiOjE3NDEwOTkyODMsImp0aSI6ImUwNDQ0MGU3ZTRmZDRlMTE5ZjI4MGM4NDA5MDBhNzM3IiwidXNlcl9pZCI6IjY3YzMxZTdkZWE0MTQxMjZlNzRiOTE1NSJ9.bWWvhvRqPlkT4K4-HJWiHIbjf16P32l3YKxX3TsciPY",
							"customer_name": "prema",
							"Mobile_no": "9567678712",
							"email": "nivetha@gmail.com",
							"address": "yyyyy",
							"area": "kadayanllur",
							"pincode": "627751",
							"state": "Tamil Nadu",
							"opening_balance": 345555.0,
							"balance_amount": null,
							"GST_No": "12345678"
					},
					{
							"Customer_id": "67c72912e2717a50276bb00e",
							"User_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMDk5NTgzLCJpYXQiOjE3NDEwOTkyODMsImp0aSI6ImUwNDQ0MGU3ZTRmZDRlMTE5ZjI4MGM4NDA5MDBhNzM3IiwidXNlcl9pZCI6IjY3YzMxZTdkZWE0MTQxMjZlNzRiOTE1NSJ9.bWWvhvRqPlkT4K4-HJWiHIbjf16P32l3YKxX3TsciPY",
							"customer_name": "prema",
							"Mobile_no": "9567678712",
							"email": "nive@gmail.com",
							"address": "yyyyy",
							"area": "kadayanllur",
							"pincode": "627751",
							"state": "Tamil Nadu",
							"opening_balance": 345555.0,
							"balance_amount": null,
							"GST_No": "12345678"
					},
					{
							"Customer_id": "67c72b51e2717a50276bb019",
							"User_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMDk5NTgzLCJpYXQiOjE3NDEwOTkyODMsImp0aSI6ImUwNDQ0MGU3ZTRmZDRlMTE5ZjI4MGM4NDA5MDBhNzM3IiwidXNlcl9pZCI6IjY3YzMxZTdkZWE0MTQxMjZlNzRiOTE1NSJ9.bWWvhvRqPlkT4K4-HJWiHIbjf16P32l3YKxX3TsciPY",
							"customer_name": "dheena",
							"Mobile_no": "9334567812",
							"email": "nila@gmail.com",
							"address": "yyyyyy",
							"area": "tenkasi",
							"pincode": "627751",
							"state": "Tamil Nadu",
							"opening_balance": 789045.0,
							"balance_amount": null,
							"GST_No": "12345678"
					},
					{
							"Customer_id": "67c72c37e2717a50276bb01b",
							"User_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMDk5NTgzLCJpYXQiOjE3NDEwOTkyODMsImp0aSI6ImUwNDQ0MGU3ZTRmZDRlMTE5ZjI4MGM4NDA5MDBhNzM3IiwidXNlcl9pZCI6IjY3YzMxZTdkZWE0MTQxMjZlNzRiOTE1NSJ9.bWWvhvRqPlkT4K4-HJWiHIbjf16P32l3YKxX3TsciPY",
							"customer_name": "dheena",
							"Mobile_no": "9334567812",
							"email": "jeeva@gmail.com",
							"address": "yyyyyy",
							"area": "tenkasi",
							"pincode": "627751",
							"state": "Tamil Nadu",
							"opening_balance": 789045.0,
							"balance_amount": null,
							"GST_No": "12345678"
					},
					{
							"Customer_id": "67c72e13e2717a50276bb01d",
							"User_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMDk5NTgzLCJpYXQiOjE3NDEwOTkyODMsImp0aSI6ImUwNDQ0MGU3ZTRmZDRlMTE5ZjI4MGM4NDA5MDBhNzM3IiwidXNlcl9pZCI6IjY3YzMxZTdkZWE0MTQxMjZlNzRiOTE1NSJ9.bWWvhvRqPlkT4K4-HJWiHIbjf16P32l3YKxX3TsciPY",
							"customer_name": "customer testing",
							"Mobile_no": "9797981234",
							"email": "dheena@gmail.com",
							"address": "yyyyyy",
							"area": "tenkasi",
							"pincode": "627751",
							"state": "Tamil Nadu",
							"opening_balance": 789045.0,
							"balance_amount": null,
							"GST_No": "12345678"
					},
					{
							"Customer_id": "67c86688588394c0aff54389",
							"User_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMTg2OTIwLCJpYXQiOjE3NDExODY2MjAsImp0aSI6ImVkZjU2OWI1MjkzZjQzNWJhZDA4ZGNjZjFiOGZkMzYyIiwidXNlcl9pZCI6IjY3YzMxZTdkZWE0MTQxMjZlNzRiOTE1NSJ9.Lc6e65QvcNB6lyh9Au9Gu2nQ38-ZbDDznvLAPmb6mXI",
							"customer_name": "customer 1",
							"Mobile_no": "9892345612",
							"email": "customer1@gmail.com",
							"address": "yyyyyy",
							"area": "tenkasi",
							"pincode": "627751",
							"state": "Tamil Nadu",
							"opening_balance": 789045.0,
							"balance_amount": null,
							"GST_No": "12345678"
					},
					{
							"Customer_id": "67c87805588394c0aff5438b",
							"User_id": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQxMTg2OTIwLCJpYXQiOjE3NDExODY2MjAsImp0aSI6ImVkZjU2OWI1MjkzZjQzNWJhZDA4ZGNjZjFiOGZkMzYyIiwidXNlcl9pZCI6IjY3YzMxZTdkZWE0MTQxMjZlNzRiOTE1NSJ9.Lc6e65QvcNB6lyh9Au9Gu2nQ38-ZbDDznvLAPmb6mXI",
							"customer_name": "prema",
							"Mobile_no": "9567678712",
							"email": "customer@gmail.com",
							"address": "yyyyy",
							"area": "kadayanllur",
							"pincode": "627751",
							"state": "Tamil Nadu",
							"opening_balance": 345555.0,
							"balance_amount": null,
							"GST_No": "12345678"
					}
	];
	const { userDetails } = useSelector((state) => state.auth);
	const [Customers, setCustomers] = useState(allCustomers);

	const [perPage, setPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQurey, setsearchQurey] = useState("");

	// -----------------------Edit,Delete,View Function--------------------------
	const [editDropdown, setEditDropdown] = useState(null);
	const [editingCustomer, setEditingCustomer] = useState(null);
	const [editUpdateCustomer, setUpdateCustomer] = useState({});
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [successMsg, setSuccessMsg] = useState({ create: "", update: "" })
	const [deleteMessage, setDeleteMessage] = useState(false);
	const [selectedRowId, setSelectedRowId] = useState(null);
	const [filteredCustomers, setFilteredCustomers] = useState([]);
	const inputRef = useRef(null);

	useEffect(() => {
		const handlePressOutside = (event) => {
			if (editDropdown && !event.target.closest(".context-dropdown")) {
				setEditDropdown(null);
			}
		};

		document.addEventListener("click", handlePressOutside);
		return () => {
			document.removeEventListener("click", handlePressOutside);
		};
	}, [editDropdown]);

	useEffect(() => {
		setTimeout(() => {
			setShowSuccessMessage(false);
			setSuccessMsg((prevState) => ({ ...prevState, create: false }))
		}, 2000);
	}, [showSuccessMessage, successMsg?.create]);

	const handleEditing = (tableData) => {
		setEditingCustomer(tableData.id);

		if (!tableData.address.includes(tableData.area)) {
			setUpdateCustomer({
				...tableData,
				address: `${tableData.area}, ${tableData.state}, ${tableData.pinCode}`,
			});
		} else {
			setUpdateCustomer(tableData);
		}
	};

	const handleInputChanges = (e, field) => {
		setUpdateCustomer({
			...editUpdateCustomer,
			[field]: e.target.value,
		});
	};

	// --------- update function:
	const handleUpdate = () => {
		if(!editingCustomer) return;

		const config = {
			headers : {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userDetails?.access_token}`,
			},
		};

		CustomerUpdate(
			{ id: editingCustomer, ...editUpdateCustomer},
			config,
			(res) => {
				setFilteredCustomers((prevCustomers) =>
					prevCustomers.map((customer) => 
					customer.id === editingCustomer ? { ...customer, ...editUpdateCustomer} : customer
					)
				);
				setEditingCustomer(null);
				setShowSuccessMessage(true);
				setTimeout(() => setShowSuccessMessage(false), 2000);
			},
			(err) => {
				console.log(err);
				alert("update failed");
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
		setEditDropdown({ x: event.pageX, y: event.pageY, tableData });
	};

	//----------- delete function:

	const handleDelete = (tableData) => {
		setSelectedRowId(tableData.id);
		setDeleteMessage(true);
		setEditDropdown(null);
	};

	const confirmDeleteData = () => {
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userDetails?.access_token}`,
			},
		}

		CustomerDelete(
			selectedRowId,
			config,
			(res) => {
				setFilteredCustomers((prevData) => 
					prevData.filter((item) => item.id !== selectedRowId)
				);
				setDeleteMessage(false);
			},
			(err) => {
				console.log(err);
				alert("Delete failed!")
			}
		);
	};

	// useEffect(() => {
	// 	const filteredData = Customers.filter(
	// 		(customer) =>
	// 			customer.customerName
	// 				.toLowerCase()
	// 				.includes(searchQurey.toLowerCase()) ||
	// 			customer.phoneNo.toString().includes(searchQurey) ||
	// 			customer.email.toLowerCase().includes(searchQurey.toLowerCase()) ||
	// 			customer.address.toLowerCase().includes(searchQurey.toLowerCase())
	// 	);
	// 	setFilteredCustomers(filteredData);
	// }, [searchQurey, Customers]);

	const totalPage = Math.ceil(filteredCustomers.length / perPage);
	const starterIndex = (currentPage - 1) * perPage;
	const pagenationCustomer = filteredCustomers.slice(
		starterIndex,
		starterIndex + perPage
	);

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
		Customers.forEach((Custom, index) => {
			doc.text(
				`${index + 1}-${Custom.supplierName} - PhoneNo: ${Custom.phoneNo
				} -Email: ${Supp.email}-Address ${Custom.address}-Area ${Custom.area
				}-PinCode${Supp.pinCode}-State${Custom.state}-OpeningBalance${Custom.openingBalance
				}-BalanceAmount${Custom.balanceAmount}`,
				15,
				y
			);
			y += 10;
		});
		doc.save("Customers.pdf");
	};

	const [selectedState, setSelectedState] = useState("");
	const [showModal, setShowModal] = useState(false);

	const [form, setform] = useState({
		customerName: "",
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

	const handleSubmit = (e) => {
		e.preventDefault();
		if (
			!form.customerName ||
			!form.phoneNo ||
			!form.email ||
			!form.address ||
			!form.openingBalance || !selectedState
		) {
			alert("Please fill all required fields");
		}
		else {
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userDetails?.access_token}`,
				},
			};
			const payload = {
				User_id: userDetails?.access_token,
				customer_name: form?.customerName,
				mobile_no: form?.phoneNo,
				email: form?.email,
				address: form?.address,
				area: form?.Area,
				pincode: form?.pinCode,
				state: selectedState,
				opening_balance: form?.openingBalance,
				gst_number: form?.gstNumber,
			};
			CustomerAdd(
				payload,
				config,
				(res) => {
					//   getHolidays();
					// alert("Created SuccessFully");
					setSuccessMsg((prevState) => ({ ...prevState, create: true }))
					setform({})
					getDetails()
					setShowModal(false);
				},
				(err) => {
					if (err?.response?.data?.error) {
						alert(err?.response?.data?.error);
						console.log(err);
					}
					else {
						alert("Failed ");
					}
				}
			);
		}
	};

	const getDetails = useCallback(() => {
		const config = {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${userDetails?.access_token}`,
			},
		};
		Customerget(
			config,
			(res) => {
				console.log("customer response",res?.data?.Customer)
				setCustomers(res?.data?.Customer)
				
			},
			(err) => {
				console.log(err)
			}
		);

	}, [userDetails?.access_token])

	// useEffect(()=>{
	// 	getDetails()
	// },[userDetails?.access_token])

	const handelPrint = () => {
		window.print();
	};

	const handleModalClose = () => {
		setShowModal(false)
		setform({})
		setSelectedState("")
	}

	useEffect(() => {
		setFilteredCustomers((prevCustomers) =>
			prevCustomers.map((customer) => ({
				...customer,
				address: `${customer.address}, ${customer.area}, ${customer.state}, ${customer.pinCode}`,
			}))
		);
	}, []);

	return (
		<div className="flex h-screen  bg-[#ffff] rounded-md">
			<div className="bg-[#ffff] p-5 rounded-lg w-full shadow ">
				<div className="flex justify-between items-center">
					<h1 className="text-xl font-semibold font-jakarta">Customer List</h1>
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
								onClick={() => setShowModal(true)}>
								Add Customer
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
									}`}>
								<ChevronLeft size={20} />
							</button>
							<span className="text-[#838383]">
								{currentPage}-{totalPage}
							</span>
							<button
								disabled={currentPage >= totalPage}
								onClick={() => setCurrentPage(currentPage + 1)}
								className={`px-1 rounded-lg ${currentPage >= totalPage ? "text-[#838383]" : "text-[#202020]"
									}`}>
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
								}}>
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="15">15</option>
							</select>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						<button
							className="flex gap-1 items-center space-x-1 font-medium text-sm font-jakarta text-[#838383]"
							onClick={handleExcel}>
							<span>Export Excel</span>
							<Sheet size={20} />
						</button>
						<button
							className="flex gap-1 items-center space-x-1 text-sm font-medium font-jakarta text-[#838383]"
							onClick={handlePDF}>
							<span>Export PDF</span>
							<FileText size={20} />
						</button>
						<button
							className="flex gap-2 items-center text-sm font-medium font-jakarta text-[#838383]"
							onClick={handelPrint}>
							<span>Print</span>
							<Printer size={20} />
						</button>
					</div>
				</div>
				{/* <div className="mt-5 rounded border border-[#c9c9cd]">
					<div className="max-h-[350px] overflow-y-auto">
						<table className="w-full">
							<thead className="sticky top-0 bg-[#f8f8f8]">
								<tr className="text-left">
									<th className="p-2 text-center text-sm font-semibold w-[5%]">
										S.No
									</th>
									<th className="p-2 text-center text-sm font-semibold w-[20%]">
										customerName
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
								{pagenationCustomer.length > 0 ? (
									pagenationCustomer.map((tableData, index) => (
										<tr
											className="text-center bg-white border-b"
											key={tableData.id}
											onContextMenu={(e) => handleRightClick(e, tableData)}>
											<td className="p-2 text-sm text-wrap w-[5%]">
												{index + 1}
											</td>
											{[
												"customerName",
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
														}`}>
													{editingCustomer === tableData.id ? (
														<input
															className="text-center w-full px-2 py-1 focus:outline-none"
															type="text"
															value={editUpdateCustomer[field] || ""}
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
											className="p-4 text-center text-sm text-[#202020]">
											Your table is ready! Start adding data to see it here.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/*---------------------- Context Dropdown (Right Click)------------------------ */}
					{editDropdown && (
						<div
							className="absolute z-100 bg-white shadow-md border rounded"
							style={{ top: editDropdown.y, left: editDropdown.x }}>
							<ul>
								<li className="px-6 py-2 hover:bg-gray-100 cursor-pointer">
									View
								</li>
								<li
									onClick={() => handleEditing(editDropdown.tableData)}
									className="px-6 py-2 hover:bg-gray-100 cursor-pointer">
									Edit
								</li>
								<li
									onClick={() => handleDelete(editDropdown.tableData.id)}
									className="px-6 py-2 hover:bg-gray-100 cursor-pointer ">
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
					<SuccessMessage onClose={handleModalClose} showMsg={successMsg?.create} />

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
										Deleting your order will remove all of your information from
										our database.
									</p>
								</div>

								<div className="flex flex-cols-2 items-center justify-center text-center">
									<button
										onClick={() => setDeleteMessage(false)}
										className="text-[#17BE78] flex items-center text-sm font-semibold px-4 py-2 rounded">
										<X size={20} /> Close
									</button>
									<button
										onClick={confirmDeleteData}
										className="bg-[#E5484D] text-white text-sm font-semibold py-2 px-4 rounded">
										Yes, Delete It
									</button>
								</div>
							</div>
						</div>
					)}
				{/* </div> */} 
				<CustomerTable Customers={Customers}/>

				{showModal && (
					<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
						<div className="bg-white p-6 fixed top-0 rounded-lg w-[800px] shadow-lg">
							<h2 className="text-[#202020] font-semibold text-center font-jakarta text-xl">
								Add New Customer
							</h2>
							<form
								className="grid grid-cols-3 gap-6 my-6"
								onSubmit={handleSubmit}>
								<div className="relative flex gap-4">
									<input
										type="text"
										id="customerName"
										name="customerName"
										className="peer w-64 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
										placeholder=""
										value={form.customerName}
										onChange={(e) => handleChange(e)}
										required
									/>
									<label
										htmlFor="supplierName"
										className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white">
										Customer Name *
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
										value={form.balanceAmount}
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
										value={form.balanceAmount}
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
				)}
			</div>
		</div>
	);
};
export default Customer;
