import axios from 'axios';

// Base URL for the json-server
const API_URL = 'http://localhost:5000';

const BASE_URL="http://127.0.0.1:8000"

// Function to fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
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
      image: product.image, 
    };

    const response = await axios.post(`${API_URL}/products`, newProduct);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};


// Function to update a product
export const updateProduct = async (id, updatedProduct) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, updatedProduct);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};



// ------------------------------Sub  Categories---------------------------------------------------


export const addSubCategory = async (categoryName, subCategoryName, hsnCode) => {
  try {
    const categories = await getCategories();  

    // Find the category by name
    const categoryToUpdate = categories.find(
      (category) => category.categoryName === categoryName
    );

    if (!categoryToUpdate) {
      throw new Error("Category not found");
    }

    const updatedCategory = {
      ...categoryToUpdate,
      subCategories: [
        ...(categoryToUpdate.subCategories || []),
        { name: subCategoryName, hsnCode: hsnCode } 
      ],
    };

    const response = await axios.put(`${API_URL}/categories/${categoryToUpdate.id}`, updatedCategory, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.status !== 200) {
      throw new Error("Failed to update category");
    }

    return response.data;

  } catch (error) {
    console.error("Error adding subcategory:", error);
    throw error;  
  }
};


// Add a new category
export const addCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
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
    const response = await fetch(`${API_URL}/categories`);
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
    const response = await axios.put(`${API_URL}/categories/${id}`, updatedCategory, {
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
    const response = await axios.delete(`${API_URL}/categories/${id}`);

    if (!response.status === 200) {
      throw new Error("Failed to delete category");
    }

    return { success: true, id };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};


export const getSubCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// ---------------------------brands ---------------------------

// Add a new brand
export const addBrand = async (brandName) => {
  try {
    const response = await axios.post(`${BASE_URL}/unit/add`, { brand_name: brandName });
    return response.data;
  } catch (error) {
    console.error("Error adding brand:", error);
    throw error;
  }
};

// Get all brands
export const getBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/brands`);
    console.log("API Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

// Update brand
export const updateBrand = async (brandId, updatedBrand) => {
  try {
    const response = await axios.put(`${API_URL}/brands/${brandId}`, updatedBrand);
    return response.data;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
};

// Delete brand
export const deleteBrand = async (brandId) => {
  try {
    await axios.delete(`${API_URL}/brands/${brandId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};


// --------------------------- unit api --------------------------------------


// Fetch all units
export const fetchUnits = async () => {
  try {
    const response = await fetch(`${API_URL}/units`);
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
    const response = await fetch(`${API_URL}/units`, {
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
    const response = await axios.delete(`${API_URL}/units/${unitId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting unit:", error);
    throw error;
  }
};

// Update a unit
export const updateUnit = async (unitId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/units/${unitId}`, updatedData, {
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

// ------------------------------   categories ------------------------------
// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch GST details for a specific category
export const fetchGstByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GST details:", error);
    throw error;
  }
};

// Save GST form details
export const saveGstDetails = async (gstFormData) => {
  try {
    const response = await axios.post(`${API_URL}/gstDetails`, gstFormData);
    return response.data;
  } catch (error) {
    console.error("Error saving GST details:", error);
    throw error;
  }
};


// ---------------------  price details ----------------------

// 🟢 Save Price Details
export const savePriceDetails = async (priceData) => {
  try {
    const response = await axios.post(`${API_URL}/priceDetails`, priceData);
    return response.data;
  } catch (error) {
    console.error("Error saving price details:", error);
  }
};

// 🟢 Get Price Details
export const getPriceDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/priceDetails`);
    return response.data;
  } catch (error) {
    console.error("Error fetching price details:", error);
  }
};

// 🟢 Update Price Details
export const updatePriceDetails = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/priceDetails/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating price details:", error);
  }
};


// ---------------------------------------  stock api -----------------------------------------------------------


export const fetchStockData = async () => {
  const response = await axios.get(`${API_URL}/stock`);
  return response.data;
};

export const addStockData = async (data) => {
  const response = await axios.post(`${API_URL}/stock`, data);
  return response.data;
};

export const updateStockData = async (id, data) => {
  const response = await axios.put(`${API_URL}/stock/${id}`, data);
  return response.data;
};


