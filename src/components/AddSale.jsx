import { useState } from "react";
import { Calendar, Plus, Save, Printer } from "lucide-react";

const AddSale = () => {
  const [taxType, setTaxType] = useState("Product");
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    gst: "",
  });

  return (
    <div className="p-3 bg-white min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-semibold">Add Sale</h2>
        <div className="flex items-center gap-3">
          <label className="text-gray-600">Tax Type :</label>
          <select className="border px-2 py-1 rounded">
            <option>GST</option>
            <option>VAT</option>
          </select>
          <div className="flex items-center gap-2">
            <span>Product</span>
            <label className="relative inline-flex cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-purple-600 peer-checked:after:translate-x-5 after:absolute after:top-1/2 after:left-1 after:-translate-y-1/2 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all"></div>
            </label>
            <span>Service</span>
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className=" p-2 rounded-md">
        <h3 className="text-gray-700 font-medium mb-2">Customer Detail</h3>
        <div className="grid grid-cols-4 gap-4">

             {/* Customer Name */}
        <div className="relative">
          <input
            type="text"
            placeholder=""
            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
          Customer Name *
          </label>
        </div>

           {/* Mobile No */}
           <div className="relative">
          <input
            type="text"
            placeholder=""
            className="peer w-full  h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
          Mobile No
          </label>
        </div>

         {/* GST No*/}
         <div className="relative">
          <input
            type="text"
            placeholder=""
            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
          GST No
          </label>
        </div>

        {/* Invoice Details */}
      <div >
        <div>Invoice No : <span className="font-semibold">4</span></div>
        <div className="gap-6">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>Invoice Date : 14/02/2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>Due Date : 21/02/2025</span>
          </div>
        </div>
      </div>
        </div>
      </div>

      {/* product details */}
      <div className="p-2 bg-white shadow rounded-md">
      <h3 className="text-gray-700 font-medium mb-2">Product Detail</h3>

      {/* Table with Reduced Width */}
      <table className="w-full border-collapse border text-center">
        {/* Table Head */}
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border w-8"></th> {/* Empty Column */}
            <th className="p-2 border w-32">Product</th>
            <th className="p-2 border w-16">Qty</th>
            <th className="p-2 border w-24">Rate (₹)</th>
            <th colSpan="2" className="p-2 border text-center w-28">Discount</th>
            <th colSpan="2" className="p-2 border text-center w-28">CGST</th>
            <th colSpan="2" className="p-2 border text-center w-28">SGST</th>
            <th className="p-2 border w-28">Total Amount</th>
          </tr>
          <tr className="bg-gray-100">
            <th className="p-2 border"></th> {/* Empty Column */}
            <th className="p-2 border"></th> {/* Product */}
            <th className="p-2 border"></th> {/* Qty */}
            <th className="p-2 border"></th> {/* Rate */}
            <th className="p-2 border text-center">%</th>
            <th className="p-2 border text-center">₹</th>
            <th className="p-2 border text-center">%</th>
            <th className="p-2 border text-center">₹</th>
            <th className="p-2 border text-center">%</th>
            <th className="p-2 border text-center">₹</th>
            <th className="p-2 border"></th> {/* Total Amount */}
          </tr>
        </thead>

        {/* Table Body - Only One Row */}
        <tbody>
          <tr className="border">
            <td colSpan="11" className="p-4 text-center text-gray-500">
              <button className="flex items-center gap-2 text-purple-600">
                <Plus size={16} /> Add Item
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

      {/* Payment Details */}
      <div className="mt-6 p-4 rounded-md flex justify-between">
        <div className="flex flex-col gap-2">
          <select className="input-field">
            <option>Payment Type</option>
            <option>Cash</option>
            <option>Card</option>
          </select>
          <select className="input-field">
            <option>Payment Status</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>
        <div>
          <p>Total Amount : ₹0.00</p>
          <p>Received : ₹0.00</p>
          <p>Balance : ₹0.00</p>
        </div>

        <div>
          <p>Total Amount Before Tax : ₹0.00</p>
          <p>CGST : ₹0.00</p>
          <p>SGST : ₹0.00</p>
          <p>Grand Total : ₹0.00</p>
        </div>
      </div>

    {/* Address Details */}
<div className="mt-6 p-4 rounded-md grid grid-cols-4 gap-4">
  
  {/* Billing Address */}
  <div>
    <h3 className="font-medium text-gray-700">Billing Address</h3>
    <input type="text" className="input-field w-full mt-1" placeholder="Address" />
    <label className="flex items-center gap-2 mt-2">
      <input type="checkbox" />
      <span className="text-gray-600 text-sm">Will Your Billing Address and Shipping Address same?</span>
    </label>
  </div>

  {/* Shipping Address */}
  <div>
    <h3 className="font-medium text-gray-700">Shipping Address</h3>
    <input type="text" className="input-field w-full mt-1" placeholder="Address" />
  </div>

  {/* Sale Notes */}
  <div>
    <h3 className="font-medium text-gray-700">Sale Notes</h3>
    <input type="text" className="input-field w-full mt-1" placeholder="Sale Notes" />
  </div>

  {/* Require E-Invoice Checkbox */}
  <div className="flex items-center">
    <input type="checkbox" />
    <span className="text-gray-600 text-sm ml-2">Require E-Invoice?</span>
  </div>

</div>


      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <button className="px-6 py-2 bg-orange-500 text-white rounded-md flex items-center gap-2">
          <Save size={16} /> Save
        </button>
        <button className="px-6 py-2 bg-purple-600 text-white rounded-md flex items-center gap-2">
          <Printer size={16} /> Save and Print
        </button>
      </div>
    </div>
  );
};

export default AddSale;
