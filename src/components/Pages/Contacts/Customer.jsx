import { useState } from "react";
import {
  Search,
  FileText,
  Printer,
  Sheet,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { IndianRupee } from "lucide-react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

const Customer = () => {
  const allCustomers = [
    {
      id: 1,
      customerName: "Niyas",
      phoneNo: 7695822683,
      email: "niyas@gmail.com",
      address: "South Main Road,",
      Area: "Tenkasi",
      State: "Tamilnadu-",
      pinCode: 627811,
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 2,
      customerName: "Mohamed",
      phoneNo: 9695822683,
      email: "mohamed@gmail.com",
      address: "New Main Road,",
      Area: "Madurai",
      State: "Tamilnadu-",
      pinCode: 52312,
      openingBalance: 30000,
      gstNumber: 1000,
    },
    {
      id: 3,
      customerName: "Ismail",
      phoneNo: 7995822683,
      email: "ismai@gmaill.com",
      address: "North Road,",
      Area: "Theni",
      State: "Tamilnadu-",
      pinCode: 58112,
      openingBalance: 40000,
      gstNumber: 2000,
    },
    {
      id: 4,
      customerName: "Raja",
      phoneNo: 8895822683,
      email: "raja@gmail.com",
      address: "New Temple Road,",
      Area: "vallem",
      State: "Tamilnadu-",
      pinCode: 627814,
      openingBalance: 9000,
      gstNumber: 3000,
    },
    {
      id: 5,
      customerName: "joe",
      phoneNo: 7195822681,
      email: "joe@gmail.com",
      address: "Bazar Road,",
      Area: "Kanyakumari",
      State: "Tamilnadu-",
      pinCode: 50812,
      openingBalance: 80000,
      gstNumber: 4000,
    },
    {
      id: 6,
      customerName: "Maddy",
      phoneNo: 8695822688,
      email: "maddy@gmail.com",
      address: "Colony Road,",
      Area: "kadayanallur",
      State: "Tamilnadu-",
      pinCode: 627815,
      openingBalance: 70000,
      gstNumber: 5000,
    },
    {
      id: 7,
      customerName: "Ram",
      phoneNo: 7611822684,
      email: "ram@gmail.com",
      address: "Bustant  Road,",
      Area: "madurai",
      State: "Tamilnadu-",
      pinCode: 57622,
      openingBalance: 60000,
      gstNumber: 6000,
    },
    {
      id: 8,
      customerName: "Vincy",
      phoneNo: 7695822685,
      email: "vinc@gmail.com",
      address: "New Road,",
      Area: "nellai",
      State: "Tamilnadu-",
      pinCode: 626821,
      openingBalance: 90000,
      gstNumber: 7000,
    },
    {
      id: 9,
      customerName: "Kalai",
      phoneNo: 6595822685,
      email: "kalai@gmail.com",
      address: "South Main Road,",
      Area: "Tenkasi",
      State: "Tamilnadu-",
      pinCode: 627811,
      openingBalance: 110000,
      gstNumber: 9000,
    },
    {
      id: 10,
      customerName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      address: "South Main Road,",
      Area: "Tenkasi",
      State: "Tamilnadu-",
      pinCode: 627811,
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 11,
      customerName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      address: "South Main Road,",
      Area: "Tenkasi",
      State: "Tamilnadu-",
      pinCode: 627811,
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 12,
      customerName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      address: "South Main Road,",
      Area: "Tenkasi",
      State: "Tamilnadu-",
      pinCode: 627811,
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 13,
      customerName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      address: "South Main Road,",
      Area: "Tenkasi",
      State: "Tamilnadu-",
      pinCode: 627811,
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 14,
      customerName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      address: "South Main Road,",
      Area: "Tenkasi",
      State: "Tamilnadu-",
      pinCode: 627811,
      openingBalance: 20000,
      gstNumber: 5000,
    },
    {
      id: 15,
      customerName: "niyas",
      phoneNo: 7695822683,
      email: "niyas@g.com",
      address: "South Main Road,",
      Area: "Tenkasi",
      State: "Tamilnadu-",
      pinCode: 627811,
      openingBalance: 20000,
      gstNumber: 5000,
    },
  ];

  const [Customers, setCustomers] = useState(allCustomers);

  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQurey, setsearchQurey] = useState("");

  const filteredCustomers = Customers.filter(
    (customer) =>
      customer.customerName.toLowerCase().includes(searchQurey.toLowerCase()) ||
      customer.phoneNo.toString().includes(searchQurey) ||
      customer.email.toLowerCase().includes(searchQurey.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQurey.toLowerCase())
  );

  const totalPage = Math.ceil(filteredCustomers.length / perPage);
  const starterIndex = (currentPage - 1) * perPage;
  const pagenationSuppliers = filteredCustomers.slice(
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
        `${index + 1}-${Custom.supplierName} - PhoneNo: ${Custom.phoneNo} -Email: ${
          Supp.email
        }-Address ${Custom.address}-Area ${Custom.Area}-PinCode${
          Supp.pinCode
        }-State${Custom.State}-OpeningBalance${
          Custom.openingBalance
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
      !form.customerName ||
      !form.phoneNo ||
      !form.email ||
      !form.address ||
      !form.State ||
      !form.openingBalance
    ) {
      alert("Please fill all required fields");
    }

    setShowModal(false);
  };
  const handelPrint = () => {
    window.print();
  };

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
                onClick={() => setShowModal(true)}
              >
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
                className={`px-1 rounded-lg ${
                  currentPage === 1 ? "text-[#838383]" : "text-[#202020]"
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
                className={`px-1 rounded-lg ${
                  currentPage >= totalPage ? "text-[#838383]" : "text-[#202020]"
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
            <table className="w-full">
              <thead className="sticky top-0 bg-[#f8f8f8]">
                <tr className="text-left">
                  <th className="p-2 text-[#202020] text-center text-sm font-jakarta font-semibold">
                    S.No
                  </th>
                  <th className="p-2 text-[#202020] text-center text-sm font-jakarta font-semibold">
                    Customer Name
                  </th>
                  <th className="p-2 text-[#202020] text-center text-sm font-jakarta font-semibold">
                    Mobile No
                  </th>
                  <th className="p-2 text-[#202020] text-center text-sm font-jakarta font-semibold">
                    Email
                  </th>
                  <th className="p-2 text-[#202020] text-center text-sm font-jakarta font-semibold">
                    Address
                  </th>
                  <th className="p-2 text-[#202020] text-center text-sm font-jakarta font-semibold">
                    Opening <br />
                    Balance
                  </th>
                  <th className="p-2 text-[#202020] text-center text-sm font-jakarta font-semibold">
                    Balance <br />
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagenationSuppliers.length > 0 ? (
                  pagenationSuppliers.map((tableData, index) => (
                    <tr className="text-center bg-white border-b" key={index}>
                      <td className="p-2 text-sm font-jakarta font-normal">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="p-2 text-sm font-jakarta font-normal">
                        {tableData.customerName}
                      </td>
                      <td className="p-2 text-sm font-jakarta font-normal">
                        {tableData.phoneNo}
                      </td>
                      <td className="p-2 text-sm font-jakarta font-normal">
                        {tableData.email}
                      </td>
                      <td className="p-2 text-sm font-jakarta font-normal">
                        {tableData.address}
                        <span>
                          {tableData.Area}
                          <br />
                          <span>{tableData.State}</span>{" "}
                          <span>{tableData.pinCode}</span>
                        </span>
                      </td>
                      <td className="p-2 text-sm font-jakarta font-normal">
                        <div className="flex justify-center items-center gap-1 text-[#202020]">
                          <IndianRupee size={13} />
                          {tableData.openingBalance}
                        </div>
                      </td>
                      <td className="p-2 text-sm font-jakarta font-normal">
                        <div className="flex justify-center items-center gap-1 text-[#202020]">
                          <IndianRupee size={13} />
                          {tableData.gstNumber}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="p-4 text-center text-sm font-jakarta font-normal text-[#202020]"
                    >
                      Your table is ready! Start adding data to see it here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-6 fixed top-0 rounded-lg w-[800px] shadow-lg">
              <h2 className="text-[#202020] font-semibold text-center font-jakarta text-xl">
                Add New Customer
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
                    value={form.customerName}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="supplierName"
                    className="absolute left-4 -top-2 text-xs text-[#202020] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                  >
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
  );
};
export default Customer;
