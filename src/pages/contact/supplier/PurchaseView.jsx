import React from "react";
import { ChevronDown } from "lucide-react";

const SupplierPurchase = ({ onClose }) => {
  const items = [
    {
      product: "Dell D30 Mouse",
      hsn: "7645",
      qty: "5 Pcs",
      rate: 2000,
      discountPercent: 0,
      discountAmount: 0,
      cgstPercent: 9,
      cgstAmount: 250,
      sgstPercent: 9,
      sgstAmount: 250,
      total: 2500,
    },
    {
      product: "HP12 Cable",
      hsn: "4568",
      qty: "10 Pcs",
      rate: 1000,
      discountPercent: 0,
      discountAmount: 0,
      cgstPercent: 9,
      cgstAmount: 250,
      sgstPercent: 9,
      sgstAmount: 250,
      total: 1500,
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[500px] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-neutral-800 text-xl font-semibold font-jakarta">
            Purchase Detail (Invoice No : 010)
          </h2>
          <button
            onClick={onClose}
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
                  010
                </span>
              </p>
              <p className="text-zinc-500 text-base font-normal font-jakarta">
                Invoice Date :{" "}
                <span className=" text-neutral-800 text-base font-normal font-jakarta">
                  11/02/2025
                </span>
              </p>
              <p className="text-zinc-500 text-base font-normal font-jakarta">
                Due Date :{" "}
                <span className=" text-neutral-800 text-base font-normal font-jakarta">
                  14/02/2025
                </span>
              </p>
            </div>

            {/* Supplier Details */}
            <div>
              <h3 className="text-neutral-800 text-lg font-semibold font-jakarta">
                Supplier Details
              </h3>
              <p className="text-zinc-500 text-base font-normal font-jakarta">
                Name :{" "}
                <span className=" text-neutral-800 text-base font-normal font-jakarta">
                  Zupee Electronic
                </span>
              </p>
              <p className="text-zinc-500 text-base font-normal font-jakarta">
                Mobile No :{" "}
                <span className=" text-neutral-800 text-base font-normal font-jakarta">
                  6548962509
                </span>
              </p>
              <p className="text-zinc-500 text-base font-normal font-jakarta">
                GST No :{" "}
                <span className=" text-neutral-800 text-base font-normal font-jakarta">
                  23AD24FR83KS
                </span>
              </p>
            </div>

            {/* Supplier Address + Dropdowns */}
            <div>
              <h3 className="text-neutral-800 text-lg font-semibold font-jakarta">
                Supplier Address
              </h3>
              <p className=" text-neutral-800 text-base font-normal font-jakarta">
                2/23-4 PSS Complex,
              </p>
              <p className=" text-neutral-800 text-base font-normal font-jakarta">
                Tenkasi - 627 811
              </p>
              <p className=" text-neutral-800 text-base font-normal font-jakarta">
                Tamil Nadu
              </p>
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col gap-4">
              {/* Payment Type */}
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  className="peer w-52 h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
                  placeholder=" "
                  value={"With Tax"}
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Invoice Type
                </label>
                <ChevronDown
                  className="absolute right-14 top-3 text-gray-500 pointer-events-none"
                  size={16}
                />
              </div>

              {/* Payment Status */}
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={"Ordered"}
                  className="peer w-52 h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
                  placeholder=" "
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Invoice Status
                </label>
                <ChevronDown
                  className="absolute right-14 top-3 text-gray-500 pointer-events-none"
                  size={16}
                />
              </div>
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
                {items.map((item, index) => (
                  <tr key={index} className="border border-gray-300">
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.product}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.hsn}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.qty}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.rate}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.discountAmount}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.discountAmount}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.cgstPercent}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.cgstAmount}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.cgstPercent}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.sgstAmount}
                    </td>
                    <td className="border border-gray-300 px-4 py-4 text-neutral-800 text-sm font-normal font-jakarta">
                      {item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right  text-neutral-800 text-sm font-normal font-jakarta">No of items: {items.length}</div>

          {/* Payment Type and Status */}
          <div className="px-20 rounded-md flex justify-between">
            {/* Payment Details */}
            <div className="flex flex-col gap-4">
              {/* Payment Type */}
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
                  placeholder=" "
                  value={"Cash"}
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
                  value={"Paid"}
                  className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
                  placeholder=" "
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Payment Status
                </label>
                
              </div>
            </div>

            <div className="py-2 text-neutral-800 text-base font-normal font-jakarta">
              <p>Total Amount : ₹111510</p>
              <p> Received : ₹00</p>
              <p>Balance : ₹111510</p>
            </div>

            <div className="py-2 text-neutral-800 text-base font-normal font-jakarta">
              <p>Total Amount Before Tax : ₹1000</p>
              <p>CGST : ₹250</p>
              <p>SGST : ₹200</p>
              <p>Grand Total : ₹111510</p>
            </div>
          </div>

          {/* Print Button */}
          <div className="flex justify-end">
            <button className="px-11 py-2 text-white text-base font-semibold bg-violet-800 font-jakarta rounded-md">
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierPurchase;
