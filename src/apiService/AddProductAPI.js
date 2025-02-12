// addproduct api
import axios from 'axios';

// Base URL for the json-server
const PRODUCT_API_URL = 'http://localhost:5000/products';

// Function to fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(PRODUCT_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to add a new product
export const addProduct = async (product) => {
  try {
    const newProduct = { 
      ...product,
      image: product.image, // Directly use the base64 image string
    };

    const response = await axios.post(PRODUCT_API_URL, newProduct);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};


// Function to update a product
export const updateProduct = async (id, updatedProduct) => {
  try {
    const response = await axios.put(`${PRODUCT_API_URL}/${id}`, updatedProduct);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${PRODUCT_API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};



// ---------------------------------------------------------------------------------


const API_URL = "http://localhost:5000/categories"; // Replace with your backend URL



// ---------------------------------------

export const addSubCategory = async (categoryName, subCategoryName, hsnCode) => {
  try {
    const categories = await getCategories();  // Fetch existing categories

    // Find the category by name
    const categoryToUpdate = categories.find(
      (category) => category.categoryName === categoryName
    );

    if (!categoryToUpdate) {
      throw new Error("Category not found");
    }

    // Add the new subcategory and its HSN code
    const updatedCategory = {
      ...categoryToUpdate,
      subCategories: [
        ...(categoryToUpdate.subCategories || []),
        { name: subCategoryName, hsnCode: hsnCode }  // Include the HSN code
      ],
    };

    // Update the category in the backend using Axios
    const response = await axios.put(`${API_URL}/${categoryToUpdate.id}`, updatedCategory, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.status !== 200) {
      throw new Error("Failed to update category");
    }

    return response.data;  // Return the updated category data

  } catch (error) {
    console.error("Error adding subcategory:", error);
    throw error;  // Rethrow the error to be handled elsewhere
  }
};

// ---------------------------------------
// // Fetch all categories
// export const fetchCategories = async () => {
//   try {
//     const response = await fetch(API_URL);
//     if (!response.ok) {
//       throw new Error("Failed to fetch categories");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// Add a new category
export const addCategory = async (category) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      throw new Error("Failed to add category");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Get the updated list of categories (optional if fetchCategories is reused)
export const getCategories = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};



// Update a category
export const updateCategory = async (id, updatedCategory) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedCategory, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);

    if (!response.status === 200) {
      throw new Error("Failed to delete category");
    }

    return { success: true, id };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// // Add a subcategory to a specific category
// export const addSubCategory = async (categoryName, subCategoryName) => {
//   try {
//     const categories = await getCategories();

//     // Find the category by name
//     const categoryToUpdate = categories.find(
//       (category) => category.categoryName === categoryName
//     );

//     if (!categoryToUpdate) {
//       throw new Error("Category not found");
//     }

//     // Add the new subcategory
//     const updatedCategory = {
//       ...categoryToUpdate,
//       subCategories: [...(categoryToUpdate.subCategories || []), subCategoryName],
//     };

//     // Update the category in the backend
//     const response = await fetch(`${API_URL}/${categoryToUpdate.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatedCategory),
//     });

//     if (!response.ok) throw new Error("Failed to update category");
//     return await response.json();
//   } catch (error) {
//     console.error("Error adding subcategory:", error);
//     throw error;
//   }
// };

export const getSubCategories = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// ---------------------------brands ---------------------------

const BRAND_API_URL = "http://localhost:5000/brands"; // Replace with your actual backend URL

// // Add a new brand
// export const addBrand = async (brandName) => {
//   try {
//     const response = await fetch(BRAND_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name: brandName }),
//     });

//     if (!response.ok) throw new Error("Failed to add brand");
//     return await response.json();
//   } catch (error) {
//     console.error("Error adding brand:", error);
//     throw error;
//   }
// };

// // Get all brands
// export const getBrands = async () => {
//   try {
//     const response = await fetch(BRAND_API_URL);

//     if (!response.ok) throw new Error("Failed to fetch brands");
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching brands:", error);
//     throw error;
//   }
// };



// Add a new brand
export const addBrand = async (brandName) => {
  try {
    const response = await axios.post(BRAND_API_URL, { name: brandName });
    return response.data;
  } catch (error) {
    console.error("Error adding brand:", error);
    throw error;
  }
};

// Get all brands
export const getBrands = async () => {
  try {
    const response = await axios.get(BRAND_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

// Update brand
export const updateBrand = async (brandId, updatedBrand) => {
  try {
    const response = await axios.put(`${BRAND_API_URL}/${brandId}`, updatedBrand);
    return response.data;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
};

// Delete brand
export const deleteBrand = async (brandId) => {
  try {
    await axios.delete(`${BRAND_API_URL}/${brandId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};


// unitAPI.js

const UNIT_API_URL = "http://localhost:5000/units"; // Replace with your actual API endpoint

// Fetch all units
export const fetchUnits = async () => {
  try {
    const response = await fetch(UNIT_API_URL);
    if (!response.ok) throw new Error("Failed to fetch units");
    return await response.json();
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
};

// Add a new unit
export const addNewUnit = async (unitData) => {
  try {
    const response = await fetch(UNIT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(unitData),
    });

    if (!response.ok) throw new Error("Failed to add unit");
    return await response.json();
  } catch (error) {
    console.error("Error adding unit:", error);
    throw error;
  }
};



// Delete a unit
export const deleteUnit = async (unitId) => {
  try {
    const response = await axios.delete(`${UNIT_API_URL}/${unitId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting unit:", error);
    throw error;
  }
};

// Update a unit
export const updateUnit = async (unitId, updatedData) => {
  try {
    const response = await axios.put(`${UNIT_API_URL}/${unitId}`, updatedData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating unit:", error);
    throw error;
  }
};

// ------------------------------------------------------------

const API_BASE_URL = "http://localhost:5000";

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch GST details for a specific category
export const fetchGstByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GST details:", error);
    throw error;
  }
};

// Save GST form details
export const saveGstDetails = async (gstFormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/gstDetails`, gstFormData);
    return response.data;
  } catch (error) {
    console.error("Error saving GST details:", error);
    throw error;
  }
};


// ---------------------  price details ----------------------
// priceAPI.js

const BASE_URL = "http://localhost:5000"; // JSON server or backend API

// 🟢 Save Price Details
export const savePriceDetails = async (priceData) => {
  try {
    const response = await axios.post(`${BASE_URL}/priceDetails`, priceData);
    return response.data;
  } catch (error) {
    console.error("Error saving price details:", error);
  }
};

// 🟢 Get Price Details
export const getPriceDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/priceDetails`);
    return response.data;
  } catch (error) {
    console.error("Error fetching price details:", error);
  }
};

// 🟢 Update Price Details
export const updatePriceDetails = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/priceDetails/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating price details:", error);
  }
};


// ---------------------------------------  stock api -----------------------------------------------------------

const STOCK_API_URL = "http://localhost:5000/stock"; // Update with your JSON Server URL

export const fetchStockData = async () => {
  const response = await axios.get(STOCK_API_URL);
  return response.data;
};

export const addStockData = async (data) => {
  const response = await axios.post(STOCK_API_URL, data);
  return response.data;
};

export const updateStockData = async (id, data) => {
  const response = await axios.put(`${STOCK_API_URL}/${id}`, data);
  return response.data;
};


const PRICE_API_URL = "http://localhost:5000/priceDetails"; // JSON Server URL

export const fetchProductData = async () => {
  try {
    const response = await axios.get(PRICE_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
};

