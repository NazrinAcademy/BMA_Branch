import { useState } from "react";
import { Calendar, Plus, CircleX , Printer, ChevronDown } from "lucide-react";

const Quotation = () => {
  const [taxType, setTaxType] = useState("Product");
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    gst: "",
  });
  
  // -------------------------- customer details ---------------------------

  const today = new Date().toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7); // Due date = 7 days from today
  const defaultDueDate = nextWeek.toISOString().split("T")[0];

  const [invoiceDate, setInvoiceDate] = useState(today);
  const [dueDate, setDueDate] = useState(defaultDueDate);

 // ------------------------- Product Details ---------------------------------
 const products = [
  { name: "Apple", hsn: "1001", price: 50 },
  { name: "Banana", hsn: "1002", price: 20 },
  { name: "Orange", hsn: "1003", price: 30 },
  { name: "Grapes", hsn: "1004", price: 40 },
  { name: "Mango", hsn: "1005", price: 60 },
  { name: "Pineapple", hsn: "1006", price: 80 },
];

// Extract only product names for dropdown suggestions
const productList = products.map((p) => p.name);

const [items, setItems] = useState([]);
const [filteredProducts, setFilteredProducts] = useState([]);
const [activeIndex, setActiveIndex] = useState(-1);

const handleInputChange = (index, field, value) => {
  const updatedItems = [...items];
  updatedItems[index][field] = value;

  // When Product is Selected, Auto-fill HSN & Price
  if (field === "product") {
    if (value === "") {
      setFilteredProducts([]);
    } else {
      const filtered = productList.filter((p) =>
        p.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
      setActiveIndex(-1);
    }

    const selectedProduct = products.find((p) => p.name === value);
    if (selectedProduct) {
      updatedItems[index]["hsn"] = selectedProduct.hsn; // HSN Code
      updatedItems[index]["rate"] = selectedProduct.price; // Fixed Price
    } else {
      updatedItems[index]["hsn"] = "";
      updatedItems[index]["rate"] = "";
    }
  }

  // Auto Calculate Rate = Qty * Fixed Price
  if (field === "qty" && updatedItems[index]["product"]) {
    const product = updatedItems[index]["product"];
    const selectedProduct = products.find((p) => p.name === product);
    const price = selectedProduct ? selectedProduct.price : 0;
    const qty = parseFloat(value) || 0;
    updatedItems[index]["rate"] = (qty * price).toFixed(2);
  }

  setItems(updatedItems);
};


  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown" && filteredProducts.length > 0) {
      setActiveIndex((prev) => (prev < filteredProducts.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp" && filteredProducts.length > 0) {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSelectProduct(index, filteredProducts[activeIndex]);
    }
  };

  const handleSelectProduct = (index, product) => {
    handleInputChange(index, "product", product);
    setFilteredProducts([]);
  };

  const addNewRow = () => {
    setItems([...items, { product: "", hsn: "", qty: "", rate: "", discountPercent: "", discountAmount: "", cgstPercent: "", cgstAmount: "", sgstPercent: "", sgstAmount: "", total: "" }]);
  };

  const removeRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };


  // ------------------------- payment dropdown ---------------------------------

  const [paymentType, setPaymentType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);



