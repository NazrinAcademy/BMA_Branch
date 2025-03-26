import React, { useState, useEffect, useRef } from "react";
import Barcode from 'react-barcode';
import { ImagePlus, X, CirclePlus, ChevronDown, ScanBarcode, Edit, Printer } from "lucide-react";
import successImage from '../../assets/success.png'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import SubCategoryModal from "./SubCategoryModal";
import BrandModal from "./BrandModal";
import UnitModal from "./UnitModal";
import CategoryModal from "./categoryModal";
import { addCategory, fetchCategories } from "../../api/categoryAPI";
import { addSubCategory, fetchSubCategories } from "../../api/subcategoryAPI";
import { addNewUnit, fetchUnits } from "../../api/unitAPI";
import { addBrand, getBrands } from "../../api/brandAPI";
import { Supplierget } from "../../api/supplierAPI";
import { getPersonalDetails } from "../../api/PGapi";
import { calculateOpeningStockValue, calculateTax, saveProductDetails } from "../../api/AddProductAPI";

const AddProduct = () => {

  // -------------------------------  usestate ---------------------------------
  const [showSuccessMessage, setShowSuccessMessage] = useState(null)
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [activeForm, setActiveForm] = useState('price');
  const { userDetails } = useSelector((state) => (state.auth))

  // ------------------------ handle key press -------------------------------------

  // product details:
  const brandRef = useRef();
  const productModelRef = useRef();
  const subCategoryRef = useRef();
  const productNameRef = useRef();
  const unitRef = useRef();
  const categoryRef = useRef();
  const barcodeRef = useRef();
  const descriptionRef = useRef();
  const imageUploadRef = useRef();

  // price details:
  const purchasePriceRef = useRef();
  const salePriceRef = useRef();
  const minSalePriceRef = useRef();
  const mrpRef = useRef();
  const hsnCodeRef = useRef();
  const discountRef = useRef();

  // Stock Details:
  const openingStockRef = useRef();
  const OpeningStockValueRef = useRef();
  const lowStockQtyRef = useRef();
  const dateRef = useRef();
  const locationRef = useRef();
  const supplier_nameRef = useRef();

  // GST Details:
  const igstRef = useRef();
  const cgstRef = useRef();
  const sgstRef = useRef();
  const cessRef = useRef();
  const totalAmountRef = useRef();

  // Add new category:
  const newCategoryRef = useRef();
  const newigstRef = useRef();
  const newcgstRef = useRef();
  const newsgstRef = useRef();

  // Add new sub category:
  const newCategorySelectRef = useRef();
  const newSubCategoryRef = useRef();
  const newHsnSacRef = useRef();

  // Add new brand:
  const newBrandRef = useRef();

  // add new Unit:
  const newUnitRef = useRef();
  const newFullNameRef = useRef();
  const newAllowDecimalRef = useRef();


  const handleKeyPress = (e, nextRef, prevRef) => {
    if (e.key === "Enter" && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }

    if (e.key === "Backspace" && e.target.value === "" && prevRef?.current) {
      e.preventDefault();
      prevRef.current.focus();
    }
  };

  //------------------------------ short cut keys-----------------------------------
  const handleShortcut = (e, openOverlayFunction) => {
    if (e.altKey && e.code === "KeyC") {
      e.preventDefault();
      openOverlayFunction();
    }
  };

  // ------------------------ image upload functions --------------------------
  const handlePrint = () => {
    window.print();
  };

  //  ---------------------------- handle submit and validation----------------------
  const validateForm = () => {
    let errorFields = [];

    // Product validation
    if (!brand?.trim()) errorFields.push("Brand");
    if (!productModel?.trim()) errorFields.push("Product Model");
    if (!subCategory?.trim()) errorFields.push("Sub-category");
    if (!productName?.trim()) errorFields.push("Product Name");
    if (!unit?.trim()) errorFields.push("Unit");

    // Ensure categories is a string before using .trim
    if (typeof categories === 'string' && !categories.trim()) {
      errorFields.push("Category");
    }

    if (!barcodeValue?.trim()) errorFields.push("Barcode");
    if (!description?.trim()) errorFields.push("Description");

    // Price validation
    if (!priceData.purchase_price || priceData.purchase_price <= 0) errorFields.push("Purchase Price");
    if (!priceData.sale_price || priceData.sale_price <= 0) errorFields.push("Sale Price");
    if (!priceData.min_sale_price || priceData.min_sale_price <= 0) errorFields.push("Minimum Sale Price");
    if (!priceData.mrp || priceData.mrp <= 0) errorFields.push("MRP");
    if (!priceData.hsn_sac_code) errorFields.push("HSN/SAC Code");
    if (!numericValue || !selectedSymbol) errorFields.push("Discount");

    // GST validation
    if (
      (newCategory.igst && newCategory.igst <= 0) ||
      (newCategory.cgst && newCategory.cgst <= 0) ||
      (newCategory.sgst && newCategory.sgst <= 0) ||
      (newCategory.cess && newCategory.cess <= 0)
    ) errorFields.push("GST values (IGST, CGST, SGST, Cess)");

    // Stock validation
    if (!stockData.opening_stock || stockData.opening_stock <= 0) errorFields.push("Opening Stock");
    if (!stockData.opening_stock_values || stockData.opening_stock_values <= 0) errorFields.push("Opening Stock Value");
    if (!stockData.low_stock_qty || stockData.low_stock_qty <= 0) errorFields.push("Low Stock Qty");
    if (!stockData.date) errorFields.push("Date");
    if (!stockData.location?.trim()) errorFields.push("Location");
    if (!stockData.supplier_name?.trim()) errorFields.push("supplier_name");

    // If there are any errors in the fields, show the first error message
    if (errorFields.length > 0) {
      toast.error(`${errorFields[0]} is required`);
      return false;
    }

    return true;
  };

  // ------------------------------------------------------------------------------------------------------------
  // ---------- common states:
  const [loading, setLoading] = useState({ isLoading: false, message: "" });
  const [successMsg, setSuccessMsg] = useState({ create: "", update: "" })
  const [triggerApi, setTriggerApi] = useState({ getApi: false })

  // ------------ product details:
  const [productData, setProductData] = useState({
    brand_name: "",
    product_model: "",
    subcategory_name: "",
    product_name: "",
    unit_name: "",
    category_name: "",
    bar_qr_code: "",
    description: "",
    image: null,
  });

  // ------------- price details:
  const [priceData, setPriceData] = useState({
    purchase_price: "",
    sale_price: "",
    min_sale_price: "",
    mrp: "",
    hsn_sac_code: "",
    discount: "",
  });

  // ------------ gst details:
  const [gstDetails, setGstDetails] = useState({
    igst: "",
    igst_price: "",
    cgst: "",
    cgst_price: "",
    sgst: "",
    sgst_price: "",
    cess: "",
    cess_price: "",
    total_amount: "",
  });

  // ------------ stock details:
  const [stockData, setStockData] = useState({
    opening_stock: "",
    opening_stock_values: "",
    low_stock_qty: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    supplier_name: "",
  });

  // For Location Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);

  // For Supplier Name Dropdown
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplierIndex, setSelectedSupplierIndex] = useState(-1);
  const [supplierList, setSupplierList] = useState([]);

  // -----------category:
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    igst: "",
    cgst: "",
    sgst: "",
  });
  const [dropdownCOpen, setDropdownCOpen] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState(categories || []);
  const [focusedCIndex, setFocusedCIndex] = useState(-1);
  const [showOverlayCategory, setShowOverlayCategory] = useState(false);

  // ----------subcategory:
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState({
    subcategory_name: "",
    category_id: "",
    hsn_sac_code: "",
  });


  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dropdownSOpen, setDropdownSOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showOverlaySubCategory, setShowOverlaySubCategory] = useState(false);

  // -------------- unit:
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [unit, setUnit] = useState(null);
  const [unitName, setUnitName] = useState("");
  const [unitFullName, setUnitFullName] = useState("");
  const [allowDecimal, setAllowDecimal] = useState("");

  const [dropdownUOpen, setDropdownUOpen] = useState(false);
  const [selectedUIndex, setSelectedUIndex] = useState(-1);
  const [showOverlayUnit, setShowOverlayUnit] = useState(false);

  // ------------ brand:
  const [newBrandName, setNewBrandName] = useState("");
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [dropdownBOpen, setDropdownBOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showOverlayBrand, setShowOverlayBrand] = useState(false);
  const [brand, setBrand] = useState(null);

  //  ------------ barcode 
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");

  // ------------ Barcode Length (Changeable):
  const barcodeLength = 11;

  // ------------ Store Used Barcodes:
  const usedBarcodes = new Set();

  // ------------------------- Discount Field States -------------------------
  const [numericValue, setNumericValue] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [dropdownDiscountOpen, setDropdownDiscountOpen] = useState(false);
  const [focusedDiscountIndex, setFocusedDiscountIndex] = useState(0);

  const arrowOptions = [
    { label: "Percentage", symbol: "%" },
    { label: "Price", symbol: "₹" },
  ];

  // --------------------------- common function -------------------------
  const handleInputChange = async (e) => {
    const { name, value, type, files } = e.target;
    let sanitizedValue = value;

    /* Handling Image Upload */
    if (type === "file") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductData((prevData) => ({
            ...prevData,
            image: reader.result,
            imageName: file.name,
            imageSize: (file.size / 1024).toFixed(2) + "KB",
          }));
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    /* Ensure ID fields are stored correctly */
    const idFields = ["brand_id", "category_id", "subcategory_id", "unit_id", "supplier_id"];
    if (idFields.includes(name)) {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value || "",
      }));
      return;
    }
    if (name === "supplier_id") {
      setProductData((prevData) => {
        const updatedData = { ...prevData, supplier_id: value || "" };
        console.log("Updated Supplier ID:", updatedData.supplier_id);
        return updatedData;
      });
      return;
    }
    
    
    /* Handling Numeric Fields */
    if (!["location", "supplier_name", "date"].includes(name)) {
      sanitizedValue = value.replace(/[^0-9.]/g, "");
    }

    /* Handling Discount Input */
    if (name === "discount") {
      const discountValue = value.replace(/[₹%]/g, "");
      if (/^\d{0,3}$/.test(discountValue)) {
        sanitizedValue = discountValue;
      } else {
        return;
      }
    }

    /* Update Product Data */
    setProductData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (["brand_name", "product_model", "subcategory_name"].includes(name)) {
        updatedData.product_name = [updatedData.brand_name, updatedData.product_model, updatedData.subcategory_name]
          .filter(Boolean)
          .join(" ");
      }
      return updatedData;
    });

    /* Update Price Data */
    if (["sale_price", "purchase_price", "discount", "min_sale_price", "mrp", "hsn_sac_code"].includes(name)) {
      setPriceData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    }

    /* Update Stock Data */
    if (["opening_stock", "opening_stock_values", "low_stock_qty", "date", "location", "supplier_name"].includes(name)) {
      setStockData((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    }

    /* Update GST Details */
    if (name === "igst") {
      setGstDetails((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    }

    /* API Calls After State Update */
    setTimeout(async () => {
      const updatedSalePrice = name === "sale_price" ? sanitizedValue : priceData.sale_price;
      const updatedIgst = name === "igst" ? sanitizedValue : gstDetails.igst;
      const updatedDiscount = name === "discount" ? sanitizedValue : priceData.discount;
      const updatedOpeningStock = name === "opening_stock" ? sanitizedValue : stockData.opening_stock;

      console.log("🔍 API Input Values:", { updatedSalePrice, updatedIgst, updatedDiscount, updatedOpeningStock });

      /* Call Tax Calculation API */
      if (updatedSalePrice !== "" && updatedIgst !== "" && updatedDiscount !== "") {
        try {
          console.log("✅ Calling Tax API with:", { updatedSalePrice, updatedIgst, updatedDiscount });

          const taxResult = await calculateTax(
            Number(updatedSalePrice),
            Number(updatedIgst),
            Number(updatedDiscount)
          );

          if (taxResult) {
            setGstDetails({
              igst: updatedIgst,
              igst_price: taxResult.IGST_value.toFixed(2),
              cgst: (updatedIgst / 2).toString(),
              cgst_price: taxResult.CGST_value.toFixed(2),
              sgst: (updatedIgst / 2).toString(),
              sgst_price: taxResult.SGST_value.toFixed(2),
              total_amount: taxResult.total.toFixed(2),
            });
          }
        } catch (error) {
          console.error("❌ Tax API call failed:", error);
        }
      }

      /* Call Opening Stock Calculation API */
      if (updatedSalePrice !== "" && updatedOpeningStock !== "") {
        try {
          console.log("✅ Calling Opening Stock API with:", { updatedSalePrice, updatedOpeningStock });

          const stockResult = await calculateOpeningStockValue(
            Number(updatedSalePrice),
            Number(updatedOpeningStock)
          );

          if (stockResult) {
            setStockData((prev) => ({
              ...prev,
              opening_stock_values: stockResult["openning_stock_value "]?.toFixed(2) || "0",
            }));
          }
        } catch (error) {
          console.error("❌ Opening Stock API call failed:", error);
        }
      }

    }, 200);
  };

  // -------------------------------- Barcode Function ------------------------------

  // ------------ Generate Unique Barcode:
  const generateUniqueBarcode = () => {
    let barcode;
    do {
      barcode = Math.floor(Math.random() * Math.pow(10, barcodeLength)).toString().padStart(barcodeLength, '0');
    } while (usedBarcodes.has(barcode));

    usedBarcodes.add(barcode);
    return barcode;
  };

  // ------------ Handle Overlay Toggle:
  const handleOverlayToggle = () => {
    let barcode = productData.bar_qr_code;

    if (!barcode) {
      barcode = generateUniqueBarcode();
      setProductData((prevData) => ({
        ...prevData,
        bar_qr_code: barcode,
      }));
    }

    setBarcodeValue(barcode);
    setOverlayVisible(!isOverlayVisible);
  };

  // ------------- Image Upload Function
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64Image = await convertFileToBase64(file);
        setProductData((prevData) => ({
          ...prevData,
          image: base64Image,
        }));
      } catch (error) {
        console.error("❌ Error converting file to Base64:", error);
      }
    }
  };

  // ------------ Cancel Image Function 
  const handleCancel = () => {
    setProductData((prevData) => ({
      ...prevData,
      image: null,
    }));
  };

  useEffect(() => {
    setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMsg((prevState) => ({ ...prevState, create: false, update: false }))
    }, 2000);

  }, [showSuccessMessage, successMsg?.create, successMsg?.update]);

  const handleDropdownKeyDown = (e) => {
    if (!filteredBrands || filteredBrands.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev === null || prev === -1 ? 0 : (prev + 1) % filteredBrands.length));
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev === null || prev === -1 ? filteredBrands.length - 1 : (prev - 1 + filteredBrands.length) % filteredBrands.length));
        break;

      case "Enter":
        e.preventDefault();
        if (selectedIndex !== null && selectedIndex >= 0 && selectedIndex < filteredBrands.length) {
          selectBrand(filteredBrands[selectedIndex]);
        }
        break;

      case "Escape":
        setDropdownBOpen(false);
        break;

      default:
        break;
    }
  };

  // ---------------------------- category field ---------------------------
  const fetchAllCategories = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails.access_token}`,
        },
      };
      const data = await fetchCategories(config);
      console.log("Fetched categories response:", data);

      if (data && data.all_stock && Array.isArray(data.all_stock)) {
        setCategories(data.all_stock);
        setFilteredCategories(data.all_stock);
        console.log("Updated categories:", data.all_stock);
      } else {
        console.error("Unexpected response format:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);

  const handleSearchCategories = (searchTerm) => {
    const filtered = categories.filter((cat) =>
      cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
    setDropdownCOpen(true);
  };

  const selectCategory = (category) => {
    setProductData((prevData) => ({
      ...prevData,
      category_name: category.category_name,
      category_id: category.id,
    }));

    setGstDetails((prev) => ({
      ...prev,
      igst: category.igst || "",
      cgst: category.cgst || "",
      sgst: category.sgst || "",
    }));

    setDropdownCOpen(false);
    setFocusedCIndex(-1);
  };

  // Handle Keyboard Navigation
  const handleKeyDownCategory = (e) => {
    if (!dropdownCOpen || filteredCategories.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedCIndex((prev) =>
          prev === filteredCategories.length - 1 ? 0 : prev + 1
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setFocusedCIndex((prev) =>
          prev <= 0 ? filteredCategories.length - 1 : prev - 1
        );
        break;

      case "Enter":
        e.preventDefault();
        if (focusedCIndex >= 0) selectCategory(filteredCategories[focusedCIndex]);
        break;

      case "Escape":
        setDropdownCOpen(false);
        break;

      default:
        break;
    }
  };

  const handleOpenOverlayCategory = () => setShowOverlayCategory(true);
  const handleCloseOverlayCategory = () => setShowOverlayCategory(false);

  const handleSubmitCategory = async () => {
    setLoading({ isLoading: true, message: "Adding category..." });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`,
      },
    };

    if (!newCategory.category_name.trim()) {
      alert("Category name is required!");
      setLoading({ isLoading: false, message: "" });
      return;
    }

    if (!newCategory.igst || isNaN(newCategory.igst) || newCategory.igst < 0) {
      alert("Valid IGST value is required!");
      setLoading({ isLoading: false, message: "" });
      return;
    }

    try {
      await addCategory(newCategory, config);
      setSuccessMsg((prev) => ({
        ...prev,
        update: "Category added successfully!",
      }));

      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories);
      setNewCategory({ category_name: "", igst: "", cgst: "", sgst: "" });
      setShowOverlayCategory(false);
    } catch (error) {
      console.error("Error adding category:", error);

      if (error.response) {
        console.error("Backend Response:", error.response.data);
        alert(`Failed to add category: ${error.response.data?.message || "Unknown error"}`);
      } else {
        alert("Failed to add category! Please try again.");
      }
    } finally {
      setLoading({ isLoading: false, message: "" });
    }
  };

  // ------------------------------ subcategory ----------------------------
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));

    fetchSubCategories()
      .then((data) => setSubCategories(data))
      .catch((error) => console.error(error));
  }, []);

  const handleKeyDown = (e) => {
    if (filteredSubCategories.length === 0) return;

    if (e.key === "ArrowDown") {
      setFocusedIndex((prev) => (prev < filteredSubCategories.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && focusedIndex !== -1) {
      handleSelectSubCategory(filteredSubCategories[focusedIndex]);
      setDropdownSOpen(false);
    }
  };

  const handleSearchSubCategory = (searchTerm) => {
    setProductData((prev) => ({ ...prev, subcategory_name: searchTerm, subcategory_id: "" }));

    if (!subCategories || !Array.isArray(subCategories.subCategory)) {
      console.error("subCategories is not an array", subCategories);
      return;
    }

    const filtered = subCategories.subCategory.filter((subCat) =>
      subCat.subcategory_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredSubCategories(filtered);
  };

  const handleSelectSubCategory = (selectedSubCategory) => {
    setProductData((prev) => ({
      ...prev,
      subcategory_name: selectedSubCategory.subcategory_name,
      subcategory_id: selectedSubCategory.subcategory_id,
      product_name: `${prev.brand_name} ${prev.product_model} ${selectedSubCategory.subcategory_name}`.trim(),
    }));

    setPriceData((prev) => ({
      ...prev,
      hsn_sac_code: selectedSubCategory.hsn_sac_code || "",
    }));

    setDropdownSOpen(false);
  };

  const handleOpenSubCategoryModal = () => setShowOverlaySubCategory(true);
  const handleCloseSubCategoryModal = () => setShowOverlaySubCategory(false);

  const handleSaveSubCategory = async () => {
    setLoading({ isLoading: true, message: "Adding subcategory..." });

    if (!newSubCategory?.subcategory_name?.trim()) {
      alert("Please enter a subcategory name.");
      setLoading({ isLoading: false, message: "" });
      return;
    }

    const payload = {
      subcategory_name: newSubCategory.subcategory_name?.trim(),
      category_id: newSubCategory.category_id,
      category_name: newSubCategory.category_name || null,
      hsn_sac_code: newSubCategory.hsn_sac_code || null,
    };

    const config = { headers: { "Content-Type": "application/json" } };

    try {
      const response = await addSubCategory(payload, config);
      console.log("Subcategory added successfully:", response);

      fetchSubCategories();
      setSuccessMsg((prev) => ({
        ...prev, update: "Subcategory added successfully!"
      }));

      setShowOverlaySubCategory(false);
    } catch (error) {
      console.error("Error adding subcategory:", error.response?.data || error.message);
      alert(`Failed to add subcategory! ${error.response?.data?.error || "Unknown error"}`);
    } finally {
      setLoading({ isLoading: false, message: "" });
    }
  };

  // ---------------------------------- unit -----------------------------
  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`,
      },
    };

    fetchUnits(config)
      .then((data) => {
        setUnits(data);
        setFilteredUnits(data);
      })
      .catch((error) => console.error(error));
  }, []);


  const handleKeyDownUnit = (e) => {
    if (!filteredUnits.length) return;

    if (e.key === "ArrowDown") {
      setSelectedUIndex((prevIndex) => (prevIndex + 1) % filteredUnits.length);
    } else if (e.key === "ArrowUp") {
      setSelectedUIndex((prevIndex) => (prevIndex - 1 + filteredUnits.length) % filteredUnits.length);
    } else if (e.key === "Enter" && selectedUIndex !== -1) {
      handleSelectUnit(filteredUnits[selectedUIndex]);
    }
  };

  const handleSearchUnits = (query) => {
    if (!query) {
      setFilteredUnits(units);
    } else {
      const filtered = units.filter((u) =>
        u.unit.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUnits(filtered);
    }
  };

  const handleSelectUnit = (selectedUnit) => {
    setUnit(selectedUnit);
    setProductData((prev) => ({
      ...prev,
      unit_name: selectedUnit.unit,
      unit_id: selectedUnit.id,
    }));
    setDropdownUOpen(false);
  };

  const handleOpenOverlayUnit = () => setShowOverlayUnit(true);
  const handleCloseOverlayUnit = () => setShowOverlayUnit(false);

  const handleSaveUnit = async (e) => {
    e.preventDefault();
    setLoading({ isLoading: true, message: "Adding unit..." });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`,
      },
    };

    const unitData = {
      unit: unitName,
      full_name: unitFullName,
      allow_decimal: allowDecimal === "Yes",
    };
    try {
      await addNewUnit(unitData, config);
      setSuccessMsg((prev) => ({ ...prev, update: "Unit added successfully!" }));

      fetchUnits(config);
      setShowOverlayUnit(false);
    } catch (error) {
      console.error("Error adding unit:", error);
      alert("Failed to add unit!");
    } finally {
      setLoading({ isLoading: false, message: "" });
    }
  };

  // ----------------------------- brand ----------------------------------------
  const fetchAllBrands = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails.access_token}`,
        },
      };
      const data = await getBrands(config);

      if (data && Array.isArray(data.brand)) {
        setBrands(data.brand);
        setFilteredBrands(data.brand);
      } else {
        console.error("Unexpected response format:", data);
        setBrands([]);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  useEffect(() => {
    fetchAllBrands();
  }, []);

  useEffect(() => {
    setFilteredBrands(brands);
  }, [brands]);

  const handleSearchBrands = (searchValue) => {

    if (!Array.isArray(brands)) {
      console.error("Brands is not an array:", brands);
      return;
    }

    if (!searchValue.trim()) {
      setFilteredBrands(brands);
      return;
    }

    const filtered = brands.filter((b) =>
      b.brand_name.toLowerCase().includes(searchValue.toLowerCase())
    );

    console.log("Filtered brands:", filtered);
    setFilteredBrands(filtered);
  };

  const selectBrand = (brand) => {
    setProductData((prevData) => ({
      ...prevData,
      brand_name: brand.brand_name,
      brand_id: brand.brand_id,
    }));
    setDropdownBOpen(false);
  };

  const handleOpenOverlayBrand = () => setShowOverlayBrand(true);
  const handleCloseOverlayBrand = () => setShowOverlayBrand(false);

  const handleSaveBrand = async () => {
    if (!newBrandName.trim()) {
      alert("Brand name cannot be empty");
      return;
    }

    setLoading({ isLoading: true, message: "Adding brand..." });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`,
      },
    };

    try {
      await addBrand(newBrandName, config);
      setSuccessMsg((prev) => ({ ...prev, update: "Brand added successfully!" }));

      fetchAllBrands();
      setShowOverlayBrand(false);
    } catch (error) {
      console.error("Error adding brand:", error);
      alert("Failed to add brand!");
    } finally {
      setLoading({ isLoading: false, message: "" });
    }
  };

  // -----------------------------------  price details  ----------------------------------------
  const handleKeyDownDiscount = (e) => {
    if (e.key === "Enter") {
      setSelectedSymbol(arrowOptions[focusedDiscountIndex].symbol);
      setDropdownDiscountOpen(false);
    } else if (e.key === "ArrowDown") {
      setFocusedDiscountIndex((prevIndex) => (prevIndex + 1) % arrowOptions.length);
    } else if (e.key === "ArrowUp") {
      setFocusedDiscountIndex(
        (prevIndex) => (prevIndex - 1 + arrowOptions.length) % arrowOptions.length
      );
    }
  };

  const handleDropdownSelection = (symbol) => {
    setSelectedSymbol(symbol);
    setDropdownDiscountOpen(false);
    setPriceData((prev) => ({
      ...prev,
      discount: numericValue ? `${numericValue}${symbol}` : "",
    }));
  };

  // ----------------------------------- stock details ------------------------------------
  // ---------------supplier name field:
  useEffect(() => {
    Supplierget(
      {},
      (response) => {
        if (response.data && Array.isArray(response.data.Supplier)) {
          // Store supplier objects with both name and id
          setSupplierList(response.data.Supplier);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      },
      (error) => console.error("Error fetching suppliers:", error)
    );
  }, []);
  
  // Handle supplier search
  const handleSearchSupplier = (searchValue) => {
    setStockData((prev) => ({ ...prev, supplier_name: searchValue, supplier_id: "" })); // Reset supplier_id when typing
  
    if (!searchValue.trim()) {
      setFilteredSuppliers([]);
      setSupplierDropdownOpen(false);
      return;
    }
  
    // Filter supplier objects based on supplier_name
    const filtered = supplierList.filter((supplier) =>
      supplier.supplier_name.toLowerCase().includes(searchValue.toLowerCase())
    );
    console.log("filtered",filtered);
    
  
    setFilteredSuppliers(filtered);
    setSupplierDropdownOpen(filtered.length > 0);
  };
  
  // Handle selecting a supplier from the dropdown
  const selectSupplier = (selectedSupplier) => {
    setStockData((prevData) => ({
      ...prevData,
      supplier_name: selectedSupplier.supplier_name,
      supplier_id: selectedSupplier.supplier_id, // Store supplier ID
    }));
    setSupplierDropdownOpen(false);
  }
 
  

  // Handle keyboard navigation in supplier dropdown
  const handleKeyDownSupplier = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedSupplierIndex((prev) =>
        prev < filteredSuppliers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedSupplierIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && selectedSupplierIndex >= 0) {
      selectSupplier(filteredSuppliers[selectedSupplierIndex]);
    }
  };

  // const handleLocationChange = (e) => {
  //   const value = e.target.value;
  //   setStockData((prev) => ({ ...prev, location: value }));

  //   // Filter Locations
  //   const filtered = locationList.filter((loc) =>
  //     loc.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setFilteredLocations(filtered);
  //   setDropdownOpen(true);
  // };

  // --------------------- save function-------------------
  const handleSave = async () => {
    console.log("Final image  before API call:", productData.image);
    if (!productData.image) {
      alert("image is required!");
      return;
    }
    
  
    const payload = {
      brand_id: productData.brand_id || "",
      category_id: productData.category_id || "",
      subcategory_id: productData.subcategory_id || "",
      unit_id: productData.unit_id || "",
      supplier_id: stockData.supplier_id, // Ensure this is always present
      product_model: productData.product_model || "",
      product_name: productData.product_name || "",
      bar_qr_code: productData.bar_qr_code || "",
      purchase_price: priceData.purchase_price || "0",
      sale_price: priceData.sale_price || "0",
      min_sale_price: priceData.min_sale_price || "0",
      mrp: priceData.mrp || "0",
      opening_stock: stockData.opening_stock || "0",
      opening_stock_values: stockData.opening_stock_values || "0",
      location: stockData.location || "",
      hsn_sac_code: priceData.hsn_sac_code || "0000",
      cgst: gstDetails.cgst || "0",
      cgst_price: gstDetails.cgst_price || "0",
      sgst: gstDetails.sgst || "0",
      sgst_price: gstDetails.sgst_price || "0",
      igst: gstDetails.igst || "0",
      igst_price: gstDetails.igst_price || "0",
      cess: gstDetails.cess || "0",
      cess_price: gstDetails.cess_price || "0",
      total_amount: gstDetails.total_amount || "0",
      discount: priceData.discount || "0",
      description: productData.description || "",
      img: productData.image || "",
      date: stockData.date || new Date().toISOString().split("T")[0],
      low_stock_qty: stockData.low_stock_qty || "0",
    };
  console.log("image path",payload);
  
    try {
      const response = await saveProductDetails(payload);
      console.log("Product details added successfully:", response);
  
    } catch (error) {
      console.error("Error adding product:", error.response?.data || error.message);
      alert(`Failed to add product! ${error.response?.data?.error || "Unknown error"}`);
    }
  };
  
  return (
    <div className="bg-white  h-full px-7 py-3  rounded shadow-md w-full font-sans mx-auto">
      {/* 
  {successMsg?.create &&
      <SuccessMessage onClose={handleModalClose} showMsg={successMsg?.create} content={"Brand details have been created successfully!"}/>
       } */}

      <div
        id="successOverlay"
        className={`fixed inset-0 flex items-center justify-center bg-black/30 z-50 ${successMessageVisible ? '' : 'hidden'
          }`}
      >
        <div className="bg-white rounded-md p-6  w-96 h-72  flex flex-col items-center gap-4 shadow-lg">
          <div className="w-18 h-18 flex-shrink-0 bg-gray-200 flex items-center justify-center rounded-full">
            <img src={successImage} alt="Success Logo" className="w-20 h-20" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-black text-3xl font-bold font-[Plus Jakarta Sans]">
              Success!
            </span>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-gray-500 text-base font-medium leading-6 font-[Plus Jakarta Sans]">
              Product added Successfully!
            </p>
            <p className="text-gray-500 text-base font-medium leading-6 font-[Plus Jakarta Sans]">
              Your item has been saved in the inventory
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Product</h2>

      {/*----------------------------------------------- Product Details Section ------------------------------------------*/}

      {/* Product Details Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

        {/* Brand */}
        <div className="relative">
          <div
            tabIndex={0}
            title="Alt + C"
            onKeyDown={(e) => handleShortcut(e, handleOpenOverlayBrand)}>
            <input
              type="text"
              placeholder=""
              name="brand_name"
              value={productData.brand_name}
              onChange={(e) => {
                setProductData({ ...productData, brand_name: e.target.value, brand_id: "" });
                handleInputChange(e);
                handleSearchBrands(e.target.value);
                setDropdownBOpen(true);
              }}
              ref={brandRef}
              onKeyDown={(e) => {
                handleKeyPress(e, productModelRef, null);
                if (dropdownBOpen) handleDropdownKeyDown(e);
              }}
              onFocus={() => setDropdownBOpen(true)}
              onBlur={() => setTimeout(() => setDropdownBOpen(false), 200)}
              className="peer w-full h-11 pl-4 pr-14 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
            />
            <label className="absolute left-3 -top-2 z-10 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
    peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
    peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
    peer-focus:bg-white"
            >
              Brand
            </label>

            <button
              className="absolute h-11 w-12 right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-[#593FA9] text-white rounded-r"
              onClick={handleOpenOverlayBrand}
            >
              <CirclePlus size={24} />
            </button>

            {dropdownBOpen && filteredBrands.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-10 max-h-40 overflow-auto">
                {filteredBrands.map((filteredBrand, index) => (
                  <li
                    key={filteredBrand.brand_id}
                    className={`px-4 py-2 text-sm cursor-pointer ${selectedIndex === index ? "bg-gray-200" : "hover:bg-gray-100"
                      }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onMouseDown={() => selectBrand(filteredBrand)}
                  >
                    {filteredBrand.brand_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ------------ Show overlay Brand : */}

        {showOverlayBrand && (
          <BrandModal
            handleSaveBrand={handleSaveBrand}
            newBrandName={newBrandName}
            setNewBrandName={setNewBrandName}
            handleModalClose={handleCloseOverlayBrand}
            content="Add New Brand"
          />
        )}

        {/* Product model */}
        <div className="relative">
          <input
            type="text"
            placeholder=""
            name="product_model"
            value={productData.product_model}
            onChange={handleInputChange}
            ref={productModelRef}
            onKeyDown={(e) => handleKeyPress(e, subCategoryRef, brandRef)}
            className="peer w-full  h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Product Model
          </label>
        </div>

        {/* Sub Category */}
        <div className="relative">
          <div
            tabIndex={0}
            title="Alt + C"
            onKeyDown={(e) => handleShortcut(e, handleOpenSubCategoryModal)}
          >
            <input
              type="text"
              placeholder=""
              name="subcategory_name"
              value={productData.subcategory_name || ""}
              onChange={(e) => {
                setProductData({ ...productData, subcategory_name: e.target.value, subcategory_id: "" });
                handleInputChange(e);
                handleSearchSubCategory(e.target.value);
                setDropdownSOpen(true);
              }}
              ref={subCategoryRef}
              onKeyDown={(e) => {
                handleKeyPress(e, productNameRef, subCategoryRef);
                handleKeyDown(e);
              }}
              onFocus={() => setDropdownSOpen(true)}
              onBlur={(e) => {
                setTimeout(() => {
                  if (!e.relatedTarget || !e.relatedTarget.closest(".subcategory-dropdown")) {
                    setDropdownSOpen(false);
                  }
                }, 200);
              }}
              className="peer w-full h-11 pl-4 pr-14 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
            />

            <label className="absolute left-3 -top-2 z-10 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
      peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
      peer-focus:bg-white"
            >
              Sub Category *
            </label>

            {/* Add Button */}
            <button
              type="button"
              className="absolute h-11 w-12 right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-[#593FA9] text-white rounded-r"
              onClick={handleOpenSubCategoryModal}
            >
              <CirclePlus size={24} />
            </button>

            {/* Dropdown */}
            {dropdownSOpen && filteredSubCategories.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-20 max-h-40 overflow-auto subcategory-dropdown">
                {filteredSubCategories.map((filteredSubCategory, index) => (
                  <li
                    key={filteredSubCategory.subcategory_id}
                    className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${index === focusedIndex ? "bg-gray-200" : ""
                      }`}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSubCategory(filteredSubCategory);
                    }}
                  >
                    {filteredSubCategory.subcategory_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* --------------Show Overlay Sub Category : */}
        {showOverlaySubCategory && (
          <SubCategoryModal
            handleSaveSubCategory={handleSaveSubCategory}
            content="Add New Sub Category"
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            newSubCategory={newSubCategory}
            setNewSubCategory={setNewSubCategory}

            handleModalClose={handleCloseSubCategoryModal}
            categories={categories}
          />
        )}

        {/* Product Name */}
        <div className="relative">
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={productData.product_name}
            onChange={handleInputChange}
            placeholder=" "
            ref={productNameRef}
            onKeyDown={(e) => handleKeyPress(e, unitRef, subCategoryRef)}
            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
          />
          <label
            htmlFor="product-name"
            className="absolute left-3 -top-2 font-normal text-sm text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
          >
            Product Name *
          </label>
        </div>

        {/* unit */}
        <div className="relative">
          <div
            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] flex items-center overflow-hidden text-sm focus-within:border-purpleCustom"
            tabIndex={0}
            title="Alt + C"
            onKeyDown={(e) => handleShortcut(e, handleOpenOverlayUnit)}
          >
            <input
              type="text"
              className="peer w-full h-11 rounded border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
              placeholder=""
              name="unit_name"
              value={productData.unit_name || ""}
              onChange={(e) => {
                setProductData({ ...productData, unit_name: e.target.value, unit_id: "" });
                handleInputChange(e);
                handleSearchUnits(e.target.value);
                setDropdownUOpen(true);
              }}
              ref={unitRef}
              onKeyDown={(e) => {
                handleKeyPress(e, categoryRef, productNameRef);
                if (dropdownUOpen) handleKeyDownUnit(e);
              }}
              onFocus={() => setDropdownUOpen(true)}
              onBlur={(e) => {
                setTimeout(() => {
                  if (!e.relatedTarget || !e.relatedTarget.closest(".unit-dropdown")) {
                    setDropdownUOpen(false);
                  }
                }, 200);
              }}
            />
            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
              Unit *
            </label>

            {/* Add Button */}
            <button
              type="button"
              className="h-11 w-14 flex items-center justify-center bg-[#593FA9] text-white"
              onClick={handleOpenOverlayUnit}
            >
              <CirclePlus size={24} />
            </button>

            {/* Dropdown Options */}
            {dropdownUOpen && filteredUnits.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-10 max-h-40 overflow-auto unit-dropdown">
                {filteredUnits.map((filteredUnit, index) => (
                  <li
                    key={filteredUnit.id}
                    className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${selectedUIndex === index ? "bg-gray-200" : ""
                      }`}
                    onMouseEnter={() => setSelectedUIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectUnit(filteredUnit);
                    }}
                  >
                    {filteredUnit.unit}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ---------------- Show Overlay Unit : */}
        {showOverlayUnit && (
          <UnitModal
            handleSaveUnit={handleSaveUnit}
            handleModalClose={handleCloseOverlayUnit}
            unitName={unitName}
            setUnitName={setUnitName}
            unitFullName={unitFullName}
            setUnitFullName={setUnitFullName}
            allowDecimal={allowDecimal}
            setAllowDecimal={setAllowDecimal}
          />
        )}

        {/* Category */}
        <div className="relative">
          <div
            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] flex items-center overflow-hidden text-sm focus-within:border-purpleCustom"
            tabIndex={0}
            title="Alt + C"
            onKeyDown={(e) => handleShortcut(e, handleOpenOverlayCategory)}
          >
            <input
              type="text"
              className="peer w-full h-11 rounded border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
              placeholder=""
              name="category_name"
              value={productData.category_name || ""}
              onChange={(e) => {
                setProductData({ ...productData, category_name: e.target.value, category_id: "" });
                handleInputChange(e);
                handleSearchCategories(e.target.value);
                setDropdownCOpen(true);
              }}
              onFocus={() => setDropdownCOpen(true)}
              onBlur={(e) => {
                setTimeout(() => {
                  if (!e.relatedTarget || !e.relatedTarget.closest(".category-dropdown")) {
                    setDropdownCOpen(false);
                  }
                }, 200);
              }}
              ref={categoryRef}
              onKeyDown={handleKeyDownCategory}
            />
            <label className="absolute left-3 -top-2 z-10 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
      peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
      peer-focus:bg-white"
            >
              Category *
            </label>

            {/* Add Button */}
            <button
              type="button"
              className="h-11 w-14 flex items-center justify-center bg-[#593FA9] text-white"
              onClick={handleOpenOverlayCategory}
            >
              <CirclePlus size={24} />
            </button>

            {/* Dropdown Options */}
            {dropdownCOpen && filteredCategories.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-10 max-h-40 overflow-auto category-dropdown">
                {filteredCategories.map((category, index) => (
                  <li
                    key={category.id}
                    className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${focusedCIndex === index ? "bg-gray-100" : ""
                      }`}
                    onMouseEnter={() => setFocusedCIndex(index)}
                    onMouseDown={() => selectCategory(category)}
                  >
                    {category.category_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Overlay Category Modal */}
        {showOverlayCategory && (
          <CategoryModal
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            content={"Add New Category"}
            handleModalClose={handleCloseOverlayCategory}
            handleSubmit={handleSubmitCategory}
          />
        )}

        {/* -------------------------- BarCode ------------------------------*/}
        <div className="relative">
          <div className="flex items-center justify-between w-full sm:w-[353px] h-11 px-2 rounded border border-[#c9c9cd] focus-within:border-purpleCustom">
            <input
              type="text"
              name="bar_qr_code"
              value={productData.bar_qr_code}
              onChange={handleInputChange}
              placeholder=""
              className="peer w-full rounded justify-start px-3 items-center inline-flex overflow-hidden text-sm focus:outline-none focus:border-purpleCustom"
            />
            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
              Bar/QR Code
            </label>
            <ScanBarcode onClick={handleOverlayToggle} className="cursor-pointer" size={22} />
          </div>

          {/* Overlay for Barcode */}
          {isOverlayVisible && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-[80%] max-w-md relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Barcode</h2>
                  <button onClick={handleOverlayToggle} className="text-gray-500 hover:text-gray-700">
                    <X size={22} />
                  </button>
                </div>

                {/* Barcode Display */}
                <div className="flex justify-center mb-4">
                  <Barcode id="barcode" value={barcodeValue} />
                </div>

                {/* Print Button */}
                <div className="flex justify-center items-center">
                  <button
                    onClick={handlePrint}
                    className="flex bg-purpleCustom text-white px-10 py-2 text-sm rounded-lg"
                  >
                    <Printer size={20} className="mr-2" /> Print Barcode
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="relative">
          <input
            type="text"
            placeholder=""
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            ref={descriptionRef}
            onKeyDown={(e) => handleKeyPress(e, imageUploadRef, barcodeRef)}
            className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Description
          </label>
        </div>

        {/* ------------------------------------------- Image Upload ----------------------------------------- */}
        <div className="relative">
          <div className="flex items-center justify-between px-4 pl-4 w-[353px] h-11 border-2 border-dashed bg-[#CDCED71A] border-gray-300 rounded">
            {/* Hidden input for file upload */}
            <input
              type="file"
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              onChange={handleInputChange}
            />

            {/* Content aligned to the left */}
            <div className="flex items-center">
              {/* ImagePlus icon */}
              {!productData.image && (
                <ImagePlus size={22} className="text-[#593FA9] mr-2" />
              )}

              {/* Display image preview or "Upload Image" text */}
              {productData.image ? (
                <img src={productData.image} alt="Preview" className="w-8 h-8 object-cover rounded" />
              ) : (
                <span className="text-gray-500">Upload Image</span>
              )}

              {/* Show the uploaded image name & size */}
              {productData.image && (
                <span className="ml-2 text-gray-500 truncate max-w-[200px]">
                  {productData.imageName} / {productData.imageSize}
                </span>
              )}
            </div>

            {/* Cancel button (X icon) aligned to the right */}
            {productData.image && (
              <X
                className="text-red-500 cursor-pointer"
                onClick={() => setProductData((prev) => ({ ...prev, image: null, imageName: "", imageSize: "" }))}
                size={20}
              />
            )}
          </div>
        </div>
      </div>

      {/*---------------------------------------------------------------------------------------------------------------------------
                                                         Pricing Details Section 
        ---------------------------------------------------------------------------------------------------------------------------*/}
      {/* Form Headings */}
      <div className="w-full flex items-center justify-left gap-4 my-6">
        <div
          onClick={() => setActiveForm('price')}
          className={`ml-2 w-1/6 text-center  pb-4 text-base font-semibold 
          ${activeForm === 'price' ?
              'text-purpleCustom border-b-2 border-b-purpleCustom'
              : 'text-[#C0C0C0]'}`}
        >
          Price Details
        </div>
        <div
          onClick={() => setActiveForm('stock')}
          className={`ml-2 w-1/6 text-center pb-4 text-base font-semibold 
          ${activeForm === 'stock' ?
              'text-purpleCustom border-b-2 border-b-purpleCustom'
              : 'text-[#C0C0C0]'}`}
        >
          Stock Details
        </div>
      </div>

      {activeForm === 'price' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Purchase Price */}
            <div className="relative">
              <div className="flex items-center">
                {priceData.purchase_price && (
                  <span className="absolute left-3 text-lg text-gray-600">₹</span>
                )}
                <input
                  type="number"
                  placeholder=""
                  name="purchase_price"
                  value={priceData.purchase_price}
                  onChange={handleInputChange}
                  ref={purchasePriceRef}
                  onKeyDown={(e) => handleKeyPress(e, salePriceRef, imageUploadRef)}
                  className={`peer w-full h-11 ${priceData.purchase_price ? 'pl-6' : 'px-4'} rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom`}
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Purchase Price *
                </label>
              </div>
            </div>

            {/* Sale Price */}
            <div className="relative">
              <div className="flex items-center">
                {priceData.sale_price && <span className="absolute left-3 text-lg text-gray-600">₹</span>}
                <input
                  type="number"
                  name="sale_price"
                  value={priceData.sale_price}
                  onChange={handleInputChange}
                  placeholder=" "
                  className={`peer w-full h-11 ${priceData.sale_price ? "pl-6" : "px-4"} rounded border border-gray-300 text-sm focus:outline-none focus:border-purple-500`}
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-gray-500 bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:-top-2 peer-focus:text-xs">
                  Sale Price *
                </label>
              </div>
            </div>

            {/* Min. Sale Price */}
            <div className="relative">
              <div className="flex items-center">
                {priceData.min_sale_price && (
                  <span className="absolute left-3 text-lg text-gray-600">₹</span>
                )}
                <input
                  type="number"
                  placeholder=""
                  name="min_sale_price"
                  value={priceData.min_sale_price}
                  onChange={handleInputChange}
                  ref={minSalePriceRef}
                  onKeyDown={(e) => handleKeyPress(e, mrpRef, salePriceRef)}
                  className={`peer w-full h-11 ${priceData.min_sale_price ? 'pl-6' : 'px-4'} rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom`}
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Min. Sale Price *
                </label>
              </div>
            </div>

            {/* M.R.P */}
            <div className="relative">
              <div className="flex items-center">
                {priceData.mrp && (
                  <span className="absolute left-3 text-lg text-gray-600">₹</span>
                )}
                <input
                  type="number"
                  placeholder=""
                  name="mrp"
                  value={priceData.mrp}
                  onChange={handleInputChange}
                  ref={mrpRef}
                  onKeyDown={(e) => handleKeyPress(e, hsnCodeRef, minSalePriceRef)}
                  className={`peer w-full h-11 ${priceData.mrp ? 'pl-6' : 'px-4'} rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom`}
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  M.R.P *
                </label>
              </div>
            </div>

            {/* HSN/SAC Code */}
            <div className="relative">
              <input
                type="text"
                placeholder=""
                name="hsn_sac_code"
                value={priceData.hsn_sac_code}
                onChange={handleInputChange}
                ref={hsnCodeRef}
                onKeyDown={(e) => handleKeyPress(e, discountRef, mrpRef)}
                className="peer w-full h-11 px-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
              />
              <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                HSN/SAC Code *
              </label>
            </div>

            {/* Discount */}
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="discount"
                  value={priceData.discount}
                  onChange={handleInputChange}
                  onFocus={() => setDropdownDiscountOpen(true)}
                  onBlur={() => setTimeout(() => setDropdownDiscountOpen(false), 200)}
                  className="peer w-full h-11 px-4 rounded border border-gray-300 text-sm focus:outline-none focus:border-purple-500"
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-gray-500 bg-white px-1">
                  Discount
                </label>

                <button
                  className="absolute h-11 w-12 right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-gray-200 text-gray-500 rounded-r"
                  onClick={() => setDropdownDiscountOpen(!dropdownDiscountOpen)}
                >
                  ▼
                </button>

                {dropdownDiscountOpen && (
                  <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-10 max-h-40 overflow-auto">
                    {arrowOptions.map((option, index) => (
                      <li
                        key={option.symbol}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${index === focusedDiscountIndex ? "bg-gray-200" : ""
                          }`}
                        onMouseDown={() => handleDropdownSelection(option.symbol)}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          {/*-----------------------------------------------------------------------------------------------------------------------
                                                                 GST Details Section
          ------------------------------------------------------------------------------------------------------------------------ */}
          {/* GST Details Section */}
{/* GST Details Section */}
<h3 className="text-lg font-semibold mb-2 text-gray-700">GST Details</h3>
<div className="grid lg:grid-cols-5 grid-cols-1 sm:grid-cols-2 gap-4">
{["igst", "cgst", "sgst", "cess"].map((tax) => (
  <div className="relative" key={tax}>
    <div className="flex items-center border border-[#c9c9cd] rounded h-11">
      <input
        id={tax} // Add id for label linking
        type="text"
        placeholder=" "
        name={tax}
        value={gstDetails[tax] ? gstDetails[tax] : ""}
        onChange={handleInputChange}
        className="w-1/2 pl-4 rounded-l text-sm focus:outline-none focus:border-purpleCustom"
        onFocus={(e) => e.target.nextSibling.nextSibling.classList.add("-top-2", "text-xs")}
        onBlur={(e) => {
          if (!e.target.value) {
            e.target.nextSibling.nextSibling.classList.remove("-top-2", "text-xs");
          }
        }}
      />

      {/* Vertical Divider */}
      <span className={`border-l h-full ${gstDetails[tax] ? "block" : "hidden"}`}></span>

      {/* GST Amount Display */}
      <span className="w-1/2 text-sm text-gray-600 px-3">
        {gstDetails[`${tax}_price`] ? `₹ ${gstDetails[`${tax}_price`]}` : ""}
      </span>
    </div>

    {/* Label with 'for' linking */}
    <label htmlFor={tax} // Linking label to input
      className={`absolute left-3 text-sm font-normal text-[#838383] bg-white px-1 transition-all ${
        gstDetails[tax] ? "-top-2 text-xs" : "top-3"
      }`}
    >
      {tax.toUpperCase()} %
    </label>
  </div>
))}

  {/* Total Amount Field */}
  <div className="relative">
    <input
      type="text"
      placeholder=" "
      value={gstDetails.total_amount}
      readOnly
      className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
    />
                <label className="absolute left-3 -top-2 text-sm font-normal text-gray-500 bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:-top-2 peer-focus:text-xs">
                Total Amount
    </label>
  </div>
</div>
</div>
      )}
      { /* ------------------------------------------------------------------------------------------------------------------------
                                                                Stock details
      ---------------------------------------------------------------------------------------------------------------------------*/}
      {activeForm === 'stock' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder=""
              name="opening_stock"
              value={stockData.opening_stock}
              onChange={handleInputChange}
              ref={openingStockRef}
              onKeyDown={(e) => handleKeyPress(e, OpeningStockValueRef, null)}
              className="peer w-full h-11 pl-4   rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
            />
            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
            >Opening Stock *</label>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder=""
              name="opening_stock_values"
              value={stockData.opening_stock_values}
              onChange={handleInputChange}
              ref={OpeningStockValueRef}
              onKeyDown={(e) => handleKeyPress(e, lowStockQtyRef, openingStockRef)}
              className="peer w-full h-11 pl-4   rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
            />
            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
            >Opening Stock Value *</label>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder=""
              name="low_stock_qty"
              value={stockData.low_stock_qty}
              ref={lowStockQtyRef}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyPress(e, dateRef, OpeningStockValueRef)}
              className="peer w-full h-11 pl-4   rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
            />
            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white"
            >Low Stock Qty *</label>
          </div>

          <div className="relative">
            <input
              type="date"
              placeholder=""
              name="date"
              value={stockData.date}
              ref={dateRef}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyPress(e, locationRef, lowStockQtyRef)}
              className="peer w-full h-11 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded"
            />
            <label className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
              Date
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              name="location"
              placeholder=" "
              value={stockData.location}
              // onChange={handleLocationChange}
              onChange={handleInputChange}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              className="peer w-full h-11 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded"
            />
            <label className="absolute left-3 -top-2 text-sm font-normal text-gray-500 bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:-top-2 peer-focus:text-xs">
              Location
            </label>

            {/* {dropdownOpen && filteredLocations.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-20 max-h-40 overflow-auto">
                {filteredLocations.map((location, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setStockData((prev) => ({ ...prev, location }));
                      setDropdownOpen(false);
                    }}
                  >
                    {location}
                  </li>
                ))}
              </ul>
            )} */}
          </div>

      {/* Supplier Name */}
<div className="relative">
  <input
    type="text"
    name="supplier_name"
    placeholder=" "
    value={stockData.supplier_name}
    onChange={(e) => {
      handleSearchSupplier(e.target.value);
      setSupplierDropdownOpen(true);
    }}
    onFocus={() => setSupplierDropdownOpen(true)}
    onBlur={() => setTimeout(() => setSupplierDropdownOpen(false), 200)}
    onKeyDown={handleKeyDownSupplier}
    className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
  />
  <label className="absolute left-3 -top-2 text-sm font-normal text-gray-500 bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:-top-2 peer-focus:text-xs">
    Supplier Name
  </label>

  {/* Dropdown */}
  {supplierDropdownOpen && filteredSuppliers.length > 0 && (
    <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-20 max-h-40 overflow-auto">
      {filteredSuppliers.map((supplier, index) => (
        <li
          key={supplier.supplier_id}
          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${index === selectedSupplierIndex ? "bg-gray-200" : ""}`}
          onMouseDown={(e) => {
            e.preventDefault();
            selectSupplier(supplier); // Pass selected supplier object
          }}
        >
          {supplier.supplier_name}
        </li>
      ))}
    </ul>
  )}
</div>
</div>

      )}
      {/* Button */}
      {activeForm === 'stock' && (
        <div className="mt-2 w-full flex justify-end">
          <button
            className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}

      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default AddProduct;

