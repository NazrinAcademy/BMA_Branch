import React, { useState, useEffect, useRef } from "react";
import Barcode from 'react-barcode';
import { addCategory, addSubCategory, getCategories, getBrands, addBrand, getSubCategories, addNewUnit, addProduct, savePriceDetails, updateStockData, addStockData, fetchStockData, getPriceDetails, fetchCategories, fetchSubcategoryBasedCategoryID } from "../../../apiService/AddProductAPI";
import { fetchUnits as fetchUnitsAPI } from "../../../apiService/AddProductAPI";
import { ImagePlus, X, CirclePlus, ChevronDown, ScanBarcode, Edit, Printer } from "lucide-react";
import successImage from '../../../assets/success.png'
import { getPersonalDetails } from "../../../apiService/PGapi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const AddProduct = () => {

  // -------------------------------  usestate ---------------------------------

  const [activeForm, setActiveForm] = useState('price');
  const { userDetails } = useSelector((state) => (state.auth))

  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const [categoryList,setCategoryList]=useState([])


  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    igst: "",
    cgst: "",
    sgst: "",
  });



  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([])
  const [newSubCategory, setNewSubCategory] = useState("");
  const [showOverlayCategory, setShowOverlayCategory] = useState(false);
  const [showOverlaySubCategory, setShowOverlaySubCategory] = useState(false);

  const [brands, setBrands] = useState([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [showOverlayBrand, setShowOverlayBrand] = useState(false);


  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState("");
  const [unitName, setUnitName] = useState("");
  const [unitFullName, setUnitFullName] = useState("");
  const [showOverlayUnit, setShowOverlayUnit] = useState(false);
  const [allowDecimal, setAllowDecimal] = useState("Yes");

  // Image state
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');

  // Bar code state
  const [barcodeValue, setBarcodeValue] = useState();
  const [isOverlayVisible, setOverlayVisible] = useState(false);


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

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //     setImageName(file.name);
  //   }
  // };

  // const handleCancel = () => {
  //   setImage(null);
  //   setImageName('');
  // };


  const handlePrint = () => {
    window.print();
  };


  // ------------F-------------- barcode function --------------------------

  const generateRandomBarcode = () => {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
  };

  const handleOverlayToggle = () => {
    if (!barcodeValue) {
      setBarcodeValue(generateRandomBarcode());
    }
    setOverlayVisible(!isOverlayVisible);
  };



  //----------------------  Handle opening and closing overlays ------------------------

  const handleOpenOverlayCategory = () => setShowOverlayCategory(true);
  const handleOpenOverlaySubCategory = () => setShowOverlaySubCategory(true);
  const handleOpenOverlayBrand = () => setShowOverlayBrand(true);
  const handleOpenOverlayUnit = () => setShowOverlayUnit(true);


  const handleCloseOverlay = () => {
    setShowOverlayCategory(false);
    setShowOverlaySubCategory(false);
    setShowOverlayBrand(false);
    setShowOverlayUnit(false);
    setNewCategory({id:"", categoryName: "", igst: "", cgst: "", sgst: "" });
    setNewSubCategory("");
    setNewBrandName("");
    setUnitName("");
  };

  //------------------ Handle input change for categories and subcategories -------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "igst") {
      const parsedValue = parseFloat(value) || 0;
      const halfValue = parsedValue / 2;
      setNewCategory((prevState) => ({
        ...prevState,
        igst: value,
        cgst: halfValue.toFixed(2),
        sgst: halfValue.toFixed(2),
      }));
    } else {
      setNewCategory((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // --------category get function:
  useEffect(() => {
    const loadCategories = async () => {
      const config = {
        headers: {
          "Content-Type": "application/jon",
          Authorization: `Bearer ${userDetails?.access_token}`,
        }
      }

      try {
        const data = await fetchCategories(config);
        console.log("data:", data)
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    loadCategories();
  }, []);



  // useEffect(() => {
  //   const fetchCategoriesOnLoad = async () => {
  //     try {
  //       const data = await getSubCategories();
  //       setSubCategories(data);
  //     } catch (error) {
  //       console.error("Failed to fetch categories:", error);
  //     }
  //   };

  //   fetchCategoriesOnLoad();
  // }, []);


  // Handle saving a new category

  const handleSaveCategory = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`,
      },
    };

    if (newCategory.categoryName && newCategory.igst) {
      try {
        const addedCategory = await addCategory(newCategory, config);
        setCategories((prev) => [...prev, addedCategory]);
        handleCloseOverlay();
      } catch (error) {
        console.error("Error adding category:", error);
        alert("Failed to add category. Please try again.");
      }
    } else {
      alert("All fields are required!");
    }
  };

   const getCategoriesData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails.access_token}`,
        },
      };
  
      try {
        const fetchedCategories = await fetchCategories(config);
        setCategoryList(fetchedCategories?.all_stock);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    useEffect(()=>{
      getCategoriesData()
    },[])

    const getSubCategoriesData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails.access_token}`,
        },
      };
  
      try {
        const fetchedCategories = await fetchSubcategoryBasedCategoryID(newCategory?.id,config);
        setSubCategoryList(fetchedCategories || []); 
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

useEffect(()=>{
  if(newCategory?.id){
  getSubCategoriesData()
  }
},[newCategory?.id])

  // Handle saving a new subcategory
  // const handleSaveSubCategory = async () => {
  //   if (selectedCategory && newSubCategory.trim()) {
  //     try {
  //       await addSubCategory(selectedCategory, newSubCategory);

  //       const updatedCategories = await getCategories();

  //       setCategories(updatedCategories);

  //       handleCloseOverlay();
  //     } catch (error) {
  //       console.error("Failed to add subcategory:", error);
  //       alert("Failed to add subcategory. Please try again.");
  //     }
  //   } else {
  //     alert("Please select a category and provide a subcategory name.");
  //   }
  // };

  // Handle saving a new subcategory with HSN/SAC code
  const handleSaveSubCategory = async () => {
    if (selectedCategory && newSubCategory.trim() && hsnSacCode) {
      try {
        const newSub = { name: newSubCategory, hsnCode: hsnSacCode };

        // Update category data
        const updatedCategories = categories.map(category =>
          category.id === selectedCategory
            ? {
              ...category,
              subCategories: [...category.subCategories, newSub]
            }
            : category
        );

        // Update categories state
        setCategories(updatedCategories);

        // Immediately update the search results to show the newly added subcategory
        handleSearchSubCategory(newSubCategory);

        // Call your API or addSubCategory function
        await addSubCategory(selectedCategory, newSubCategory, hsnSacCode);

        // Close the overlay after saving
        handleCloseOverlay();
      } catch (error) {
        console.error("Failed to add subcategory:", error);
        alert("Failed to add subcategory. Please try again.");
      }
    } else {
      alert("Please select a category, provide a subcategory name, and specify the HSN/SAC code.");
    }
  };

  // -------------------------------- functions to brand --------------------------------------

  // Fetch all brands
  const fetchBrands = async () => {
    const config = {
      headers: {
        "Content-Type": "application/jon",
        Authorization: `Bearer ${userDetails?.access_token}`,
      }
    }
    try {
      const brandList = await getBrands(config);
      console.log("brandlist:", brandList)
      setBrands(brandList?.brand);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };
  console.log("brandadata",imageName)

  useEffect(() => {
    fetchBrands();
  }, []);



  // Save a new brand
  const handleSaveBrand = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.access_token;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userDetails?.access_token}`
      }
    };

    const payload = {
      brand_name: newBrandName,
    };

    if (newBrandName.trim() !== "") {
      try {
        const newBrand = await addBrand(config, payload);
        if (newBrand?.data) {
          setBrands([...brands, newBrand.data]);
        }
        setNewBrandName("");
        await fetchBrands();
        handleCloseOverlay();
      } catch (error) {
        toast.error("Failed to save the brand. Please try again.");
      }
    } else {
      toast.error("Please provide a brand name.");
    }
  };
 
  // ------------------------------------------ functions to unit --------------------------

  // Fetch units and set state
  const fetchUnits = async () => {
    const config = {
      headers: {
        "Content-Type": "application/jon",
        Authorization: `Bearer ${userDetails?.access_token}`,
      }
    }
    try {
      const unitList = await fetchUnitsAPI(config);
      console.log("unitList:", unitList);
      setUnits(unitList.unit_all || []);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };
  console.log("unit-----",units)

  useEffect(() => {
    fetchUnits();
  }, []);

  // Save a new unit
  const handleSaveUnit = async () => {
    if (unitName.trim() !== "" && unitFullName.trim() !== "") {
      const newUnit = {
        unit: unitName,
        fullname: unitFullName,
        allow_decimal: allowDecimal === "yes",
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userDetails?.access_token}`
        }
      }
      try {
        const addedUnit = await addNewUnit(newUnit, config);
        setUnits([...units, addedUnit])
        setUnitName("");
        setUnitFullName("");
        setAllowDecimal("yes");
        await fetchUnits();
        handleCloseOverlay();
      } catch (error) {
        alert("Failed to save the unit. Please try again.");
      }
    } else {
      alert("Please provide all required fields.");
    }
  };

  // --------------------------------- handle submit --------------------------------


  useEffect(() => {
    if (successMessageVisible) {
      const timer = setTimeout(() => setSuccessMessageVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessageVisible]);


  // ---------------------------------- update product name -------------------------
  const [brand, setBrand] = useState('');
  const [productModel, setProductModel] = useState('');
  const [subCategory, setSubCategory] = useState({});
  const [productName, setProductName] = useState('');
  const [hsnSacCode, setHsnSacCode] = useState("");
  const [description, setDescription] = useState("");
  // const [image, setImage] = useState(null);
  // const [imageName, setImageName] = useState('');
  // const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  // Automatically update productName when brand, productModel, or subCategory change
  useEffect(() => {
    if (brand && productModel && subCategory) {
      setProductName(`${brand?.brand_name||""} ${productModel} ${subCategory?.subCategoryname||""}`);
    }
  }, [brand, productModel, subCategory]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the base64 image result
      };
      reader.readAsDataURL(file);
      setImageName(file.name); // Set image name
    }
  };

  console.log("image----",image)

  const handleCancel = () => {
    setImage(null);
    setImageName('');
  };


  // -------------------- dropdowns for brand, sub category, unit and category --------------------------



  const [dropdownBOpen, setDropdownBOpen] = useState(false);
  const [dropdownSOpen, setDropdownSOpen] = useState(false);
  const [dropdownUOpen, setDropdownUOpen] = useState(false);
  const [dropdownCOpen, setDropdownCOpen] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [subCategoryList,setSubCategoryList]=useState([])
console.log("filteredUnits",filteredUnits)
  // ---------filtered brand:
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSearchBrands = (searchText) => {
    setBrand((prevState)=>({...prevState,brand_name:searchText}));
    console.log("searchtext",searchText)
    if (searchText.trim() === "") {
      setFilteredBrands([]);
      setSelectedIndex(-1);
    } else {
      const filtered = brands.filter((b) =>
        b.brand_name.toLowerCase().startsWith(searchText.toLowerCase())
      );
      setFilteredBrands(filtered);
      setDropdownBOpen(true);
      setSelectedIndex(-1);
    }
  };
  console.log("filetereddd",filteredBrands)

  const handleSelectBrand = (selectedBrand) => {
    setBrand(selectedBrand);
    setDropdownBOpen(false);
    setSelectedIndex(-1);
  };

  // Keyboard navigation logic
  const handleDropdownKeyDown = (e) => {
    if (dropdownBOpen && filteredBrands.length > 0) {
      if (e.key === "ArrowDown") {

        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex < filteredBrands.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {

        e.preventDefault();
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredBrands.length - 1
        );
      } else if (e.key === "Enter" && selectedIndex !== -1) {
        e.preventDefault();
        handleSelectBrand(filteredBrands[selectedIndex].name);
      } else if (e.key === "Escape") {

        setDropdownBOpen(false);
        setSelectedIndex(-1);
      }
    }
  };

  //-------------- sub category filtered:
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleSearchSubCategory = (searchText) => {
    setSubCategory((prevState)=>({...prevState,subCategoryname:searchText}));

    if (searchText.trim() === "") {
      setFilteredSubCategories([]);
      setDropdownSOpen(false);
    } else {
      // Ensure categories is defined and contains valid data
      const allSubCategories = subCategories?.map((category) =>
        Array.isArray(category.subCategories)
          ? category.subCategories.map((sub) => ({
            name: sub.subCategoryname,
            hsnCode: sub.hsn_sac_code
          }))
          : []
      ) || [];

      const filtered = subCategoryList.filter((sub) =>
        sub.subCategoryname.toLowerCase().startsWith(searchText.toLowerCase())
      );

      setFilteredSubCategories(filtered);
      setDropdownSOpen(filtered.length > 0);
      setFocusedIndex(filtered.length > 0 ? 0 : -1);
    }
  };



  const handleSelectSubCategory = (selectedSubCategory) => {
    setSubCategory(selectedSubCategory);

    // Check if selectedSubCategory is an object and has hsnCode
    if (typeof selectedSubCategory === "object" && selectedSubCategory.hsnCode) {
      setPriceData((prevData) => ({
        ...prevData,
        hsnCode: selectedSubCategory.hsn_sac_code, // Auto-fill HSN/SAC Code
      }));
    }

    setDropdownSOpen(false);
  };




  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setFocusedIndex((prevIndex) => Math.min(prevIndex + 1, filteredSubCategories.length - 1));
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (e.key === "Enter" && focusedIndex !== -1) {
      handleSelectSubCategory(filteredSubCategories[focusedIndex]);
    }
  };


  //------------ units filtered:
  const [selectedUIndex, setSelectedUIndex] = useState(-1);

  const handleKeyDownUnit = (e) => {
    if (e.key === "ArrowDown") {
      if (selectedUIndex < filteredUnits.length - 1) {
        setSelectedUIndex((prevIndex) => prevIndex + 1);
      }
    }
    else if (e.key === "ArrowUp") {
      if (selectedUIndex > 0) {
        setSelectedUIndex((prevIndex) => prevIndex - 1);
      }
    }
    else if (e.key === "Enter" && selectedUIndex >= 0) {
      handleSelectUnit(filteredUnits[selectedUIndex].unit);
    }
  };
  const handleSearchUnits = (searchText) => {
    setUnit(searchText);
    if (searchText.trim() === "") {
      setFilteredUnits([]);
    } else {
      const filtered = units.filter((u) =>
        u.fullname.toLowerCase().startsWith(searchText.toLowerCase())
      );
      console.log("filtered-----",filtered)
      setFilteredUnits(filtered);
      setDropdownUOpen(true);
    }
    setSelectedUIndex(-1);
  };

  const handleSelectUnit = (selectedUnit) => {
    setUnit(selectedUnit);
    setDropdownUOpen(false);
    setSelectedUIndex(-1);
  };

  //----------------- category filtered:

  const [focusedCIndex, setFocusedCIndex] = useState(-1);

  const handleSearchCategories = (searchText) => {
    console.log("searchText",searchText)
    if (searchText.trim() === "") {
      setFilteredCategories([]);
    } else {
      const filtered = categoryList.filter((c) =>
        c.name.toLowerCase().includes(searchText.toLowerCase())
      );
      console.log("filtered categories",filtered)
      setFilteredCategories(filtered);
      setDropdownCOpen(true);
    }

    setNewCategory((prevState) => ({
      ...prevState,
      categoryName: searchText,
    }));
  };

  const handleKeyDownCategory = (e) => {
    if (e.key === "ArrowDown") {
      setFocusedCIndex((prevIndex) =>
        Math.min(filteredCategories.length - 1, prevIndex + 1)
      );
    } else if (e.key === "ArrowUp") {
      setFocusedCIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (e.key === "Enter" && focusedCIndex >= 0) {
      handleSelectCategory(filteredCategories[focusedCIndex]);
    }
  };

  // -------------------------------------------------------------------------
  //                                   Product Details Section               
  //--------------------------------------------------------------------------- 



  // ------------------------- discount field function -------------
  const [numericValue, setNumericValue] = useState(""); // Only numeric part
  const [selectedSymbol, setSelectedSymbol] = useState(""); // Symbol (% or ₹)
  const [dropdownDiscountOpen, setDropdownDiscountOpen] = useState(false);
  const [focusedDiscountIndex, setFocusedDiscountIndex] = useState(0); // Track the highlighted option

  // Mapping between dropdown labels and symbols
  const arrowOptions = [
    { label: "Percentage", symbol: "%" },
    { label: "Price", symbol: "₹" },
  ];

  // Handle key press events for dropdown navigation
  const handleKeyDownDiscount = (e) => {
    if (e.key === "Enter") {
      // Select the highlighted option
      setSelectedSymbol(arrowOptions[focusedDiscountIndex].symbol);
      setDropdownDiscountOpen(false);
    } else if (e.key === "ArrowDown") {
      // Navigate down in dropdown
      setFocusedDiscountIndex((prevIndex) => (prevIndex + 1) % arrowOptions.length);
    } else if (e.key === "ArrowUp") {
      // Navigate up in dropdown
      setFocusedDiscountIndex(
        (prevIndex) => (prevIndex - 1 + arrowOptions.length) % arrowOptions.length
      );
    }
  };

  const handleInputChangeDiscount = (e) => {
    const value = e.target.value.replace(/[₹%]/g, ""); // Remove symbols

    if (/^\d{0,3}$/.test(value)) {
      setNumericValue(value);
      setPriceData((prev) => ({
        ...prev,
        discount: selectedSymbol === "%" ? `${value}%` : `₹${value}`,
      }));
    }
  };


  // -------------------------------------------------------------------------
  //                                   GST Details Section               
  //--------------------------------------------------------------------------- 

  const handleSelectCategory = (selectedCategory) => {
    setNewCategory((prev) => {
      const updatedCategory = {
        ...prev,
        id:selectedCategory?.id,
        categoryName: selectedCategory.name,
        igst: selectedCategory.igst,
        cgst: selectedCategory.cgst,
        sgst: selectedCategory.sgst,
      };

      // Update priceData with new IGST and recalculate totalAmount
      setPriceData((prevPrice) => ({
        ...prevPrice,
        igst: selectedCategory.igst,
        totalAmount: calculateTotalAmount(prevPrice.salePrice, prevPrice.discount, selectedCategory.igst),
      }));

      return updatedCategory;
    });

    setDropdownCOpen(false);
  };



  // const fetchCategories = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/categories");
  //     const data = await response.json();
  //     setCategories(data);
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  const handleInputChangeGST = (e, field) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    value = value ? parseFloat(value) : "";

    setNewCategory((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update priceData with new IGST and recalculate totalAmount
    if (field === "igst") {
      setPriceData((prevPrice) => ({
        ...prevPrice,
        igst: value,
        totalAmount: calculateTotalAmount(prevPrice.salePrice, prevPrice.discount, value),
      }));
    }
  };

  // --------------------------- price details ----------------------------
  const [priceData, setPriceData] = useState({
    purchasePrice: "",
    salePrice: "",
    minSalePrice: "",
    mrp: "",
    hsnCode: "",
    discount: "",
    igst: "",  // Added IGST
    totalAmount: "" // Added Total Amount
  });


  const handleInputChangePrice = (e) => {
    const { name, value } = e.target;
    if (!isNaN(value) || value === "") {
      setPriceData(prevData => {
        const updatedData = {
          ...prevData,
          [name]: value
        };

        // Update total amount if salePrice, discount, or IGST changes
        if (name === "salePrice" || name === "discount" || name === "igst") {
          updatedData.totalAmount = calculateTotalAmount(updatedData.salePrice, updatedData.discount, updatedData.igst);
        }

        return updatedData;
      });
    }
  };


  // ---------------------------total amount field ------------------------------

  useEffect(() => {
    // Auto-fill IGST from selected category
    if (newCategory.igst) {
      setPriceData((prev) => ({
        ...prev,
        igst: newCategory.igst, // Auto-fill IGST
      }));
    }
  }, [newCategory.igst]); // Trigger when IGST changes

  useEffect(() => {
    // Auto-calculate total amount when salePrice or IGST changes
    const sale = parseFloat(priceData.salePrice) || 0;
    const tax = parseFloat(priceData.igst) || 0;
    const disc = parseFloat(priceData.discount) || 0;
    const total = ((sale - disc) * (tax / 100)).toFixed(2);

    setPriceData((prev) => ({
      ...prev,
      totalAmount: total ? `₹ ${total}` : "", // Format total
    }));
  }, [priceData.salePrice, priceData.discount, priceData.igst]); // ✅ Recalculate on changes


  const calculateTotalAmount = (salePrice, discount, igst) => {
    const sale = parseFloat(salePrice) || 0;
    const disc = parseFloat(discount) || 0;
    const tax = parseFloat(igst) || 0;

    const total = (sale - disc) * (tax / 100);
    return total ? `₹ ${total.toFixed(2)}` : "";
  };



  // -------------------------------------- stock details api functions -------------------------------------

  const [stockData, setStockData] = useState({
    openingStock: "",
    openingStockValue: "",
    lowStockQty: "",
    date: new Date().toISOString().split("T")[0], // Auto-fill current date
    location: "",
    supplier_name: "",
  });


  useEffect(() => {
    const getData = async () => {
      const data = await getPriceDetails();
      if (data.length > 0) {
        setPriceData({ salePrice: data[0]?.salePrice || "" }); // Ensure salePrice is available
      }
    };
    getData();
  }, []);


  useEffect(() => {
    const loadStockData = async () => {
      const data = await fetchStockData();
      if (data.length > 0) {
        setStockData({
          openingStock: "",
          openingStockValue: "",
          lowStockQty: "",
          date: new Date().toISOString().split("T")[0], // Set current date
          location: "",
          supplier_name: "",
        }); // Ensure default empty values
      }
    };
    loadStockData();
  }, []);

  useEffect(() => {
    if (priceData.salePrice && stockData.openingStock) {
      setStockData((prev) => ({
        ...prev,
        openingStockValue: (priceData.salePrice * prev.openingStock).toFixed(2),
      }));
    }
  }, [priceData.salePrice, stockData.openingStock]);

  const [personalDetails, setPersonalDetails] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getPersonalDetails(); // API call from api.js
        setPersonalDetails(data);
      } catch (error) {
        console.error("Failed to fetch personal details:", error);
      }
    };

    fetchDetails();
  }, []);

  const handleSearchLocation = (searchText) => {
    console.log("Search Text:", searchText);
    setStockData((prev) => ({ ...prev, location: searchText }));

    if (searchText.trim() === "") {
      setFilteredLocations([]);
      setDropdownOpen(false);
    } else {
      const filtered = personalDetails
        .map((person) => person.company_name || "") // Handle undefined values
        .filter((company_name) =>
          company_name.toLowerCase().startsWith(searchText.toLowerCase())
        );

      console.log("Filtered Locations:", filtered);
      setFilteredLocations(filtered);
      setDropdownOpen(filtered.length > 0);
    }
  };


  const handleChangeStock = (e) => {
    const { name, value } = e.target;

    setStockData((prevStockData) => {
      let updatedStockData = { ...prevStockData, [name]: value };

      // Opening Stock Value Calculation (Auto-Fill)
      if (name === "openingStock" || name === "salePrice") {
        updatedStockData.openingStockValue =
          priceData.salePrice && updatedStockData.openingStock
            ? (priceData.salePrice * updatedStockData.openingStock).toFixed(2)
            : "";
      }

      return updatedStockData;
    });

    // Autocomplete Logic for Location
    if (name === "location") {
      handleSearchLocation(value);
    }
  };

  const handleKeyDownLocation = (e) => {
    if (filteredLocations.length === 0) return;

    if (e.key === "ArrowDown") {
      // Move Down
      setSelectedIndex((prev) => (prev < filteredLocations.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      // Move Up
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredLocations.length - 1));
    } else if (e.key === "Enter") {
      // Select Item
      if (selectedIndex !== -1) {
        setStockData((prev) => ({ ...prev, location: filteredLocations[selectedIndex] }));
        setDropdownOpen(false);
      }
    }
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
    if (!priceData.purchasePrice || priceData.purchasePrice <= 0) errorFields.push("Purchase Price");
    if (!priceData.salePrice || priceData.salePrice <= 0) errorFields.push("Sale Price");
    if (!priceData.minSalePrice || priceData.minSalePrice <= 0) errorFields.push("Minimum Sale Price");
    if (!priceData.mrp || priceData.mrp <= 0) errorFields.push("MRP");
    if (!priceData.hsnCode) errorFields.push("HSN/SAC Code");
    if (!numericValue || !selectedSymbol) errorFields.push("Discount");

    // GST validation
    if (
      (newCategory.igst && newCategory.igst <= 0) ||
      (newCategory.cgst && newCategory.cgst <= 0) ||
      (newCategory.sgst && newCategory.sgst <= 0) ||
      (newCategory.cess && newCategory.cess <= 0)
    ) errorFields.push("GST values (IGST, CGST, SGST, Cess)");

    // Stock validation
    if (!stockData.openingStock || stockData.openingStock <= 0) errorFields.push("Opening Stock");
    if (!stockData.openingStockValue || stockData.openingStockValue <= 0) errorFields.push("Opening Stock Value");
    if (!stockData.lowStockQty || stockData.lowStockQty <= 0) errorFields.push("Low Stock Qty");
    if (!stockData.date) errorFields.push("Date");
    if (!stockData.location?.trim()) errorFields.push("Location");
    if (!stockData.supplier_name?.trim()) errorFields.push("supplier_name");

    // If there are any errors in the fields, show the first error message
    if (errorFields.length > 0) {
      toast.error(`${errorFields[0]} is required`);
      return false;
    }

    // If no errors, return true (form is valid)
    return true;
  };

  // submit function:


  console.log("addproduct", brand,
    productModel,
    subCategory,
    productName,
    barcodeValue,
    description,
    unit,
    categories,
    )

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate form data before submitting
    // if (!validateForm()) return;

    // Construct new product object
    const newProduct = {
      brand,
      productModel,
      subCategory,
      productName,
      barcodeValue,
      description,
      unit,
      categories,
      image: image // Base64 image data
    };

    const Payload={
      "customer_Id": 123,
      "brand": brand?.brand_id,
      "category": newCategory?.id,
      "subcategory": subCategory?.subCategory_Id,
      "product_name": productName,
      "unit": unit?.id,
      "bar_oq_code": barcodeValue,
      "description": description,
      "product_model": productModel,
      "igst":priceData.igst ,
      // "igstprice": priceData?.i,
      "cgst":newCategory?.cgst,
      // "cgstprice": 3600.00,
      "sgst": newCategory?.sgst,
      // "sgstprice": 3600.00,
      "cess": newCategory?.cess,
      "cessprice": 400.00,
      "totalamount": priceData?.totalAmount,
      image:image,
  
      "purchaseprice": priceData?.purchasePrice,
      "saleprice":priceData?.salePrice,
      "min_sale_price": priceData?.minSalePrice,
      "mrp": priceData?.mrp,
      "hsn_sac_code": priceData?.hsnCode,
      "discount":priceData?.discount,
  
      "opening_stock": stockData?.openingStock,
      "opening_stock_values": stockData?.openingStockValue,
      "low_stock_qty":stockData?.lowStockQty,
      "date": stockData?.date,
      "location": stockData?.location
  }

  console.log("payload----",Payload)
    try {
      await addProduct(newProduct);
      await savePriceDetails(priceData);
      await addStockData(stockData);

      setSuccessMessageVisible(true);

    } catch (error) {
      toast.error("Failed to save product!");
      console.error("Error saving product:", error);
    }
  };

  // -----------------------------------------------------------
  return (
    <div className="bg-white -h-2xl px-7 py-3 rounded shadow-md w-full max-w-6xl font-sans mx-auto">

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

      {/*--------------------///--------------------------- Product Details Section ------------------------------------------*/}

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
              ref={brandRef}
              value={brand?.brand_name}
              onKeyDown={(e) => {
                handleKeyPress(e, productModelRef, null);

                if (dropdownBOpen) handleDropdownKeyDown(e);
              }}
              onChange={(e) => handleSearchBrands(e.target.value)}
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

            {/* Add Button (CirclePlus Icon inside the input) */}
            <button
              className="absolute h-11 w-12 right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-[#593FA9] text-white rounded-r"
              onClick={handleOpenOverlayBrand}
            >
              <CirclePlus size={24} />
            </button>

            {/* Dropdown Options */}
            {dropdownBOpen && filteredBrands.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-10 max-h-40 overflow-auto">
                {filteredBrands.map((filteredBrand, index) => (
                  <li
                    key={filteredBrand.brand_id
                    }
                    className={`px-4 py-2 text-sm cursor-pointer ${selectedIndex === index ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    onMouseDown={() => handleSelectBrand(filteredBrand)}
                  >
                    {filteredBrand.brand_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>


        {/* ------------------------------------------ Show overlay Brand --------------------------------------------- */}
        {showOverlayBrand && (
          <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
            <div className="bg-white overflow-hidden rounded-lg w-[692px] h-56 px-7 py-6">
              <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
                Add New Brand
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder=""
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                  />
                  <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                    Brand Name
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleCloseOverlay}
                  className="border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBrand}
                  className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product model */}
        <div className="relative">
          <input
            type="text"
            placeholder=""
            ref={productModelRef}
            onKeyDown={(e) => handleKeyPress(e, subCategoryRef, brandRef)}

            value={productModel}
            onChange={(e) => setProductModel(e.target.value)}
            className="peer w-full sm:w-[353px] h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Product Model
          </label>
        </div>

{console.log("subCategory",subCategory)}
        {/* Sub Category Dropdown */}
        <div className="relative">
          <div
            tabIndex={0}
            title="Alt + C"
            onKeyDown={(e) => handleShortcut(e, handleOpenOverlaySubCategory)}
          >
            <input
              type="text"
              placeholder=""
              value={subCategory.subCategoryname }
              ref={subCategoryRef}
              onKeyDown={(e) => {
                handleKeyPress(e, productNameRef, productModelRef);
                if (dropdownSOpen) handleKeyDown(e);
              }}
              onChange={(e) => handleSearchSubCategory(e.target.value)}
              onFocus={() => setDropdownSOpen(true)}
              onBlur={() => setTimeout(() => setDropdownSOpen(false), 200)}
              className="peer w-full h-11 pl-4 pr-14 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
            />

            <label className="absolute left-3 -top-2 z-10 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
      peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
      peer-focus:bg-white"
            >
              Sub Category *
            </label>

            {/* Add button */}
            <button
              className="absolute h-11 w-12 right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-[#593FA9] text-white rounded-r"
              onClick={handleOpenOverlaySubCategory}
            >
              <CirclePlus size={24} />
            </button>

            {/* Dropdown */}
            {dropdownSOpen && filteredSubCategories.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-20 max-h-40 overflow-auto">
                {filteredSubCategories.map((filteredSubCategory, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${index === focusedIndex ? "bg-gray-200" : ""}`}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                      handleSelectSubCategory(filteredSubCategory);
                    }}
                  >
                    {filteredSubCategory.subCategoryname || filteredSubCategory} {/* Display the name */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* -------------------------------------------- Show Overlay Sub Category ---------------------------------------- */}
        {showOverlaySubCategory && (
          <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
            <div className=" bg-white  overflow-hidden rounded-lg w-[692px] h-72 px-7 py-6">
              {/* Centered Heading */}
              <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
                Add New Sub Category
              </h3>

              {/* 2x2 Grid for Input Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative col-span-2">
                  <label
                    className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 z-10 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
      peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                  >
                    Category
                  </label>
                  <div className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] flex items-center overflow-hidden text-sm focus-within:border-purpleCustom">
                    <select className="peer w-full h-11 px-2 text-sm focus:outline-none appearance-none pr-8"
                      value={selectedCategory}
                      ref={newCategorySelectRef}
                      onKeyDown={(e) => handleKeyPress(e, newSubCategoryRef, null)}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.categoryName}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>

                    {/* ChevronDown Icon */}
                    <ChevronDown
                      size={20}
                      className="absolute right-3 text-gray-500 pointer-events-none"
                    />
                  </div>
                </div>


                <div className="relative">
                  <input
                    type="text"
                    placeholder=""
                    value={newSubCategory}
                    ref={newSubCategoryRef}
                    onKeyDown={(e) => handleKeyPress(e, newHsnSacRef, newCategorySelectRef)}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                  />
                  <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                    Sub Category *
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder=""
                    name="hsnSacCode"
                    value={hsnSacCode}
                    ref={newHsnSacRef}
                    onKeyDown={(e) => handleKeyPress(e, null, newSubCategoryRef)}
                    onChange={(e) => setHsnSacCode(e.target.value)}
                    className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                  />
                  <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                    HSN/SAC Code
                  </label>
                </div>

              </div>

              {/* Buttons aligned to the right */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleCloseOverlay}
                  className=" border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSubCategory}
                  className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Product Name */}
        <div className="relative">
          <input
            type="text"
            id="product-name"
            placeholder=" "
            value={productName}
            onChange={(e) => setProductName(e.target.value)} // Editable field

            ref={productNameRef}
            onKeyDown={(e) => handleKeyPress(e, unitRef, subCategoryRef)}
            className="peer w-full sm:w-[353px] h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
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
          <div className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] flex items-center overflow-hidden text-sm focus-within:border-purpleCustom"
            tabIndex={0}
            title="Alt + C"
            onKeyDown={(e) => handleShortcut(e, handleOpenOverlayUnit)}>

            {/* Input Field */}
            <input
              type="text"
              className="peer w-full h-11 rounded  border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
              placeholder=""
              ref={unitRef}
              value={unit?.fullname}
              onKeyDown={(e) => {
                handleKeyPress(e, categoryRef, productNameRef);

                if (dropdownUOpen) handleKeyDownUnit(e);
              }}
              onChange={(e) => handleSearchUnits(e.target.value)}
              onFocus={() => setDropdownUOpen(true)}
              onBlur={() => setTimeout(() => setDropdownUOpen(false), 200)}
            />

            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
              Unit *
            </label>



            {/* ChevronDown Icon */}
            {/* <ChevronDown
              size={20}
              className="absolute right-16 text-[#838383] pointer-events-none"
            /> */}

            {/* Add Button */}
            <button
              className="h-11 w-14 flex items-center justify-center bg-[#593FA9] text-white"
              onClick={handleOpenOverlayUnit}
            >
              <CirclePlus size={24} />
            </button>

            {/* Dropdown Options */}
            {dropdownUOpen && filteredUnits.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-10 max-h-40 overflow-auto">
                {filteredUnits.map((filteredUnit, index) => (
                  <li
                    key={filteredUnit.id}
                    className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${selectedUIndex === index ? 'bg-gray-200' : ''}`}
                    onMouseDown={() => handleSelectUnit(filteredUnit)}
                    onMouseEnter={() => setSelectedUIndex(index)}
                  >
                    {filteredUnit.fullname}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* -------------------------------------------- Show Overlay Unit --------------------------------------------------*/}
        {showOverlayUnit && (
          <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
            <div className="bg-white overflow-hidden rounded-lg w-[692px] h-72 px-7 py-6">
              <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
                Add New Unit
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Unit Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={unitName}
                    ref={newUnitRef}
                    onKeyDown={(e) => handleKeyPress(e, newFullNameRef, null)}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder=""
                    className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                  />
                  <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                    Unit * (Kg.Pcs)
                  </label>
                </div>

                {/* Unit Full Name */}
                <div className="relative">
                  <input
                    type="text"
                    value={unitFullName}
                    ref={newFullNameRef}
                    onKeyDown={(e) => handleKeyPress(e, newAllowDecimalRef, newUnitRef)}
                    onChange={(e) => setUnitFullName(e.target.value)}
                    placeholder=""
                    className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                  />
                  <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                    Full Name * (Kilogram)
                  </label>
                </div>

                {/* Allow Decimal */}
                <div className="relative col-span-2">
                  <label className="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1 z-10 transition-all">
                    Allow Decimal (0.5)
                  </label>
                  <div className="relative flex items-center">
                    <select
                      className="peer w-full h-11 pl-4 pr-8 rounded border border-gray-400 appearance-none focus:border-purpleCustom focus:ring-1 focus:ring-purpleCustom text-sm focus:outline-none"
                      value={allowDecimal}
                      ref={newAllowDecimalRef}
                      onKeyDown={(e) => handleKeyPress(e, null, newFullNameRef)}
                      onChange={(e) => setAllowDecimal(e.target.value)}
                    >
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                    <ChevronDown
                      size={20}
                      className="absolute right-3 text-gray-500 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleCloseOverlay}
                  className="border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUnit}
                  className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}




        {/* Category */}
        <div className="relative">

          <div className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] flex items-center overflow-hidden text-sm focus-within:border-purpleCustom"
            tabIndex={0}
            title="Alt + C"
            onKeyDown={(e) => handleShortcut(e, handleOpenOverlayCategory)}>

            {/* Input Field */}
            {console.log("newCategory.categoryName",newCategory.categoryName)}
            <input
              type="text"
              className="peer w-full h-11 rounded border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
              placeholder=""
              ref={categoryRef}
              value={newCategory.categoryName}
              onChange={(e) => handleSearchCategories(e.target.value)}
              onFocus={() => setDropdownCOpen(true)}
              onBlur={() => setTimeout(() => setDropdownCOpen(false), 200)}
              onKeyDown={(e) => {
                handleKeyPress(e, barcodeRef, unitRef);

                if (dropdownCOpen) handleKeyDownCategory(e);
              }}
            />


            <label
              className="absolute left-3 -top-2 z-10 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
      peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
      peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
      peer-focus:bg-white"
            >
              Category *
            </label>


            {/* ChevronDown Icon */}
            {/* <ChevronDown
              size={24}
              className="absolute right-16 text-[#838383] pointer-events-none"
            /> */}

            {/* Add Button */}
            <button
              className="h-11 w-14 flex items-center justify-center bg-[#593FA9] text-white"
              onClick={handleOpenOverlayCategory}
            >
              <CirclePlus size={24} />
            </button>

            {/* Dropdown Options */}
            {dropdownCOpen && filteredCategories.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-10 max-h-40 overflow-auto">
                {filteredCategories.map((filteredCategory, index) => (
                  <li
                    key={filteredCategory.id}
                    className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${focusedCIndex === index ? 'bg-gray-100' : ''
                      }`} // Highlight the selected item
                    onMouseDown={() => handleSelectCategory(filteredCategory)} // Pass the entire category object
                  >
                    {filteredCategory.name} {/* Display categoryName */}
                  </li>
                ))}
              </ul>

            )}

          </div>
        </div>


        {/*----------------------------------------Show overlay Category --------------------------------------------*/}
        {showOverlayCategory && (
          <div className="fixed inset-0 z-50 flex pt-5 justify-center bg-black bg-opacity-50">
            <div className="bg-white overflow-hidden rounded-lg w-[692px] h-72 px-7 py-6">
              <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">
                Add New Category
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {["categoryName", "igst", "cgst", "sgst"].map((field) => (
                  <div key={field} className="relative">
                    <input
                      type={field === "categoryName" ? "text" : "number"}
                      name={field}
                      value={newCategory[field]}
                      onChange={(e) => handleInputChange(e, field)}
                      placeholder=""
                      className="peer w-full h-11 pl-4 pr-8 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                    />
                    <label
                      className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] 
              peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] 
              peer-focus:bg-white"
                    >
                      {field.toUpperCase()} {field === "categoryName" ? "*" : ""}
                    </label>
                    {field !== "categoryName" && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        %
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={handleCloseOverlay}
                  className="border-[1px] border-purpleCustom font-semibold px-12 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}


        {/* ---------------------------------------- BarCode ------------------------------------------------ */}
        {/* BarCode */}
        <div className="relative">
          <div className="flex items-center justify-between w-full sm:w-[353px] h-11 px-2 rounded border border-[#c9c9cd] focus-within:border-purpleCustom">

            <input
              type="text"
              value={barcodeValue}
              ref={barcodeRef}
              onKeyDown={(e) => handleKeyPress(e, descriptionRef, categoryRef)}
              onChange={(e) => setBarcodeValue(e.target.value)}
              placeholder=""
              className="peer rounded justify-start px-3 items-center inline-flex overflow-hidden text-sm focus:outline-none focus:border-purpleCustom"
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
                {/* Header: Barcode heading and cancel icon */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Barcode</h2>
                  <button
                    onClick={handleOverlayToggle}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Barcode display */}
                <div className="flex justify-center mb-4">
                  <Barcode id="barcode" value={barcodeValue} />
                </div>

                {/* Overlay controls */}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            ref={descriptionRef}
            onKeyDown={(e) => handleKeyPress(e, imageUploadRef, barcodeRef)}
            className="peer w-full sm:w-[353px] h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
          />
          <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
            Description
          </label>
        </div>



        {/* ------------------------------------------- image upload ----------------------------------------- */}

        <div className="relative">
          <div className="flex items-center justify-between px-4 pl-4 w-[353px] h-11 border-2 border-dashed bg-[#CDCED71A] border-gray-300 rounded">
            {/* Hidden input for file upload */}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              ref={imageUploadRef}
              onKeyDown={(e) => handleKeyPress(e, purchasePriceRef, descriptionRef)}
              onChange={handleImageUpload}
            />

            {/* Content aligned to the left */}
            <div className="flex items-center">
              {/* ImagePlus icon */}
              {!image && (
                <ImagePlus size={22} className="text-[#593FA9] mr-2" />
              )}

              {/* Display image preview or "Upload Image" text */}
              {image ? (
                <img src={image} alt="Preview" className="w-8 h-8 object-cover rounded" />
              ) : (
                <span className="text-gray-500">Upload Image</span>
              )}

              {/* Show the uploaded image name */}
              {image && (
                <span className="ml-2 text-gray-500 truncate max-w-[200px]">{imageName}</span>
              )}
            </div>

            {/* Cancel button (X icon) aligned to the right */}
            {image && (
              <X
                className="text-red-500 cursor-pointer" // Red cancel icon
                onClick={handleCancel}
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
                {priceData.purchasePrice && (
                  <span className="absolute left-3 text-lg text-gray-600">₹</span>
                )}
                <input
                  type="number"
                  placeholder=""
                  name="purchasePrice"
                  value={priceData.purchasePrice}
                  onChange={handleInputChangePrice}
                  ref={purchasePriceRef}
                  onKeyDown={(e) => handleKeyPress(e, salePriceRef, imageUploadRef)}
                  className={`peer w-full h-11 ${priceData.purchasePrice ? 'pl-6' : 'px-4'} rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom`}
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Purchase Price *
                </label>
              </div>
            </div>

            {/* Sale Price */}
            <div className="relative">
              <div className="flex items-center">
                {priceData.salePrice && (
                  <span className="absolute left-3 text-lg text-gray-600">₹</span>
                )}
                <input
                  type="number"
                  placeholder=""
                  name="salePrice"
                  value={priceData.salePrice}
                  onChange={handleInputChangePrice}
                  ref={salePriceRef}
                  onKeyDown={(e) => handleKeyPress(e, minSalePriceRef, purchasePriceRef)}
                  className={`peer w-full h-11 ${priceData.salePrice ? 'pl-6' : 'px-4'} rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom`}
                />

                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Sale Price *
                </label>
              </div>
            </div>

            {/* Min. Sale Price */}
            <div className="relative">
              <div className="flex items-center">
                {priceData.minSalePrice && (
                  <span className="absolute left-3 text-lg text-gray-600">₹</span>
                )}
                <input
                  type="number"
                  placeholder=""
                  name="minSalePrice"
                  value={priceData.minSalePrice}
                  onChange={handleInputChangePrice}
                  ref={minSalePriceRef}
                  onKeyDown={(e) => handleKeyPress(e, mrpRef, salePriceRef)}
                  className={`peer w-full h-11 ${priceData.minSalePrice ? 'pl-6' : 'px-4'} rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom`}
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
                  onChange={handleInputChangePrice}
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
                name="hsnCode"
                value={priceData.hsnCode}  // Bind the value to priceData.hsnCode
                onChange={handleInputChangePrice}
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
                  ref={discountRef}
                  onKeyDown={(e) => {
                    handleKeyPress(e, igstRef, hsnCodeRef);
                    handleKeyDownDiscount(e); // Ensure dropdown navigation works
                  }}
                  value={selectedSymbol === "%" ? `${numericValue}${selectedSymbol}` : `${selectedSymbol}${numericValue}`}
                  onChange={handleInputChangeDiscount}
                  onFocus={() => setDropdownDiscountOpen(true)}
                  onBlur={() => setTimeout(() => setDropdownDiscountOpen(false), 200)}
                  className="peer w-full h-11 px-4 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom"
                  placeholder=""
                />
                <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                  Discount
                </label>

                {/* Add button */}
                <button
                  className="absolute h-11 w-12 right-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center bg-[#eeeef2] text-[#838383] rounded-r"
                >
                  <ChevronDown size={24} />
                </button>
                {/* Dropdown */}
                {dropdownDiscountOpen && (
                  <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-10 max-h-40 overflow-auto">
                    {arrowOptions.map((option, index) => (
                      <li
                        key={option.symbol}
                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${index === focusedDiscountIndex ? "bg-gray-200" : "" // Highlight selected item
                          }`}
                        onMouseDown={() => {
                          setSelectedSymbol(option.symbol);
                          setDropdownDiscountOpen(false);
                        }}
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
          <h3 className="text-lg font-semibold mb-2 text-gray-700">GST Details</h3>
          <div className="grid lg:grid-cols-5 grid-cols-1 sm:grid-cols-2 gap-4">
            {/* IGST Input Field */}
            {/* IGST Input Field */}
            <div className="relative">
              <input
                type="text"
                placeholder=""
                value={priceData.igst ? `${priceData.igst}%` : ""} // ✅ Corrected Syntax
                ref={igstRef}
                onChange={(e) => handleInputChangeGST(e, "igst")}
                onKeyDown={(e) => handleKeyPress(e, cgstRef, discountRef)}
                className="peer w-full h-11 pl-4 pr-10 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom input-with-line"
              />
              <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                IGST %
              </label>

              {/* Price Calculation - Show only if IGST is not empty */}
              {newCategory.igst && priceData.salePrice && (
                <div className="absolute border-l-2 left-24 ml-2 border-[#c9c9cd] text-sm pl-3 right-0 text-left top-1/2 transform -translate-y-1/2">
                  <div className="text-sm text-gray-500 overflow-hidden flex-nowrap">
                    ₹ {(priceData.salePrice * (newCategory.igst / 100)).toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder=""
                value={newCategory.cgst ? `${newCategory.cgst}%` : ""}
                ref={cgstRef}
                onChange={(e) => handleInputChangeGST(e, "cgst")}
                onKeyDown={(e) => handleKeyPress(e, sgstRef, igstRef)}
                className="peer w-full h-11 pl-4 pr-10 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom input-with-line"
              />
              <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                CGST %
              </label>
              {/* Price Calculation - Show only if CGST is not empty */}

              {newCategory.cgst && (

                <div className="absolute border-l-2 left-24 ml-2 border-[#c9c9cd] text-sm pl-3 right-0 text-left top-1/2 transform -translate-y-1/2">
                  <div className="text-sm text-gray-500 overflow-hidden flex-nowrap">
                    ₹ {priceData.salePrice * (newCategory.cgst / 100)}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder=""
                value={newCategory.sgst ? `${newCategory.sgst}%` : ""}
                ref={sgstRef}
                onChange={(e) => handleInputChangeGST(e, "sgst")}
                onKeyDown={(e) => handleKeyPress(e, cessRef, cgstRef)}
                className="peer w-full h-11 pl-4 pr-10 rounded border border-[#c9c9cd] text-sm focus:outline-none focus:border-purpleCustom input-with-line"
              />
              <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                SGST %
              </label>
              {newCategory.sgst && (
                <div className="absolute border-l-2 left-24 ml-2 border-[#c9c9cd] text-sm pl-3 right-0 text-left top-1/2 transform -translate-y-1/2">
                  <div className="text-sm text-gray-500 overflow-hidden flex-nowrap">
                    ₹ {priceData.salePrice * (newCategory.sgst / 100)}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder=""
                value={newCategory.cess ? `${newCategory.cess}%` : ""}
                ref={cessRef}
                onChange={(e) => handleInputChangeGST(e, "cess")}
                onKeyDown={(e) => handleKeyPress(e, totalAmountRef, sgstRef)}
                className="peer w-full h-11 pl-4 pr-10 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom input-with-line"
              />
              <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                Cess %
              </label>
              {newCategory.cess && (
                <div className="absolute border-l-2 left-24 ml-2 border-[#c9c9cd] text-sm pl-3 right-0 text-left top-1/2 transform -translate-y-1/2">
                  <div className="text-sm text-gray-500 overflow-hidden flex-nowrap">
                    ₹ {priceData.salePrice * (newCategory.cess / 100)}
                  </div>
                </div>
              )}
            </div>


            {/* total amount */}

            {/* Total Amount Field */}
            <div className="relative">
              <input
                type="text" // Changed from number to text (since we append ₹)
                placeholder=""
                value={priceData.totalAmount}
                ref={totalAmountRef}
                onKeyDown={(e) => handleKeyPress(e, null, cessRef)}
                readOnly // ✅ Prevent manual edits (auto-calculated)
                className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
              />
              <label className="absolute left-3 -top-2 text-sm font-sans text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
                Total Amount
              </label>
            </div>
          </div>
        </div>
      )}


      {/* ------------------------------------------------------------------------------------------------------------------------
                                                                Stock details
      ---------------------------------------------------------------------------------------------------------------------------*/}

      {activeForm === 'stock' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder=""
              name="openingStock"
              value={stockData.openingStock}
              onChange={handleChangeStock}
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
              name="openingStockValue"
              value={stockData.openingStockValue}
              onChange={handleChangeStock}
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
              name="lowStockQty"
              value={stockData.lowStockQty}
              ref={lowStockQtyRef}
              onChange={handleChangeStock}
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
              onChange={handleChangeStock}
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
              placeholder=""
              name="location"
              value={stockData.location}
              ref={locationRef}
              onChange={handleChangeStock}
              onKeyDown={(e) => {
                handleKeyPress(e, supplier_nameRef, dateRef)
                if (dropdownOpen) handleKeyDownLocation(e);
              }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              className="peer w-full h-11 pl-4 rounded border border-[#c9c9cd] justify-start items-center inline-flex overflow-hidden px-2 text-sm focus:outline-none focus:border-purpleCustom"
            />
            <label className="absolute left-3 -top-2 text-sm font-normal text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
              Location
            </label>

            {/* Dropdown */}
            {dropdownOpen && filteredLocations.length > 0 && (
              <ul className="absolute left-0 top-14 w-full bg-white border rounded shadow-md z-20 max-h-40 overflow-auto">
                {filteredLocations.map((location, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 text-sm cursor-pointer ${selectedIndex === index ? "bg-gray-200" : "hover:bg-gray-100"
                      }`}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                      setStockData((prev) => ({ ...prev, location }));
                      setDropdownOpen(false);
                    }}
                  >
                    {location}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* supplier Name */}
          <div className="relative">
            <input
              type="text"
              placeholder=""
              name="supplier_name"
              value={stockData.supplier_name}
              ref={supplier_nameRef}
              onChange={handleChangeStock}
              onKeyDown={(e) => handleKeyPress(e, null, locationRef)}
              className="peer w-full h-11 px-2 text-sm border border-grayCustom focus:outline-none focus:border-purpleCustom rounded"
            />
            <label className="absolute left-3 -top-2 text-xs text-[#838383] bg-white px-1 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#838383] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#838383] peer-focus:bg-white">
              Supplier Name
            </label>
          </div>



        </div>
      )}


      {/* Button */}

      {activeForm === 'stock' && (

        <div className="mt-2 w-full flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-purpleCustom text-white font-semibold px-14 py-2 rounded"
          >
            Save
          </button>
          {/* <button className="bg-purpleCustom text-white px-10 py-2 text-sm rounded-lg">
            Save
          </button> */}
        </div>
      )}

      <ToastContainer autoClose={3000} />


    </div>
  );

};

export default AddProduct;

