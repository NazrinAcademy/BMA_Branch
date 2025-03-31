import React, { useState } from "react";
import { X, Printer } from "lucide-react";
// import PrintInvoice from "./PrintInvoice";

const QuotationViewModal = ({ selectedInvoice, closeModal }) => {
  const [showPrintView, setShowPrintView] = useState(false);

  if (!selectedInvoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {showPrintView ? (
        <PrintInvoice invoiceData={selectedInvoice} closePrint={() => setShowPrintView(false)} />
      ) : (
        <div className="bg-white w-[90%] max-w-5xl rounded shadow-lg p-3 relative">
          {/* Modal Header */}
          <div className="border-b p-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Quotation Detail (Invoice No: {selectedInvoice.invoice_no})
            </h2>
            <button
              onClick={closeModal}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {/* Invoice Details */}
              <div>
                <h3 className="text-lg font-semibold">Invoice Details</h3>
                <div className="flex flex-col gap-2 text-base font-normal mt-2">
                  <p><span className="text-[#838383]">Invoice No:</span> {selectedInvoice.invoice_no}</p>
                  <p><span className="text-[#838383]">Invoice Date:</span> {selectedInvoice.invoice_date}</p>
                  <p><span className="text-[#838383]">Due Date:</span> {selectedInvoice.due_date}</p>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="text-lg font-semibold">Customer Details</h3>
                <div className="flex flex-col gap-2 text-base font-normal mt-2">
                  <p><span className="text-[#838383]">Name:</span> {selectedInvoice.billing_to}</p>
                  <p><span className="text-[#838383]">Mobile No:</span> {selectedInvoice.mobile_no}</p>
                  <p><span className="text-[#838383]">GST No:</span> {selectedInvoice.gst_no}</p>
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h3 className="text-lg font-semibold">Billing Address</h3>
                <div className="flex flex-col text-wrap w-44 gap-2 text-base font-normal mt-2">
                  <p className="text-[#838383]">{selectedInvoice.billing_address}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <div className="flex flex-col gap-2 text-wrap w-44 text-base font-normal mt-2">
                  <p className="text-[#838383]">{selectedInvoice.shipping_address}</p>
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div className="p-2">
              <table className="w-full border-collapse border text-center">
                <thead>
                  <tr className="bg-[#f7f7f7] text-sm font-semibold">
                    <th rowSpan="2" className="p-1 border w-48">Product</th>
                    <th rowSpan="2" className="p-1 border w-24">HSN Code</th>
                    <th rowSpan="2" className="p-1 border w-24">Qty</th>
                    <th rowSpan="2" className="p-1 border w-24">Rate (₹)</th>
                    <th colSpan="2" className="p-1 border">Discount</th>
                    <th colSpan="2" className="p-1 border">CGST</th>
                    <th colSpan="2" className="p-1 border">SGST</th>
                    <th rowSpan="2" className="p-1 border w-22">Total Amount (₹)</th>
                  </tr>
                  <tr className="bg-[#f7f7f7] text-sm font-semibold">
                    <th className="p-1 border">%</th>
                    <th className="p-1 border">₹</th>
                    <th className="p-1 border">%</th>
                    <th className="p-1 border">₹</th>
                    <th className="p-1 border">%</th>
                    <th className="p-1 border">₹</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2 border">{selectedInvoice.product_name}</td>
                    <td className="p-2 border">{selectedInvoice.hsn_sac_code}</td>
                    <td className="p-2 border">{selectedInvoice.qty}</td>
                    <td className="p-2 border">{selectedInvoice.rate}</td>
                    <td className="p-2 border">{selectedInvoice.discount_percentage}</td>
                    <td className="p-2 border">{selectedInvoice.discount_value}</td>
                    <td className="p-2 border">{selectedInvoice.cgst_percentage}</td>
                    <td className="p-2 border">{selectedInvoice.cgst_value}</td>
                    <td className="p-2 border">{selectedInvoice.sgst_percentage}</td>
                    <td className="p-2 border">{selectedInvoice.sgst_value}</td>
                    <td className="p-2 border">{selectedInvoice.total_amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center text-sm pt-4">
              <div>
                <select className="border rounded p-2">
                  <option>{selectedInvoice.payment_method}</option>
                </select>
                <select className="border rounded p-2">
                  <option>{selectedInvoice.payment_method}</option>
                </select>
                <select className="border rounded p-2">
                  <option>{selectedInvoice.status}</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 text-base text-center font-normal mt-2">
                <p><span className="text-[#838383]">Total Amount:</span> {selectedInvoice.amount}</p>
                <p><span className="text-[#838383]">Received:</span> {selectedInvoice.received}</p>
                <p><span className="text-[#838383]">Balance:</span> {selectedInvoice.balance}</p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 flex items-right justify-end">
            <button
              className="bg-purpleCustom text-white px-8 py-2 text-base font-semibold rounded flex items-center space-x-2"
              onClick={() => setShowPrintView(true)}
            >
              <Printer size={18} />
              <span>Print</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationViewModal;
