import {
    User,
    MapPin,
    Phone,
    Mail,
    CalendarDays,
    ReceiptIndianRupee,
  
  } from "lucide-react";
  
  const ViewPage = () => {
    return (
      <div className="border h-full border-gray-300 rounded-md bg-white p-3 shadow-md ">
        <div className="border-b pb-3 border-gray-300">
          <h2 className="text-xl font-semibold text-[#202020] font-jakarta">Zupee Electronics</h2>
          <p className="text-sm text-gray-500 font-jakarta">Supplier<span>(Sundry Debtor)</span></p>
        </div>
  
        {/* Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4 text-gray-800">
          {/* Personal Details */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-[#202020]">
              <User className="w-5 h-5" />
              <span className="text-sm  font-medium font-jakarta">Personal Details</span>
            </div>
            <p className="text-sm mt-1"><span className="font-semibold text-[#838383] font-jakarta">Name:</span> Zupee Electronics</p>
            <p className="text-sm"><span className="font-semibold text-[#838383] font-jakarta">GST No:</span> 33XYZPQ5678GZZ6</p>
          </div>
  
          {/* Address */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-[#202020]">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium font-jakarta">Address</span>
            </div>
            <p className="text-sm font-jakarta mt-1">2/23–4 PSS Complex,<br/> Tenkasi - 627 811,<br/> Tamil Nadu</p>
          </div>
  
          {/* Contact Details */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="w-5 h-5" />
              <span className="text-sm font-jakarta font-medium">Contact Details</span>
            </div>
            <p className="text-sm mt-1"><span className="font-semibold text-[#838383] font-jakarta">Mobile No:</span> 6548962509</p>
            <p className="text-sm flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              <span className="font-jakarta">zupeeelectronics@gmail.com</span>
            </p>
          </div>
  
          {/* Payment Details */}
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 text-gray-700">
              <ReceiptIndianRupee  className="w-5 h-5" />
              <span className="text-sm font-jakarta font-medium">Payment Details</span>
            </div>
            <p className="text-sm mt-1"><span className=" font-jakartan text-[#838383] font-semibold">Opening Balance:</span> ₹20,000</p>
            <p className="text-sm"><span className="font-semibold text-[#838383] font-jakarta">Current Balance:</span> ₹20,000</p>
          </div>
        </div>

        
          <div className="flex justify-between ">
          <div className="bg-[#f7f7f7] px-8 py-2 rounded-md font-semibold text-[#202020] font-jakarta">
        Account Summary
      </div>

            
             <div className="flex items-center border border-gray-400 py-2 px-3 rounded-md">
            <CalendarDays size={20} className="text-[#838383] mr-3 "/>
            <h2 className="text-[#838383] font-normal text-base">Filter By Date</h2>
          </div>
          </div>
    <div className="max-w-64 p-2">
      <div className="mt-2 space-y-2 text-gray-800 font-jakarta">
        <div className="flex justify-between ">
          <span>Opening Balance</span>
          <span className="ml-4">: ₹</span>
          <span> 20,000</span>
        </div>
        <div className="flex justify-between">
          <span>Total Purchase</span>
          <span className="ml-6">: ₹</span>
          <span> 2,500</span>
        </div>
        <div className="flex justify-between">
          <span>Total Paid</span>
          <span className="ml-[60px]">: ₹</span>
          <span> 2,500</span>
        </div>
        <div className="flex justify-between ">
          <span className="">Balance Due</span>
          <span className="ml-12">: ₹</span>
          <span className="text-[#202020]"> 20,000</span>
        </div>
      </div>
    </div>
    <div className="max-w-5xl mx-auto p-2 rounded-lg">
      <div className="max-h-[100px] overflow-y-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr className="text-left text-gray-600">
              {["Date", "Type", "Payment Status", "Debit", "Credit", "Balance", "Payment Method"].map((header) => (
                <th key={header} className="px-4 py-2 border border-gray-200">{header}</th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-gray-800">
            {[
              { date: "10/02/2025", type: "Opening Balance", status: "--", debit: "--", credit: "₹ 20,000", balance: "₹ 20,000", method: "--" },
              { date: "10/02/2025", type: "Purchase", status: "Paid", debit: "--", credit: "₹ 4,000", balance: "₹ 24,000", method: "--" },
              { date: "14/02/2025", type: "Payment", status: "--", debit: "₹ 4,000", credit: "--", balance: "₹ 20,000", method: "Cash" },
              { date: "14/02/2025", type: "Purchase Return", status: "Paid", debit: "₹ 1,500", credit: "--", balance: "₹ 18,500", method: "--" },
              { date: "14/02/2025", type: "Payment", status: "--", debit: "--", credit: "₹ 1,500", balance: "₹ 20,000", method: "Cash" },
            ].map((row, index) => (
              <tr key={index} className={`border border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="px-4 py-2 border border-gray-200">{row.date}</td>
                <td className="px-4 py-2 border border-gray-200">{row.type}</td>
                <td className="px-4 py-2 border border-gray-200">
                  {row.status === "Paid" ? (
                    <span className="px-2 py-1 text-green-600 bg-green-100 rounded-md text-xs">Paid</span>
                  ) : (
                    "--"
                  )}
                </td>
                <td className="px-4 py-2 border border-gray-200">{row.debit}</td>
                <td className="px-4 py-2 border border-gray-200">{row.credit}</td>
                <td className="px-4 py-2 border border-gray-200">{row.balance}</td>
                <td className="px-4 py-2 border border-gray-200">{row.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
 

  
       
      </div>
    );
  };
  
  export default ViewPage;
  