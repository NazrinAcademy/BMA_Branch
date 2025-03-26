import axios from "axios";

const BASE_URLS = import.meta.env.VITE_BASE_URL;



// Add a new subcategory
export const addSubCategory = async (newSubCategory, config) => {
  try {
      const response = await axios.post(`${BASE_URLS}/Mathavan/subcategory/add`, newSubCategory, config);
      return response.data;
  } catch (error) {
      console.error("Error adding subcategory:", error.response?.data || error.message);
      throw error;
  }
};

// Fetch all subcategories
export const fetchSubCategories = async (config) => {
    try {
      const response = await axios.get(`${BASE_URLS}/Mathavan/subcategory/get/all`, config);
      return response?.data;
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      throw error;
    }
  };

  // Update a subcategory
export const updateSubCategory = async (id, updatedData, config) => {
    try {
      const response = await axios.put(`${BASE_URLS}/Mathavan/subcategory/update?object_id=${id}`, updatedData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    }
  };

  // Delete a subcategory
  export const deleteSubCategory = async (id, config) => {
    try {
      await axios.delete(`${BASE_URLS}/Mathavan/subcategory/delete`, {
        params: { object_id: id },  // ✅ Correct query param format
        ...config,
      });
      console.log("Subcategory deleted successfully");
    } catch (error) {
      console.error("Error deleting subcategory:", error.response?.data || error.message);
      throw error;
    }
  };
  
  