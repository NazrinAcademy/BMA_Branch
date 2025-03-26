import React, { useState } from 'react'
import { X, Printer } from "lucide-react";

const PurchaseViewpage = ({ selectedInvoice, closeModal }) => {
     const [showPrintView, setShowPrintView] = useState(false);
     if (!selectedInvoice) return null;

    return (
        <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    {showPrintView ? (
        <PrintInvoice invoiceData={selectedInvoice} closePrint={() => setShowPrintView(false)} />
      ) : (
                        <div className="bg-white w-[90%] max-w-5xl rounded shadow-lg p-3 relative">
                            {/* Modal Header */}
                            <div className="border-b p-2 flex justify-between items-center">
                                <h2 className="text-lg font-semibold">
                                    Sale Detail (Invoice No: {selectedInvoice.id})
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
                                    {/* invoice Details (Middle) */}
                                    <div>
                                        <h3 className="text-lg font-semibold">Invoice Details</h3>
                                        <div className="flex flex-col gap-2 text-base font-normal mt-2">
                                            <p><span className="text-[#838383]">Invoice No:</span> {selectedInvoice.id}</p>
                                            <p><span className="text-[#838383]">Invoice Date:</span>{selectedInvoice.date}</p>
                                            <p><span className="text-[#838383]">Due Date:</span>{selectedInvoice.due_date}</p>
                                        </div>
                                    </div>

                                    {/* Custemer Details (Middle) */}
                                    <div>
                                        <h3 className="text-lg font-semibold">Customer Details</h3>
                                        <div className="flex flex-col gap-2 text-base font-normal mt-2">
                                            <p><span className="text-[#838383]">Name :</span> {selectedInvoice.store}</p>
                                            <p><span className="text-[#838383]">Mobile No:</span>{selectedInvoice.mobile}</p>
                                            <p><span className="text-[#838383]">GST No:</span>{selectedInvoice.gst_no}</p>
                                        </div>
                                    </div>
                                    {/* invoice Details (Middle) */}
                                    <div>
                                        <h3 className="text-lg font-semibold">Billing Address</h3>
                                        <div className="flex flex-col gap-2 text-base font-normal mt-2">
                                            <p className="text-[#838383]">{selectedInvoice.billing_address}</p>
                                        </div>
                                    </div>
                                    {/* invoice Details (Middle) */}
                                    <div>
                                        <h3 className="text-lg font-semibold">Shipping Address </h3>
                                        <div className="flex flex-col gap-2 text-base font-normal mt-2">
                                            <p className="text-[#838383]"> {selectedInvoice.shipping_address}</p>
                                        </div>
                                    </div>
                                </div>



                                {/* Invoice Table */}
                                <table className="w-full border text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2">Product</th>
                                            <th className="p-2">Qty</th>
                                            <th className="p-2">Rate</th>
                                            <th className="p-2">Discount</th>
                                            <th className="p-2">CGST</th>
                                            <th className="p-2">SGST</th>
                                            <th className="p-2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="p-2">{selectedInvoice.product}</td>
                                            <td className="p-2">{selectedInvoice.qty}</td>
                                            <td className="p-2">{selectedInvoice.rate}</td>
                                            <td className="p-2">{selectedInvoice.discount}</td>
                                            <td className="p-2">{selectedInvoice.cgst}</td>
                                            <td className="p-2">{selectedInvoice.sgst}</td>
                                            <td className="p-2">{selectedInvoice.total}</td>
                                        </tr>
                                    </tbody>
                                </table>


                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-center text-sm border-t pt-4">
                                    <div>
                                        <div className="flex flex-col gap-2 text-base font-normal mt-2">

                                            <select className="border rounded p-2">
                                                <option>{selectedInvoice.method}</option>
                                            </select>
                                            <select className="border rounded p-2">
                                                <option>{selectedInvoice.method}</option>
                                            </select>
                                            <select className="border rounded p-2">
                                                <option>{selectedInvoice.status}</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* Custemer Details (Middle) */}
                                    <div>
                                        <div className="flex flex-col gap-2 text-base font-normal mt-2">
                                            <p><span className="text-[#838383]">Total Amount :</span> {selectedInvoice.amount}</p>
                                            <p><span className="text-[#838383]">Received:</span>{selectedInvoice.received}</p>
                                            <p><span className="text-[#838383]">Balance:</span>{selectedInvoice.balance}</p>
                                        </div>
                                    </div>
                                    {/* Custemer Details (Middle) */}
                                    <div>
                                        <div className="flex flex-col gap-2 text-base font-normal mt-2">
                                            <p><span className="text-[#838383]">Total Amount Before Tax :</span> {selectedInvoice.total_amount_before_tax}</p>
                                            <p><span className="text-[#838383]">CGST:</span>{selectedInvoice.total_cgst}</p>
                                            <p><span className="text-[#838383]">SGST:</span>{selectedInvoice.total_sgst}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className=" p-4 flex items-right justify-end">

                                <button className="bg-purpleCustom text-white px-8 py-2 text-base font-semibold rounded flex items-center space-x-2">
                                    <span>Print</span>
                                </button>
                            </div>
                        </div>
                         )}
                    </div>
       
        </>
    )
}

export default PurchaseViewpage