import axios from 'axios';


const apiInstance = axios.create({
  baseURL: 'https://your-backend-url.com/api', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add interceptors for request or response
apiInstance.interceptors.request.use(
  (config) => {
    // Add token to request headers if needed (e.g., for authentication)
    // const token = getTokenFromStorage();
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example of a POST request to login
export const loginUser = async (username, password) => {
  try {
    const response = await apiInstance.post('/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Login API error:', error.response || error);
    throw error; // Throw the error to be handled in the calling function
  }
};

// Refactored `addMember` to use `apiInstance`
export const addMember = async (memberData) => {
  try {
    const response = await apiInstance.post('/members', memberData); // Using `apiInstance` here
    return response.data;
  } catch (error) {
    console.error('Error adding member:', error.response || error);
    throw error;
  }
};

// Function to add shop details
export const addShop = async (shopData) => {
  try {
    const response = await apiInstance.post('/shops', shopData);
    return response.data;
  } catch (error) {
    console.error('Error adding shop:', error);
    throw error;
  }
};
  //shop vendor 
export const fetchMembers = async (role) => {
  try {
    const response = await apiInstance.get(`/members/${role}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error; 
  }
};


// Function to update vendor details
export const updateVendorDetails = (vendorId, updatedData) => {
  return apiInstance.put(`/vendors/${vendorId}`, updatedData)
    .then(response => response.data)
    .catch(error => {
      console.error('Error updating vendor details:', error);
      throw error;
    });
};

// Function to delete vendor details
export const deleteVendor = (vendorId) => {
  return apiInstance.delete(`/vendors/${vendorId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error deleting vendor:', error);
      throw error;
    });
};

export default apiInstance;
