import axios from 'axios';

const API_URL = 'http://localhost:5000';

// ----------------- Register api ----------------------------

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

export const saveOrganizedDetails = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/organizedDetails`, data);
        return response.data;
    } catch (error) {
        console.error('Error saving general details:', error);
        throw error;
    }
};


// ----------------------- login api ----------------------------------

export const formLogin = async (userData) => {
    try {
      const response = await axios.get(`${API_URL}/users?email=${userData.email}`);
      const user = response.data[0]; 
  
      if (user && user.password === userData.password) {
        return user; 
      } else {
        return null; 
      }
    } catch (error) {
      console.error("Login API error:", error);
      return null;
    }
  };
  