import axios from "axios";

const BASE_URLS = import.meta.env.VITE_BASE_URL;

// ✅ Fetch all categories
export const fetchCategories = async (config) => {
  try {
console.log("BASE_URLs",BASE_URLS);

    
    const response = await axios.get(`${BASE_URLS}/Mathavan/category/get/all`, config);

    // Ensure response is structured correctly
    if (response?.data?.all_stock && Array.isArray(response.data.all_stock)) {
      console.log("get data", response.data.all_stock);

       
      
      return response.data.all_stock;
    } else {
      console.error("Invalid category response format:", response.data);
      return []; // Return empty array if response is not in expected format
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// ✅ Add a new category (converted to axios)
export const addCategory = async (category, config) => {
  try {
    const response = await axios.post(`${BASE_URLS}/Mathavan/category/add`, category, config);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// ✅ Update a category
export const updateCategory = async (id, updatedCategory, config) => {
  try {
    const response = await axios.put(
      `${BASE_URLS}/Mathavan/category/update?object_id=${id}`,
      updatedCategory,
      config
    );
    console.log("Update Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// ✅ Delete a category
export const deleteCategory = async (id, config) => {
  try {
    const response = await axios.delete(`${BASE_URLS}/Mathavan/category/delete?object_id=${id}`, config);

    if (response.status === 200) {
      return { success: true, id };
    } else {
      throw new Error("Failed to delete category");
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
