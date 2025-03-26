import { useEffect, useState } from "react";
import { Calendar, Plus, CircleX , Printer, ChevronDown, CloudDownload } from "lucide-react";
import { Supplierget } from "../../api/supplierAPI";

const AddPurchaseReturn = () => {
  const [taxType, setTaxType] = useState("Product");
 
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  useEffect(() => {
    Supplierget({}, (response) => {
      setSuppliers(response.data);
    }, (error) => {
      console.error("Error fetching suppliers:", error);
    });
  }, []);

  useEffect(() => {
    setFilteredSuppliers(
      suppliers.filter((supplier) =>
        supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setHighlightIndex(-1);
  }, [searchTerm, suppliers]);

  const handleDropdownKey = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightIndex((prev) => (prev < filteredSuppliers.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && highlightIndex !== -1) {
      handleSelect(filteredSuppliers[highlightIndex]);
    }
  };

  const handleSelect = (supplier) => {
    setSelectedSupplier(supplier);
    setSearchTerm(supplier.supplier_name);
    setDropdownOpen(false);
  };

  
  // -------------------------- customer details ---------------------------

  const today = new Date().toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)
  // const nextWeek = new Date();
  // nextWeek.setDate(nextWeek.getDate() + 7); // Due date = 7 days from today
  // const defaultDueDate = nextWeek.toISOString().split("T")[0];

  const [invoiceDate, setInvoiceDate] = useState(today);
  const [dueDate, setDueDate] = useState(today);

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
  const [purchaseStatus, setPurchaseStatus] = useState("");
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
    <div className="p-3 bg-white min-h-full pr-3">
      {/* ------------------------------------------- Header ------------------------------------*/}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-lg font-semibold">Add Purchase Return</h2>
        <div className="flex items-center gap-3">
          <select className="border px-2 py-1 rounded">
            <option>With Tax</option>
            <option>Without Tax</option>
          </select>
         
        </div>
      </div>
{/* -------------------------------------------Sale Body -------------------------------------------- */}
<div className="overflow-y-scroll max-h-[450px] overflow-visible">

      {/* ------------------ Supplier Details ---------------*/}
      <div className="p-2 rounded-md">
  <h3 className="text-base font-semibold mb-2">Supplier Detail</h3>

  {/* Grid Layout */}
  <div className="grid grid-cols-4 gap-4">
    
    {/* Supplier Name */}
    <div className="relative col-span-1">
    <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            onKeyDown={handleDropdownKey}
            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
          />
        <label className="absolute left-3 -top-2 text-sm text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
        Supplier Name *
      </label>
      {dropdownOpen && filteredSuppliers.length > 0 && (
            <ul className="absolute w-full bg-white border border-gray-300 rounded shadow-md max-h-40 overflow-auto">
              {filteredSuppliers.map((supplier, index) => (
                <li
                  key={supplier.User_id}
                  className={`p-2 cursor-pointer ${index === highlightIndex ? "bg-gray-200" : ""}`}
                  onMouseDown={() => handleSelect(supplier)}
                >
                  {supplier.supplier_name}
                </li>
              ))}
            </ul>
          )}
    </div>

    {/* Mobile No */}
    <div className="relative col-span-1">
    <input type="text" placeholder="" value={selectedSupplier?.mobile_no || ""} className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom" />
      <label className="absolute left-3 -top-2 text-sm text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
        Mobile No
      </label>
    </div>

    {/* Email */}
    <div className="relative col-span-1">
    <input type="text" placeholder=""  value={selectedSupplier?.email || ""} className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom" />
      <label className="absolute left-3 -top-2 text-sm text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
        Email
      </label>
    </div>

    {/* Invoice Details (2 Rows Common) */}
    <div className="col-span-1 row-span-2 flex flex-col justify-top gap-1">
      <div className="flex items-center">
        <p className="text-[#838383] w-24">Invoice No :</p>
        <p>1</p>
      </div>
      <div className="flex items-center">
        <p className="text-[#838383] w-24">Invoice Date :</p>
        <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="focus:outline-none border border-[#c9c9cd] rounded px-2" />
      </div>
      <div className="flex items-center">
        <p className="text-[#838383] w-24">Due Date :</p>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="focus:outline-none border border-[#c9c9cd] rounded px-2" />
      </div>
    </div>

    {/* Address (2nd row under Supplier Name) */}
    <div className="relative col-span-1">
    <textarea
            rows="4"
            placeholder=""
            value={selectedSupplier?.address || ""}
            className="peer w-full p-3 rounded border border-[#c9c9cd] text-sm resize-none focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Address
          </label>
    </div>

    {/* GST No (2nd row under Mobile No) */}
    <div className="relative col-span-1">
    <input type="text" placeholder=""  value={selectedSupplier?.gst_number || ""} className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom" />
      <label className="absolute left-3 -top-2 text-sm text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
        GST No
      </label>
    </div>

    <div className="relative col-span-1">
    <input type="text" placeholder=""  value={selectedSupplier?.purchase_invoice_no || ""} className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom" />
      <label className="absolute left-3 -top-2 text-sm text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
        Purchase Invoice No
      </label>
    </div>


  </div>

  {/* Action Buttons */}
  <div className=" flex justify-end text-base font-semibold gap-4">
    <button className="px-4 py-2 bg-purpleCustom text-white rounded flex items-center gap-2">
      <CloudDownload /> Import
    </button>
    <button className="px-4 py-2 bg-purpleCustom text-white rounded flex items-center gap-2">
      <Plus /> Add Product
    </button>
  </div>
</div>

  {/*-------------------------------------------  product details ----------------------------------*/}
     <div className="p-2 overflow-x-auto">
      <h3 className="text-base font-semibold">Product Detail</h3>
      <table className="w-full border-collapse border text-center">
        <thead>
          <tr className="bg-[#f7f7f7] text-sm font-semibold">
            <th rowSpan="2" className="p-1 border w-8"></th>
            <th rowSpan="2" className="p-1 border w-48">Product</th>
            <th rowSpan="2" className="p-1 border w-24">HSN/SAC Code</th>
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
<div className="max-w-3xl mx-auto rounded-md grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* First Column: Payment Inputs */}
  <div className="flex flex-col gap-4 justify-between w-full">
    {/* Payment Type Input */}
    <div className="relative w-full">
      <input
        type="text"
        value={paymentType}
        readOnly
        className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] px-2 text-sm focus:outline-none focus:border-purpleCustom"
        placeholder=" "
        onFocus={() => setOpenDropdown("type")}
        onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
      />
      <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs">
        Payment Type
      </label>
      <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
      {openDropdown === "type" && (
        <ul className="absolute left-0 mt-1 z-10 w-full bg-white shadow-md rounded-md">
          {["Cash", "Card"].map((option) => (
            <li key={option} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => setPaymentType(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Payment Status Input */}
    <div className="relative w-full">
      <input
        type="text"
        value={paymentStatus}
        readOnly
        className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] px-2 text-sm focus:outline-none focus:border-purpleCustom"
        placeholder=" "
        onFocus={() => setOpenDropdown("paymentStatus")}
        onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
      />
      <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs">
        Payment Status
      </label>
      <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
      {openDropdown === "paymentStatus" && (
        <ul className="absolute left-0 mt-1 z-10 w-full bg-white shadow-md rounded-md">
          {["Paid", "Pending"].map((option) => (
            <li key={option} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => setPaymentStatus(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Purchase Status Input */}
    <div className="relative w-full">
      <input
        type="text"
        value={purchaseStatus}
        readOnly
        className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] px-2 text-sm focus:outline-none focus:border-purpleCustom"
        placeholder=" "
        onFocus={() => setOpenDropdown("purchaseStatus")}
        onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
      />
      <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs">
        Purchase Status
      </label>
      <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
      {openDropdown === "purchaseStatus" && (
        <ul className="absolute left-0 mt-1 z-10 w-full bg-white shadow-md rounded-md">
          {["Ordered", "Un Ordered"].map((option) => (
            <li key={option} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => setPurchaseStatus(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  {/* Second Column: Total Amount Details */}
  <div className="text-center flex flex-col align-top justify-center">
    <p>Total Amount : ₹0.00</p>
    <p>
      <input type="checkbox" /> Received : ₹0.00
    </p>
    <p>Balance : ₹0.00</p>
  </div>

  {/* Third Column: Tax Details */}
  <div className="text-center flex flex-col justify-center">
    <p>Total Amount Before Tax : ₹0.00 </p>
    <p>CGST : ₹0.00</p>
    <p>SGST : ₹0.00</p>
    <p>Discount : ₹0.00</p>
    <p>Grand Total : ₹0.00</p>
  </div>
</div>

{/* ------------------------------------------ Address Details ---------------------------------- */}
<div className="flex items-end justify-between px-20 mt-6">
  {/* Sale Notes */}
  <div className="ml-20 w-full max-w-xs self-end"> {/* Input field width limit */}
    <div className="relative w-full">
      <textarea
        rows="4"
        placeholder=" "
        className="peer w-full p-3 rounded border border-[#c9c9cd] text-sm resize-none focus:outline-none focus:border-purpleCustom"
      />
      <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
        Sale Notes
      </label>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex justify-end px-2 text-base font-semibold gap-4 self-end">
  <button className="px-12 py-2 bg-purpleCustom text-white rounded flex items-center gap-2">
  Save
    </button>
   
  </div>
</div>
</div>
    </div>
  );
};

export default AddPurchaseReturn;
