import { useEffect, useState } from "react";
import { Search, ListFilter, ChevronLeft, FileText, TriangleAlert, X, Printer, ChevronRight, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { Link } from 'react-router-dom'
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import successImage from '../../assets/success.png'
import PurchaseReturnViewpage from "./PurchaseReturnViewpage";


const PurchaseReturnList = () => {
  const invoices = [
    {
      
        "supplier_name": "ABC Suppliers",
        "mobile_no": "9876543210",
        "email": "supplier@example.com",
        "address": "123 Street, City, State",
        "gst_no": "22AAAAA0000A1Z5",
        "return_no": "001",
        "invoice_date": "2025-03-05",
        "due_date": "2025-03-15",
        "invoice_type": "with tax",
        "products": [
            {
                "product_name": "Product A",
                "hsn_sac_code": "1001",
                "quantity": 10,
                "rate": 50.0,
                "discount": 5.0,
                "discount_price": 2.5,
                "cgst": 9.0,
                "cgst_price": 4.5,
                "sgst": 9.0,
                "sgst_price": 4.5,
                "total_amount": 500.0
            },
            {
                "product_name": "Product B",
                "hsn_sac_code": "1002",
                "quantity": 1,
                "rate": 100.0,
                "discount": 10.0,
                "discount_price": 5.0,
                "cgst": 9.0,
                "cgst_price": 9.0,
                "sgst": 9.0,
                "sgst_price": 9.0,
                "total_amount": 500.0
            }
        ],
        "total_amount": 1000.0,
        "received_amount": 500.0,
        "balance_amount": 500.0,
        "total_before_tax": 950.0,
        "cgst": 18.0,
        "sgst": 18.0,
        "discount": 15.0,
        "grand_total": 1000.0,
        "payment_type": "cash",
        "payment_status": "Received",
        "purchase_status": "Pending",
        "billing_address": "No. 20, Fish Market, Coimbatore",
        "shipping_address": "No. 22, Beach Road, Coimbatore",
        "notes": "Urgent order"
    }
  ]  

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);


  // ------------------------- filter function---------------------
  const [storeFilter, setStoreFilter] = useState("");
  const [mobileFilter, setMobileFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);


  // Toggle Filter Form
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };


  // Apply filters along with search
  const filteredInvoices = invoices.filter((invoice) => {
    return (
      (storeFilter === "" || invoice.store.toLowerCase().includes(storeFilter.toLowerCase())) &&
      (mobileFilter === "" || invoice.mobile.includes(mobileFilter)) &&
      (statusFilter === "" || invoice.status.toLowerCase() === statusFilter.toLowerCase()) &&
      Object.values(invoice).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  // Pagination Logic
  const startIndex = (currentPage - 1) * perPage;
  const totalPages = Math.ceil(filteredInvoices.length / perPage);

  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + perPage);
  // const [paginatedInvoices, setPaginatedInvoices] = useState(filteredInvoices.slice(startIndex, startIndex + perPage));



  // Handle Filter Save
  const handleSaveFilter = () => {
    setShowFilter(false);
  };

  // Handle Filter Reset
  const handleCancelFilter = () => {
    setStoreFilter("");
    setMobileFilter("");
    setStatusFilter("");
    setShowFilter(false);
  };

  // ----------------------- edit function-------------------------

  // State declarations
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [updatedInvoice, setUpdatedInvoice] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [showSuccessMessageUpdate, setShowSuccessMessageUpdate] = useState(false);


  // Edit mode enable function
  const handleEdit = (invoice) => {
    setEditingInvoice(invoice.id);
    setUpdatedInvoice({ ...invoice });
  };

  // Handle input change
  const handleInputChange = (e, field) => {
    setUpdatedInvoice({
      ...updatedInvoice,
      [field]: e.target.value,
    });
  };

  // Handle Enter key press to save
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setEditingInvoice(null);
      setShowSuccessMessageUpdate(true);
      // Show success message only after saving
      setTimeout(() => {
        setShowSuccessMessageUpdate(false);
      }, 2000);
    }
  };

  // Handle Context Menu (Right Click)
  const handleRightClick = (event, invoice) => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY, invoice });
  };


  // .--------------------- delete functions ------------------------
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);


  // Common Delete Function ----
  const handleDelete = (ids) => {
    setPaginatedInvoices((prevData) =>
      prevData.filter((invoice) => !ids.includes(invoice.id))
    );

    setCheckedInvoices([]);
  };


  // Delete Single Invoice (Right-Click) --
  const handleSingleDelete = (invoice) => {
    setSelectedRowId(invoice.id);
    setShowDeleteConfirm(true);
  };

  // Bulk Delete Checked Invoices -----------------------
  const handleBulkDelete = () => {
    if (checkedInvoices.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  // Confirm Delete -----------------------
  const confirmDelete = () => {
    if (selectedRowId) {
      handleDelete([selectedRowId]);
    } else if (checkedInvoices.length > 0) {
      handleDelete(checkedInvoices);
    }
    setShowDeleteConfirm(false);
    setSelectedRowId(null);
  };

  // --------------------------------- view functions ---------------------------
  const [showModal, setShowModal] = useState(false);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
  };
  // -------------------------------
  // Click outside context menu to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest(".context-menu")) {
        setContextMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);


  // ----------------- check out functions -----------------------
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedInvoices, setCheckedInvoices] = useState([]);

  const handleSelectAll = () => {
    const newCheckedStatus = !isAllChecked;
    setIsAllChecked(newCheckedStatus);
    setCheckedInvoices(newCheckedStatus ? paginatedInvoices.map(i => i.id) : []);
  };


  const handleRowCheckbox = (id) => {
    setCheckedInvoices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Check if all rows are selected
  useEffect(() => {
    if (paginatedInvoices.length > 0) {
      setIsAllChecked(checkedInvoices.length === paginatedInvoices.length);
    }
  }, [checkedInvoices, paginatedInvoices]);


  // Get Only Selected Invoices
  const selectedInvoices = invoices.filter((invoice) =>
    checkedInvoices.includes(invoice.id)
  );


  // Get the data to export (selected or all)
  const getExportData = () => {
    return checkedInvoices.length > 0 ? selectedInvoices : invoices;
  };

  // Handle Export to Excel
  const handleExportExcel = () => {
    const exportData = getExportData();
    if (exportData.length === 0) return alert("No invoices available to export!");

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    XLSX.writeFile(wb, "invoices.xlsx");
  };

  // Handle Export to PDF
  const handleExportPDF = () => {
    const exportData = getExportData();
    if (exportData.length === 0) return alert("No invoices available to export!");

    const doc = new jsPDF();
    doc.setFont("helvetica", "normal"); // Default font

    doc.text("Invoice List", 20, 10);

    const columns = ["Invoice No", "Date", "Status", "Store", "Mobile", "Amount", "Method"];
    const rows = exportData.map((invoice) => [
      invoice.id,
      invoice.date,
      invoice.invoice_status,
      invoice.store,
      invoice.mobile,
      `\u20B9 ${invoice.amount}`, // ✅ Correct way to display ₹ symbol
      invoice.method,
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save("invoices.pdf");
  };

  // Handle Print
  const handlePrint = () => {
    const exportData = getExportData();
    if (exportData.length === 0) return alert("No invoices available to print!");

    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write("<html><head><title>Print</title></head><body>");
    printWindow.document.write("<h2>Invoices</h2>");
    printWindow.document.write("<table border='1' style='width:100%; text-align:center;'>");
    printWindow.document.write("<tr><th>Invoice No</th><th>Date</th><th>Status</th><th>Billing From</th><th>Mobile</th><th>Amount</th><th>Method</th><th>Payment Status</th></tr>");

    exportData.forEach((invoice) => {
      printWindow.document.write(
        `<tr>
        <td>${invoice.id}</td>
        <td>${invoice.date}</td>
        <td>${invoice.invoice_status}</td>
        <td>${invoice.store}</td>
        <td>${invoice.mobile}</td>
        <td>${invoice.amount}</td>
        <td>${invoice.method}</td>
        <td>${invoice.status}</td>
      </tr>`
      );
    });

    printWindow.document.write("</table></body></html>");
    printWindow.document.close();
    printWindow.print();
  };


  return (
    <div className="bg-white h-full px-7 py-3 rounded shadow-md w-full max-w-full xl:max-w-7xl 2xl:max-w-screen-2xl font-['Plus Jakarta Sans'] mx-auto">
      <div className="flex justify-between items-center border-b text-nowrap py-4">
        <h2 className="text-xl font-semibold">Purchase Invoice List</h2>
        <div className="flex items-center gap-3">
          <button onClick={toggleFilter} className="flex items-center px-4 py-2 border rounded text-gray-700">
            Filter <ListFilter className="w-4 h-4 ml-2" />
          </button>
          {/* Search Input */}
          <div className="relative w-3/5">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#838383]" size={24} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 pl-10 w-full rounded focus:ring-1 focus:ring-[#838383] focus:outline-none"
            />
          </div>
          <Link to={"/dashboard/purchaseReturn"}
            className="bg-purpleCustom text-nowrap text-white px-4 py-2 text-base font-semibold rounded flex items-center gap-2">
            Purchase Invoice
          </Link>
        </div>
      </div>

      {/*------------------------------- Filter Form (Overlay) -------------------------------*/}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
          <div className="bg-white overflow-hidden rounded w-2/3 h-48 px-7 py-5">
            <h3 className="text-xl font-semibold text-left text-gray-700 mb-4">
              Filter
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <input
                  placeholder=""
                  value={storeFilter}
                  onChange={(e) => setStoreFilter(e.target.value)}
                  className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Billing To
                </label>
              </div>
              <div className="relative">
                <input
                  placeholder=""
                  value={invoices.mobile}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Mobile No
                </label>
              </div>
              <div className="relative">
                <input
                  placeholder=""
                  value={invoices.status}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Status
                </label>
              </div>

            </div>
            {/* Buttons aligned to the right */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCancelFilter}
                className=" border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFilter}
                className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}



      {/*----------------------------------------- Pagination Controls --------------------------------------------*/}

      <div className="my-4 flex flex-col sm:flex-row justify-between text-[#838383] items-center">
        <div className="flex items-center gap-2">
          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-1 rounded-lg text-purple-700"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-[#838383]">{currentPage}-{totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-1 rounded-lg text-purple-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Per Page Dropdown */}
          <div className="flex items-center text-[#838383] gap-3">
            <span>Per Page</span>
            <select
              className="border rounded p-1"
              value={perPage}
              onChange={(e) => {
                setPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-4 mt-4 sm:mt-0">
          {checkedInvoices.length > 0 && (
            <button className=" text-[#e5484d] p-2 rounded flex items-center justify-center"
              onClick={handleBulkDelete}>
              <Trash2 size={20} />
            </button>
          )}

          <button onClick={handleExportExcel} className="flex items-center gap-2 text-[#838383]">
            Export Excel <FileText size={18} />
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 text-[#838383]">
            Export PDF <FileText size={18} />
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 text-[#838383]">
            Print <Printer size={18} />
          </button>
        </div>
      </div>


      {/* ------------------------ table ------------------------ */}
      <div className="overflow-x-auto">
        <div className="max-h-[350px] overflow-y-auto rounded border border-[#c9c9cd]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#f8f8f8]">
              <tr className="text-sm font-semibold">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCheckedInvoices(invoices.map((inv) => inv.id));
                      } else {
                        setCheckedInvoices([]);
                      }
                    }}
                    checked={checkedInvoices.length > 0 && checkedInvoices.length === invoices.length}
                  />
                </th>
                {[
                  "Return No",
                  "Date",
                  "Return To",
                  "Total Amount",
                  "Payment Due",
                  "Payment Method",
                  "Payment Status",
                ].map((heading, index) => (
                  <th key={index} className="py-3 px-4 w-[12.5%]">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-t text-sm text-center cursor-pointer"
                    onContextMenu={(e) => handleRightClick(e, invoice)} // Right-click event
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={checkedInvoices.includes(invoice.id)}
                        onChange={() => handleRowCheckbox(invoice.id)}
                      />
                    </td>

                    {["return_no", "invoice_date", "supplier_name", "total_amount", "balance_amount", "payment_type"].map((key) => (
                      <td key={key} className="px-2 py-3 w-[12.5%]">
                        {editingInvoice === invoice.id ? (
                          <input
                            type="text"
                            value={updatedInvoice[key] || ""}
                            onChange={(e) => handleInputChange(e, key)}
                            onKeyPress={handleKeyPress} // Save on Enter
                            className="text-center w-full px-2 py-1 focus:outline-none"
                          />
                        
                        ) : (
                          invoice[key]
                        )}
                      </td>
                    ))}

                    {/* Payment Status Column */}
                    <td className="py-3 px-2 w-[12.5%]">
                      <span
                        className={`px-2 py-1 text-sm rounded ${invoice.payment_status === "Received"
                            ? "bg-[#d9ffef] text-[#17be78]"
                            : "bg-[#FFF7DF] text-[#FFC107]"
                          }`}
                      >
                        {invoice.payment_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-4 text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* ------------------------------------------ Context Menu -----------------------------------------------*/}
      {contextMenu && (
        <div
          className="absolute z-100 bg-white shadow-md border rounded"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ul>
            <li
              onClick={() => {
                handleViewInvoice(contextMenu.invoice);
              }} className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
            >
              View
            </li>

            <li
              onClick={() => handleEdit(contextMenu.invoice)}
              className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Edit
            </li>
            <li
              onClick={() => handleSingleDelete(contextMenu.invoice)}
              className="px-6 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Delete
            </li>
          </ul>
        </div>
      )}


      {/* --------------------------- update successfull message --------------------------------- */}

      {showSuccessMessageUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 max-w-3xl h-64 rounded-lg shadow-lg p-6 space-y-4 relative">
            <div className="flex flex-col items-center justify-center">
              <img src={successImage} alt="Success Logo" className="w-20 h-20" />
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-black text-3xl font-bold font-[Plus Jakarta Sans]">
                Success!
              </span>
            </div>
            <div className="flex flex-col items-center text-center px-6">
              <p className="text-gray-500 text-base font-medium leading-6 font-[Plus Jakarta Sans]">
                Your product details have been updated successfully!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------- Delete Confirmation --------------------------------------*/}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 max-w-3xl h-64 rounded-lg shadow-lg p-6 space-y-4 relative">

            {/* TriangleAlert Icon */}
            <div className="flex flex-col  text-[#E58448] items-center text-center">

              <TriangleAlert size={54} />
            </div>

            {/* Title */}
            <div className="flex flex-col  items-center text-center">
              <span className="text-black text-base font-semibold font-[Plus Jakarta Sans]">
                Are you sure you want to delete this product?
              </span>
            </div>

            {/* Description */}
            <div className="flex flex-col  items-center text-center">
              <p className="text-gray-500 px-8 text-sm font-medium leading-6 font-[Plus Jakarta Sans]">
                Deleting your order will remove all of your information from our database.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-cols-2 items-center justify-center text-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-[#17BE78] flex items-center text-sm font-semibold px-4 py-2 rounded"
              >
                <X size={20} /> Close
              </button>
              <button
                onClick={confirmDelete}
                className="bg-[#E5484D] text-white text-sm font-semibold py-2 px-4 rounded"
              >
                Yes, Delete It
              </button>
            </div>

          </div>
        </div>
      )}

      {showModal && (
        <PurchaseReturnViewpage
          selectedInvoice={selectedInvoice}
          closeModal={() => setShowModal(false)}
        />
      )}


    </div>


  );
}

export default PurchaseReturnList; 