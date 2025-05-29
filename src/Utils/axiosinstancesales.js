import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const port = process.env.BASE_URL
console.log('port in axiosinstance',port);

export const  axiosInstancesales = axios.create({
  
  baseURL:port,
  headers: {
    'Content-Type': 'application/json',
  },
       
});
console.log("axiosInstance",axiosInstancesales);

axiosInstancesales.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await AsyncStorage.getItem('salesToken');
      if (accessToken) {
        console.log("This is the token:", accessToken);
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      console.log('it is log for user',config);
      
      return config;
    } catch (error) {
      console.error("Error retrieving access token:", error);
      return config; // Return config even if token retrieval fails
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstancesales.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access - Redirecting to Login');
      // Handle redirection to login or token refresh if needed
    }
    return Promise.reject(error);
  }
);