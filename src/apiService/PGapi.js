import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const savePersonalDetails = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/personalDetails`, data);
        return response.data;
    } catch (error) {
        console.error('Error saving personal details:', error);
        throw error;
    }
};

// Fetch Personal Details
export const getPersonalDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/personalDetails`);
      return response.data;
    } catch (error) {
      console.error("Error fetching personal details:", error);
      throw error;
    }
  };

export const saveGeneralDetails = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/generalDetails`, data);
        return response.data;
    } catch (error) {
        console.error('Error saving general details:', error);
        throw error;
    }
};
