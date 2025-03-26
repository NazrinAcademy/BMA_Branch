import axios from "axios";

const BASE_URLS = import.meta.env.VITE_BASE_URL;

// ---------------------------brands ---------------------------

// Add a new brand
export const addBrand = async (brandName, config) => {
    try {
      const response = await axios.post(`${BASE_URLS}/Mathavan/brand/api/add`, { brand_name: brandName }, config);
      return response.data;
    } catch (error) {
      console.error("Error adding brand:", error);
      throw error;
    }
  };

  // Get all brands
export const getBrands = async (config) => {
    try {
      const response = await axios.get(`${BASE_URLS}/Mathavan/brand/api/get/all`, config);
      console.log("API Response:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw error;
    }
  };

  // Update brand
export const updateBrand = async (brandId, payload, config) => {
    try {
      const response = await axios.put(`${BASE_URLS}/Mathavan/brand/api/update?object_id=${brandId}`, payload, config);
      return response.data;
    } catch (error) {
      console.error("Error updating brand:", error);
      throw error;
    }
  };
  
  
  // Delete brand
export const deleteBrand = async (brandId,config) => {
    try {
      await axios.delete(`${BASE_URLS}/Mathavan/brand/api/delete?object_id=${brandId}`,config);
      return { success: true };
    } catch (error) {
      console.error("Error deleting brand:", error);
      throw error;
    }
  };
  