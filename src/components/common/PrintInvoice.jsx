import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import titleIcon from "../../assets/Frame 152.png";
import { toWords } from "number-to-words";

const PrintInvoice = ({
  invoiceData,
  closePrint ,
  content,
  invoiceType
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500); // Small delay to prevent duplicate prints
  
    return () => clearTimeout(timer);
  }, []);
  
  
  

  console.log("Received invoiceData:", invoiceData);
  if (!invoiceData) {
    return <div>No invoiceData data found.</div>;
  }


  return (
    <div className="max-w-3xl h-auto mx-auto bg-white font-['Plus_Jakarta_Sans'] p-6 shadow-lg border rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-4">
        <h1 className="text-xl font-bold text-center w-full">{content}</h1>
      </div>

      {/* Company Info */}
      <div className="flex justify-between items-center pb-4 border-b">
      <div className="flex items-center gap-4">
      <img src={titleIcon} alt="Company Logo" className="w-16 h-16" />
        </div>
        <div className="flex items-center gap-4">
        
          <div className="font-normal ">
            <h2 className="font-bold text-lg">Grafin Mobiles</h2>
            <p>3-10 Post Office, Tenkasi - 627 817</p>
            <p>Tamil Nadu, India</p>
          </div>
        </div>
        <div className="text-left text-sm font-normal">
          <p>
            <span>GST No:</span> 12AB3403R092
          </p>
          <p>
            <span>Mobile No:</span> 9876543234
          </p>
          <p>
            <span>Email:</span> grafinmobile@gmail.com
          </p>
        </div>
      </div>

  {/* Customer Details */}
  <div className="grid grid-cols-2 gap-4 mt-4 text-sm border-b pb-4">
        <div className="font-medium">
        <p>
      <span className="font-normal">
        {invoiceType === "purchase" ? "Supplier Name:" : "Customer Name:"}
      </span> {invoiceData.billing_to}
    </p>
          <p>
            <span className="font-normal">Mobile No:</span> {invoiceData.mobile_no}
          </p>
          <p>
            <span className="font-normal">GST No:</span> {invoiceData.gst_no}
          </p>
        </div>
        <div className="text-left">
          <p>
            <span className="font-normal">Invoice No:</span> {invoiceData.invoice_no}
          </p>
          <p>
            <span className="font-normal">Invoice Date:</span>{" "}
            {invoiceData.invoice_date}
          </p>
          <p>
            <span className="font-normal">Due Date:</span> {invoiceData.due_date}
          </p>
        </div>
      </div>

      {/* Billing & Shipping Address */}
{/* Billing & Shipping Address */}
<div className="border border-gray-300 text-sm">
  <table className="w-full border-separate border-spacing-0">
    <tbody>
      <tr>
        <td className="p-2 font-semibold border border-gray-300 ">Billing Address</td>
        <td className="p-2 font-semibold border border-gray-300 ">Shipping Address</td>
      </tr>
      <tr>
        <td className="p-2 border border-gray-300 text-gray-600 align-top">{invoiceData.billing_address}</td>
        <td className="p-2 border border-gray-300 text-gray-600 align-top">{invoiceData.shipping_address}</td>
      </tr>
    </tbody>
  </table>
</div>


      {/* Invoice Table */}
      <table className="w-full mt-4 text-sm border border-gray-300">
      <thead>
                  <tr className="text-sm font-semibold">
                  <th rowSpan="2" className="p-1 border">No</th>
                    <th rowSpan="2" className="p-1 border">Item</th>
                    <th rowSpan="2" className="p-1 border">HSN</th>
                    <th rowSpan="2" className="p-1 border">Qty</th>
                    <th rowSpan="2" className="p-1 border">Rate</th>
                    <th colSpan="2" className="p-1 border">Disc</th>
                    <th colSpan="2" className="p-1 border">CGST</th>
                    <th colSpan="2" className="p-1 border">SGST</th>
                    <th rowSpan="2" className="p-1 border">Total</th>
                  </tr>
                  <tr className="text-sm font-semibold">
                    <th className="p-1 border">%</th>
                    <th className="p-1 border">₹</th>
                    <th className="p-1 border">%</th>
                    <th className="p-1 border">₹</th>
                    <th className="p-1 border">%</th>
                    <th className="p-1 border">₹</th>
                  </tr>
                </thead>
        <tbody>
        {invoiceData.products?.map((product, index) => (
          <tr  key={index} className="border font-normal">
            <td className="p-2 border text-center">1</td>
            <td className="p-2 border">{product.product_name}</td>
                    <td className="p-2 border">{product.hsn_sac_code}</td>
                    <td className="p-2 border">{product.quantity}</td>
                    <td className="p-2 border">{product.rate}</td>
                    <td className="p-2 border">{product.discount}</td>
                    <td className="p-2 border">{product.discount_price}</td>
                    <td className="p-2 border">{product.cgst}</td>
                    <td className="p-2 border">{product.cgst_price}</td>
                    <td className="p-2 border">{product.sgst}</td>
                    <td className="p-2 border">{product.sgst_price}</td>
                    <td className="p-2 border">{product.total_amount}</td>
          </tr>
        ))}
        </tbody>
      </table>

{/* Summary */}
<div className="mt-4 text-sm border border-gray-300 grid grid-cols-2">
  {/* Left Side - Amount in Words */}
  <div className="p-4 border-r border-gray-300">
    <p className="font-semibold">Total amount In Words</p>
    <p className="font-medium text-lg mt-1">{toWords(invoiceData.grand_total)}</p>
  </div>

  {/* Right Side - Amount Details */}
  <div className="p-4">
    <table className="w-full border-collapse">
      <tbody>
        <tr className="border-b">
          <td className="py-2 w-2/3 font-medium text-right">Total Amount Before Tax :</td>
          <td className="py-2 text-right w-1/3">₹{invoiceData.total_before_tax}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 w-2/3 text-right">CGST :</td>
          <td className="py-2 text-right w-1/3">₹{invoiceData.total_cgst}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 w-2/3 text-right">SGST :</td>
          <td className="py-2 text-right w-1/3">₹{invoiceData.total_sgst}</td>
        </tr>
        <tr className="border-b">
          <td className="py-2 w-2/3 text-right">Discount :</td>
          <td className="py-2 text-right w-1/3">₹{invoiceData.discount_value}</td>
        </tr>
        <tr className="font-semibold">
          <td className="py-2 w-2/3 text-right">Grand Total :</td>
          <td className="py-2 text-right w-1/3">₹{invoiceData.total_amount}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>



      {/* Terms & Conditions */}
      <div className="mt-6 text-xs border-t font-normal pt-4">
        <p className="font-medium text-[15px]">Terms & Conditions</p>
        <div className="mt-1 text-[12px]">

        <p>
          <span className="font-medium">Payment:</span> Due within 5 days, late
          fees apply.
        </p>
        <p>
          <span className="font-medium">Returns:</span> No returns unless
          defective, reported in 5 days.
        </p>
        <p>
          <span className="font-medium">Taxes:</span> GST included; extra
          charges on buyer.
        </p>
        <p>
          <span className="font-medium">Disputes:</span> Subject to [City/State]
          jurisdiction.
        </p>
        </div>
      </div>

      {/* Authorized Signatory */}
      <div className="mt-10 pr-8 text-right font-medium text-sm">
        <p>Authorized Signatory</p>
        <p className="text-xs pr-5 items-center font-normal">For Grafin Mobiles</p>
      </div>
    </div>
  );
};

export default PrintInvoice;