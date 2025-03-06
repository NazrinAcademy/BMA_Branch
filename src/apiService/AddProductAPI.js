import axios from 'axios';

// Base URL for the json-server
const API_URL = 'http://localhost:5000';

const BASE_URL="http://127.0.0.1:8000/Mathavan"

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


// export const addSubCategory = async (categoryName, subCategoryName, hsnCode) => {
//   try {
//     const categories = await getCategories();  

//     // Find the category by name
//     const categoryToUpdate = categories.find(
//       (category) => category.categoryName === categoryName
//     );

//     if (!categoryToUpdate) {
//       throw new Error("Category not found");
//     }

//     const updatedCategory = {
//       ...categoryToUpdate,
//       subCategories: [
//         ...(categoryToUpdate.subCategories || []),
//         { name: subCategoryName, hsnCode: hsnCode } 
//       ],
//     };

//     const response = await axios.put(`${API_URL}/categories/${categoryToUpdate.id}`, updatedCategory, {
//       headers: {
//         "Content-Type": "application/json",
//       }
//     });

//     if (response.status !== 200) {
//       throw new Error("Failed to update category");
//     }

//     return response.data;

//   } catch (error) {
//     console.error("Error adding subcategory:", error);
//     throw error;  
//   }
// };




// Get the updated list of categories (optional if fetchCategories is reused)
export const getCategories = async (config) => {
  try {
    const response = await fetch(`${BASE_URL}/category/get`, config);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
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
export const addBrand = async (brandName, config) => {
  try {
    const response = await axios.post(`${BASE_URL}/brand/api/add`, { brand_name: brandName }, config);
    return response.data;
  } catch (error) {
    console.error("Error adding brand:", error);
    throw error;
  }
};

// Get all brands
export const getBrands = async (config) => {
  try {
    const response = await axios.get(`${BASE_URL}/brand/api/get/all`, config);
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
    const response = await axios.put(`${BASE_URL}/brand/api/update?object_id=${brandId}`, updatedBrand);
    return response.data;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
};

// Delete brand
export const deleteBrand = async (brandId) => {
  try {
    await axios.delete(`${BASE_URL}/brand/api/delete?object_id=${brandId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};


// --------------------------- unit api --------------------------------------


// Fetch all units
export const fetchUnits = async (config) => {
  try {
    const response = await fetch(`${BASE_URL}/unit/get/all`, config);
    if (!response.ok) throw new Error("Failed to fetch units");
    return await response.json();
  } catch (error) {
    console.error("Error fetching units:", error);
    throw error;
  }
};

// Add a new unit
export const addNewUnit = async (unitData,config) => {
  try {
    const response = await fetch(`${BASE_URL}/unit/add`, {
      method: "POST",
      config,
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
export const deleteUnit = async (unitId, config) => {
  try {
    const response = await axios.delete(`${BASE_URL}/unit/delete?object_id=${unitId}`, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting unit:", error);
    throw error;
  }
};

// Update a unit
export const updateUnit = async (unitId, updatedData, config) => {
  try {
    const response = await axios.put(`${BASE_URL}/unit/update?object_id=${unitId}`, updatedData, config, {
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
export const fetchCategories = async (config) => {
  try {
    const response = await axios.get(`${BASE_URL}/category/get`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Add a new category
export const addCategory = async (category, config) => {
  try {
    const response = await fetch(`${BASE_URL}/category/add`, {
      method: "POST", // Specify the HTTP method
      headers: config.headers, // Pass headers correctly
      body: JSON.stringify(category), // Convert category to JSON string
    });

    if (!response.ok) {
      throw new Error("Failed to add category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (id, updatedCategory, config) => {
  try {
    const response = await axios.put(`${BASE_URL}/category/update/${id}`, updatedCategory,config,  {
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
export const deleteCategory = async (id, config) => {
  try {
    const response = await axios.delete(`${BASE_URL}/category/delete/${id}`, config);

    if (!response.status === 200) {
      throw new Error("Failed to delete category");
    }

    return { success: true, id };
  } catch (error) {
    console.error("Error deleting category:", error);
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


// ----------------------- new sub category function --------------

// Fetch all subcategories
export const fetchSubCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

// Add a new subcategory
export const addSubCategory = async (newSubCategory) => {
  try {
    const response = await axios.post(BASE_URL, newSubCategory);
    return response.data;
  } catch (error) {
    console.error('Error adding subcategory:', error);
    throw error;
  }
};

// Update a subcategory
export const updateSubCategory = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating subcategory:', error);
    throw error;
  }
};

// Delete a subcategory
export const deleteSubCategory = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    throw error;
  }
};
