import { ListFilter, Search, ChartNoAxesCombined, TrendingDown, GitCommitHorizontal , TrendingUp, ShoppingCart, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const Dashboard = () => {
  // Static Data for Cards
  const cardData = [
    { title: "Total Sale", value: "₹13250", icon: <ChartNoAxesCombined className="text-green-500 w-6 h-6" />, bgColor: "bg-[#D9FFEF]" },
    { title: "Sale Due", value: "₹5250", icon: <TrendingDown className="text-red-500 w-6 h-6" />, bgColor: "bg-[#FFD9DA]" },
    { title: "Total Purchase", value: "₹15500", icon: <TrendingUp className="text-green-500 w-6 h-6" />, bgColor: "bg-[#D9FFEF]" },
    { title: "Purchase Due", value: "₹1000", icon: <TrendingUp className="text-green-500 w-6 h-6" />, bgColor: "bg-[#D9FFEF]" },
    { title: "Expenses", value: "₹1250", icon: <TrendingUp className="text-green-500 w-6 h-6" />, bgColor: "bg-[#D9FFEF]" },
  ];

  // Static Data for Line Chart
  const analysisData = [
    { day: "Sun", sales: 6500, purchase: 4500, expenses: 1500 },
    { day: "Mon", sales: 3200, purchase: 2800, expenses: 800 },
    { day: "Tue", sales: 7800, purchase: 5600, expenses: 2000 },
    { day: "Wed", sales: 4500, purchase: 4900, expenses: 3000 },
    { day: "Thu", sales: 8500, purchase: 6200, expenses: 3700 },
    { day: "Fri", sales: 5200, purchase: 4700, expenses: 1900 },
    { day: "Sat", sales: 6800, purchase: 3500, expenses: 1600 },
  ];

  // Static Data for Pie Chart
  const stockData = [
    { name: "In Stock", value: 60, color: "#22c55e" }, // Green
    { name: "Low Stock", value: 15, color: "#ef4444" }, // Red
    { name: "Out of Stock", value: 25, color: "#facc15" }, // Yellow
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-red-500 text-white text-xs px-3 py-2 rounded-md shadow-lg">
          <p className="font-semibold">{label}</p>
          <p>₹{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // Static Data for Essential Reports
  const reports = ['Transaction', 'Sale Report', 'GST Report', 'Stock Report'];

  // Static Data for Quick Search
  const searchCategories = ['Product', 'Customer', 'Supplier', 'Invoice No'];

  const [selectedOption, setSelectedOption] = useState("sale");

  const total = 45; // Example total count
  const paid = 27; // Example paid count
  const unpaid = total - paid;

  const paidPercentage = (paid / total) * 100;
  const unpaidPercentage = (unpaid / total) * 100;

  return (
    <div className="p-3 bg-gray-100 w-full min-h-screen">
      {/*------------------------------- Top Cards ---------------------------------*/}
      <div className="grid grid-cols-5 gap-4">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded flex justify-between items-center border border-gray-200"
          >
            <div>
              <p className="text-[#838383] font-semibold text-sm">{card.title}</p>
              <p className="font-semibold text-xl">{card.value}</p>
              <p className="text-[#838383] font-normal text-sm">From Today</p>
            </div>
            <div className={`w-10 h-10 flex justify-center items-center rounded-full ${card.bgColor}`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/*----------------------------- Charts & Status ------------------------------------*/}
      <div className="grid grid-cols-3 gap-6 mt-3">
        <div className="bg-white p-6 rounded shadow-sm col-span-2">

          {/* Header Section */}
          <div className="flex justify-between">
            <h2 className="font-semibold text-gray-700">Analysis</h2>
            <button className="text-gray-500 border p-2 rounded text-sm flex items-center">
              <ListFilter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>

          {/* Legend (Labels with Icons) */}
          <div className="flex space-x-6 mt-3 text-sm font-medium text-gray-600">
            <div className="flex items-center space-x-2">
              <GitCommitHorizontal  className=" text-indigo-500" />
              <span>Sales</span>
            </div>
            <div className="flex items-center space-x-2">
              <GitCommitHorizontal  className=" text-red-400" />
              <span>Purchase</span>
            </div>
            <div className="flex items-center space-x-2">
              <GitCommitHorizontal  className=" text-blue-400" />
              <span>Expenses</span>
            </div>
          </div>

          {/* Chart Container */}
          <div className="mt-4 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analysisData}>
                <defs>
                  <filter id="shadow" height="130%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.3)" />
                  </filter>
                </defs>

                <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis stroke="transparent" tick={{ fill: "#666" }} />

                {/* Custom Tooltip */}
            <Tooltip content={<CustomTooltip />} />

                <Line type="linear" dataKey="sales" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} style={{ filter: "url(#shadow)" }} />
                <Line type="linear" dataKey="purchase" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} style={{ filter: "url(#shadow)" }} />
                <Line type="linear" dataKey="expenses" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} style={{ filter: "url(#shadow)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --------------Stock Availability */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-700 text-left mb-4">Stock Availability</h2>

          {/* Stock Labels in Flex Layout */}
          <div className="flex justify-between items-center">
            {stockData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1 h-10" style={{ backgroundColor: entry.color }}></div> {/* Vertical line */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700">{entry.name}</span>
                  <span className="text-xs text-gray-500">{entry.value}%</span> {/* Percentage below label */}
                </div>
              </div>
            ))}
          </div>

          {/* Enlarged Pie Chart */}
          <div className="w-full h-60 flex justify-center mt-6">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  label={({ value }) => `${value}%`}  // Label with % symbol
                >
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      {/* -----------------Bottom Section ------------------------------*/}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* Payment Status */}
       <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-sm">
      {/* Title */}
      <h2 className="font-semibold text-gray-700">Payment Status</h2>

      {/* Sale & Purchase Radio Buttons */}
      <div className="flex items-center space-x-4 mt-3">
        <label className="flex items-center space-x-1 cursor-pointer">
          <input
            type="radio"
            name="paymentType"
            value="sale"
            checked={selectedOption === "sale"}
            onChange={() => setSelectedOption("sale")}
            className="hidden"
          />
          <span className={`w-4 h-4 border-2 border-purple-500 rounded-full flex items-center justify-center ${selectedOption === "sale" ? "bg-white" : ""}`}>
            {selectedOption === "sale" && <span className="w-2 h-2 bg-purple-500 rounded-full"></span>}
          </span>
          <span className="text-sm text-gray-600">Sale</span>
        </label>

        <label className="flex items-center space-x-1 cursor-pointer">
          <input
            type="radio"
            name="paymentType"
            value="purchase"
            checked={selectedOption === "purchase"}
            onChange={() => setSelectedOption("purchase")}
            className="hidden"
          />
          <span className={`w-4 h-4 border-2 border-purple-500 rounded-full flex items-center justify-center ${selectedOption === "purchase" ? "bg-white" : ""}`}>
            {selectedOption === "purchase" && <span className="w-2 h-2 bg-purple-500 rounded-full"></span>}
          </span>
          <span className="text-sm text-gray-600">Purchase</span>
        </label>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mt-4 relative">
        <div className="bg-green-500 h-3 rounded-l-full absolute left-0" style={{ width: `${paidPercentage}%` }}></div>
        <div className="bg-red-500 h-3 rounded-r-full absolute right-0" style={{ width: `${unpaidPercentage}%` }}></div>
      </div>

      {/* Percentage Labels */}
      <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
        <span>{paidPercentage.toFixed(0)}%</span>
        <span>{unpaidPercentage.toFixed(0)}%</span>
      </div>

      {/* Total Section */}
      <div className="flex justify-between items-center border-t mt-3 pt-2 text-sm font-medium text-gray-700">
        <span>Total</span>
        <span>{total}</span>
      </div>

      {/* Paid & Unpaid List */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-700">Paid</span>
          </div>
          <div className="text-sm text-gray-700 flex items-center space-x-4">
            <span>{paid}</span>
            <span>{paidPercentage.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-100 rounded-md px-3 py-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            <span className="text-sm text-gray-700">Unpaid</span>
          </div>
          <div className="text-sm text-gray-700 flex items-center space-x-4">
            <span>{unpaid}</span>
            <span>{unpaidPercentage.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>


        {/* Essential Reports */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
        <h2 className="font-semibold text-gray-700 flex justify-between">
          <span>Essential Reports</span>
          <span className="text-purple-500 text-sm cursor-pointer">View All</span>
        </h2>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {reports.map((report, index) => (
            <button key={index} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              {report}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="font-semibold text-gray-700">Quick Search</h2>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Stock..."
              className="pl-10 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="mt-4 space-y-2">
            {searchCategories.map((item, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="searchCategory" className="hidden" />
                <span className="w-4 h-4 border-2 border-purple-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                </span>
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
