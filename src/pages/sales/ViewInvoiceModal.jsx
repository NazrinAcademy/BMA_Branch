import React, { useState } from "react";
import { X, Printer, ChevronDown } from "lucide-react";
import PrintInvoice from "../../components/common/PrintInvoice";

const ViewInvoiceModal = ({ selectedInvoice, closeModal }) => {
  const [showPrintView, setShowPrintView] = useState(false);

  if (!selectedInvoice) return null;

  return (
    <>
   <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
                {showPrintView ? (
                    <PrintInvoice 
                        invoiceData={selectedInvoice}
                        invoiceType="sale"
                        content={"Sale Invoice"}
                        closePrint={() => setShowPrintView(false)} />
                ) : (
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[500px] overflow-y-auto">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b p-4">
                            <h2 className="text-neutral-800 text-xl font-semibold font-jakarta">
                                Sale Detail (Invoice No : {selectedInvoice.invoice_no})
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 space-y-6 text-gray-700 text-sm">
                            {/* Top Section - Invoice, Supplier, Address */}
                            <div className="grid grid-cols-4 gap-2">
                                {/* Invoice Details */}
                                <div>
                                    <h3 className=" text-neutral-800 text-lg font-semibold font-jakarta">
                                        Invoice Details
                                    </h3>
                                    <p className="text-zinc-500 text-base font-normal font-jakarta">
                                        Invoice No :{" "}
                                        <span className=" text-neutral-800 text-base font-normal font-jakarta">
                                            {selectedInvoice.invoice_no}
                                        </span>
                                    </p>
                                    <p className="text-zinc-500 text-base font-normal font-jakarta">
                                        Invoice Date :{" "}
                                        <span className=" text-neutral-800 text-base font-normal font-jakarta">
                                            {selectedInvoice.invoice_date}
                                        </span>
                                    </p>
                                    <p className="text-zinc-500 text-base font-normal font-jakarta">
                                        Due Date :{" "}
                                        <span className=" text-neutral-800 text-base font-normal font-jakarta">
                                            {selectedInvoice.due_date}
                                        </span>
                                    </p>
                                </div>

                                {/* Supplier Details */}
                                <div>
                                    <h3 className="text-neutral-800 text-lg font-semibold font-jakarta">
                                        Customer Details
                                    </h3>
                                    <p className="text-zinc-500 text-base font-normal font-jakarta">
                                        Name :{" "}
                                        <span className=" text-neutral-800 text-base font-normal font-jakarta">
                                            {selectedInvoice.customer_name}
                                        </span>
                                    </p>
                                    <p className="text-zinc-500 text-base font-normal font-jakarta">
                                        Mobile No :{" "}
                                        <span className=" text-neutral-800 text-base font-normal font-jakarta">
                                            {selectedInvoice.mobile_no}
                                        </span>
                                    </p>
                                    <p className="text-zinc-500 text-base font-normal font-jakarta">
                                        GST No :{" "}
                                        <span className=" text-neutral-800 text-base font-normal font-jakarta">
                                            {selectedInvoice.gst_no}
                                        </span>
                                    </p>
                                </div>

                                {/* Supplier Address + Dropdowns */}
                                <div>
                                    <h3 className="text-neutral-800 text-lg font-semibold font-jakarta">
                                        Billing Address
                                    </h3>
                                    <p className=" text-neutral-800 text-base font-normal font-jakarta">
                                        {selectedInvoice.billing_address}
                                    </p>
                                  
                                </div>
  {/* Supplier Address + Dropdowns */}
  <div>
                                    <h3 className="text-neutral-800 text-lg font-semibold font-jakarta">
                                        Shipping Address
                                    </h3>
                                    <p className=" text-neutral-800 text-base font-normal font-jakarta">
                                        {selectedInvoice.shipping_address}
                                    </p>
                                  
                                </div>
                               
                               
                            </div>

                            {/* Product Table */}
                            <div className="border rounded-md overflow-hidden">
                                <table className="w-full border-collapse border text-center ">
                                    <thead>
                                        <tr className="bg-[#f7f7f7] text-sm font-semibold">
                                            <th rowSpan="2" className="p-1 border w-48 text-neutral-800 text-sm font-semibold font-jakarta">
                                                Product
                                            </th>
                                            <th rowSpan="2" className="p-1 border w-24 text-neutral-800 text-sm font-semibold font-jakarta">
                                                HSN/SAC Code
                                            </th>
                                            <th rowSpan="2" className="p-1 border w-24 text-neutral-800 text-sm font-semibold font-jakarta">
                                                Qty
                                            </th>
                                            <th rowSpan="2" className="p-1 border w-24 text-neutral-800 text-sm font-semibold font-jakarta">
                                                Rate (₹)
                                            </th>
                                            <th colSpan="2" className="p-1 border font-jakarta text-neutral-800 text-sm font-semibold">
                                                Discount
                                            </th>
                                            <th colSpan="2" className="p-1 border text-neutral-800 text-sm font-semibold font-jakarta">
                                                CGST
                                            </th>
                                            <th colSpan="2" className="p-1 border text-neutral-800 text-sm font-semibold font-jakarta">
                                                SGST
                                            </th>
                                            <th rowSpan="2" className="p-1 border w-22 text-neutral-800 text-sm font-semibold font-jakarta">
                                                Total Amount
                                            </th>
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
                                    {selectedInvoice.products?.map((product, index) => (
    <tr key={index} className="border border-gray-300">
                                          
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                    {product.product_name}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.hsn_sac_code}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.quantity}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.rate}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.discount}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.discount_price}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.cgst}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.cgst_price}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.sgst}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.sgst_price}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                                                {product.total_amount}
                                                </td>
                                            </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-right text-neutral-800 text-sm font-normal font-jakarta">
  No of items: {selectedInvoice.products?.length || 0}