// ----------------------------  address --------------------------------------------

  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isSameAddress, setIsSameAddress] = useState(false);

  // Handle checkbox toggle
  const handleCheckboxChange = () => {
    setIsSameAddress(!isSameAddress);
    if (!isSameAddress) {
      setShippingAddress(billingAddress); // Auto-fill Shipping Address
    } else {
      setShippingAddress(""); // Allow editing when unchecked
    }
  };

  

  return (
    <div className="p-3 bg-white min-h-full">
      {/* ------------------------------------------- Header ------------------------------------*/}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-semibold">Quotation</h2>
        <div className="flex items-center gap-3">
          <select className="border px-2 py-1 rounded">
            <option>With Tax</option>
            <option>Without Tax</option>
          </select>
          <div className="flex items-center gap-2">
            <span>Product</span>
            <label className="relative inline-flex cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-purple-600 rounded-full peer-checked:bg-gray-300 peer-checked:after:translate-x-5 after:absolute after:top-1/2 after:left-1 after:-translate-y-1/2 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all"></div>
            </label>
            <span>Service</span>
          </div>
        </div>
      </div>

{/* -------------------------------------------Sale Body -------------------------------------------- */}
  <div className="overflow-y-scroll max-h-[450px] overflow-visible">
      {/* ----------------------- Customer Details ------------------*/}
      <div className="p-2 rounded-md">
      <h3 className="text-base font-semibold mb-2">Customer Detail</h3>
      <div className="grid grid-cols-4 gap-4">
        
        {/* Customer Name */}
        <div className="relative">
          <input type="text" placeholder="" className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom" />
          <label className="absolute left-3 -top-2 text-sm text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Customer Name *
          </label>
        </div>

        {/* Mobile No */}
        <div className="relative">
          <input type="text" placeholder="" className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom" />
          <label className="absolute left-3 -top-2 text-sm text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Mobile No
          </label>
        </div>

        {/* GST No */}
        <div className="relative">
          <input type="text" placeholder="" className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom" />
          <label className="absolute left-3 -top-2 text-sm text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            GST No
          </label>
        </div>

        {/* Invoice Details */}
        <div className="flex items-center justify-center">
        <div className="text-base font-normal  ">

             {/* Invoice No */}
             <div className="flex items-center">
            <p className="text-[#838383]">Invoice No :</p>
             <p>1</p>
            </div>

            {/* Invoice Date */}
            <div className="flex items-center text-nowrap ">
            <p className="text-[#838383]">Invoice Date :</p>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="focus:outline-none "
              />
            </div>

            {/* Due Date */}
            <div className="flex items-center text-nowrap">
            <p className="text-[#838383]">Due Date :</p>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="focus:outline-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>

  {/*-------------------------------------------  product details ----------------------------------*/}
     <div className="p-2">
      <h3 className="text-base font-semibold">Product Detail</h3>
      <table className="w-full border-collapse border text-center">
        <thead>
          <tr className="bg-[#f7f7f7] text-sm font-semibold">
            <th rowSpan="2" className="p-1 border w-8"></th>
            <th rowSpan="2" className="p-1 border w-48">Product</th>
            <th rowSpan="2" className="p-1 border w-24">HSN Code</th>
            <th rowSpan="2" className="p-1 border w-24">Qty</th>
            <th rowSpan="2" className="p-1 border w-24">Rate (₹)</th>
            <th colSpan="2" className="p-1 border">Discount</th>
            <th colSpan="2" className="p-1 border">CGST</th>
            <th colSpan="2" className="p-1 border">SGST</th>
            <th rowSpan="2" className="p-1 border w-22">Total Amount</th>
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
            <tr key={index} className="border relative">
              <td className="p-1 border w-8 text-center">
                <button onClick={() => removeRow(index)} className="text-red-600">
                  <CircleX size={16} />
                </button>
              </td>
              {Object.keys(item).map((key) => (
                <td key={key} className="p-1 border w-24 relative">
                  <input
                    id={`input-${index}-${key}`}
                    type="text"
                    className="w-full p-1 text-center"
                    value={item[key]}
                    onChange={(e) => handleInputChange(index, key, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                  {key === "product" && filteredProducts.length > 0 && (
                    <ul className="absolute bg-white border shadow-md w-full z-10 text-left">
                      {filteredProducts.map((product, i) => (
                        <li
                          key={product}
                          className={`p-1 cursor-pointer ${i === activeIndex ? "bg-gray-200" : ""}`}
                          onMouseDown={() => handleSelectProduct(index, product)}
                        >
                          {product}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border">
            <td colSpan="11" className="p-4 text-center text-gray-500">
              <button onClick={addNewRow} className="flex items-center gap-2 text-purple-600">
                <Plus size={16} /> Add Item
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="text-right">No of items: {items.length}</div>
    </div>
  
      {/*---------------------------------------- Payment Details--------------------------------------- */}
      <div className="px-20 rounded-md flex justify-between">
        {/* Payment Details */}
        <div className="flex flex-col gap-4">
          {/* Payment Type */}
          <div className="relative">
            <input
              type="text"
              value={paymentType}
              readOnly
              className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
              placeholder=" "
              onFocus={() => setOpenDropdown("type")}
              onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
            />
            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
              Payment Type
            </label>
            <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
            {openDropdown === "type" && (
              <ul className="absolute left-0 mt-1 z-10 w-full bg-white shadow-md rounded-md">
                {["Cash", "Card"].map((option) => (
                  <li
                    key={option}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setPaymentType(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Payment Status */}
          <div className="relative">
            <input
              type="text"
              value={paymentStatus}
              readOnly
              className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
              placeholder=" "
              onFocus={() => setOpenDropdown("status")}
              onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
            />
            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
              Payment Status
            </label>
            <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
            {openDropdown === "status" && (
              <ul className="absolute left-0 mt-1 z-10 w-full bg-white shadow-md rounded-md">
                {["Paid", "Pending"].map((option) => (
                  <li
                    key={option}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setPaymentStatus(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="py-4">
          <p>Total Amount : ₹0.00</p>
          <p> Received : ₹0.00</p>
          <p>Balance : ₹0.00</p>
        </div>

        <div className="py-4">
          <p>Total Amount Before Tax : ₹0.00</p>
          <p>CGST : ₹0.00</p>
          <p>SGST : ₹0.00</p>
          <p>Discount : ₹0.00</p>
          <p>Grand Total : ₹0.00</p>
        </div>
      </div>

      {/* ------------------------------------------ Address Details ----------------------------------*/}
      <div className="mt-6 p-4 mx-6 rounded-md grid grid-cols-4 gap-4">
      
      {/* Billing Address */}
      <div>
        <h3 className="text-base font-semibold">Billing Address</h3>
        <div className="relative mt-2">
          <textarea
            rows="4"
            placeholder=""
            value={billingAddress}
            onChange={(e) => {
              setBillingAddress(e.target.value);
              if (isSameAddress) setShippingAddress(e.target.value); // Auto-update Shipping Address
            }}
            className="peer w-full p-3 rounded border border-[#c9c9cd] text-sm resize-none focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Address
          </label>
        </div>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={isSameAddress} onChange={handleCheckboxChange} />
          <span className="text-gray-600 text-sm">Will Your Billing Address and Shipping Address be the same?</span>
        </label>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-base font-semibold">Shipping Address</h3>
        <div className="relative mt-2">
          <textarea
            rows="4"
            placeholder=""
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            disabled={isSameAddress} // Disable input if checkbox is checked
            className="peer w-full p-3 rounded border border-[#c9c9cd] text-sm resize-none focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Address
          </label>
        </div>
      </div>

      {/* Sale Notes */}
      <div>
        <div className="relative mt-8">
          <textarea
            rows="4"
            placeholder=""
            className="peer w-full p-3 rounded border border-[#c9c9cd] text-sm resize-none focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Sale Notes
          </label>
        </div>
      </div>

      {/* Require E-Invoice Checkbox */}
      <div className="flex items-center mt-8">
        <input type="checkbox" />
        <span className="text-gray-600 text-sm ml-2">Require E-Invoice?</span>
      </div>

    </div>


      {/*---------------------------------------- Action Buttons-------------------------------------- */}
      <div className="mt-4 flex justify-end text-base font-semibold gap-4 mb-4 pr-3">
        <button className="px-10 py-2 bg-[#F4A261] text-white  rounded flex items-center gap-2">
           Save
        </button>
        <button className="px-4 py-2 bg-purpleCustom text-white  rounded flex items-center gap-2">
          Save and Print
        </button>
      </div>
      </div>
    </div>
  );
};

export default Quotation;
