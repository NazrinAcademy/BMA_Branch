import axios from "axios";

const BASE_URLS = import.meta.env.VITE_BASE_URL;


// --------------------------- unit api --------------------------------------

  // Add a new unit
  export const addNewUnit = async (unitData, config) => {
    try {
        const response = await axios.post(`${BASE_URLS}/Mathavan/unit/add`, unitData, config);
        return response.data;
    } catch (error) {
        console.error("Error adding unit:", error);
        throw error;
    }
};


// Fetch all units
export const fetchUnits = async (config) => {
  try {
      const response = await axios.get(`${BASE_URLS}/Mathavan/unit/get/all`, config);

      // Ensure we access the correct array (unit_all)
      return response.data.unit_all || [];  
  } catch (error) {
      console.error("Error fetching units:", error);
      throw error;
  }
};

  
// Update a unit
export const updateUnit = async (unitId, updatedData, config) => {
    try {
      const response = await axios.put(`${BASE_URLS}/Mathavan/unit/update?object_id=${unitId}`, updatedData, config, {
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
  

  // Delete a unit
export const deleteUnit = async (unitId, config) => {
    try {
      const response = await axios.delete(`${BASE_URLS}/Mathavan/unit/delete?object_id=${unitId}`, config);
      return response.data;
    } catch (error) {
      console.error("Error deleting unit:", error);
      throw error;
    }
  };

  