</div>
                            {/* Payment Type and Status */}
                            <div className="px-20 rounded-md flex justify-between">
                                {/* Payment Details */}
                                <div className="flex flex-col gap-4">
                                    
                                    {/* Invoice Type */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={selectedInvoice.invoice_type}
                                            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
                                            placeholder=" "
                                        />
                                        <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                                           Invoice Type
                                        </label>

                                    </div>
                                    {/* Payment Type */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
                                            placeholder=" "
                                            value={selectedInvoice.payment_type}
                                        />
                                        <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                                            Payment Type
                                        </label>


                                    </div>

                                    {/* Payment Status */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={selectedInvoice.payment_status}
                                            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
                                            placeholder=" "
                                        />
                                        <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                                            Payment Status
                                        </label>

                                    </div>
                                </div>

                                <div className="py-2 text-neutral-800 text-base font-normal font-jakarta">
                                    <p>Total Amount : ₹{selectedInvoice.total_amount}</p>
                                    <p> Received : ₹{selectedInvoice.balance_amount}</p>
                                    <p>Balance : ₹{selectedInvoice.balance_amount}</p>
                                </div>

                                <div className="py-2 text-neutral-800 text-base font-normal font-jakarta">
                                    <p>Total Amount Before Tax : ₹{selectedInvoice.total_before_tax}</p>
                                    <p>CGST : ₹{selectedInvoice.cgst_total}</p>
                                    <p>SGST : ₹{selectedInvoice.sgst_total}</p>
                                    <p>Discount : ₹{selectedInvoice.discount_total}</p>
                                    <p>Grand Total : ₹{selectedInvoice.grand_total}</p>
                                </div>
                            </div>

                            {/* Print Button */}
                            <div className="flex justify-end">
                                <button className="px-11 py-2 text-white text-base font-semibold bg-violet-800 font-jakarta rounded-md"
                                 onClick={() => setShowPrintView(true)}>
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </>
  );
};

export default ViewInvoiceModal;
