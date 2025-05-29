import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from './axiosInstance.js';
import { axiosInstancesales } from './axiosinstancesales.js';
import { useEffect } from 'react';

//https://co.grafin.shop/api/v1/product/getproduct
//http://192.168.42.229:3500/api/v1/

const port = process.env.BASE_URL
console.log("portsss",port);

export const Loginfun = async (email, password) => {
  try {
    console.log('port',port);
    
    console.log("email,password",email,password);
  
    
    const response = await axios.post(`${port}admin/adminlogin`, {
      email,
      password
    });
    console.log(email);
    
if (response) {
console.log("response",response);
  
} else {
  console.log("no response");
  
}

    const { token } = response.data;

    if(token){
      console.log("successtoken",token);
      }

     else{
      console.log("notoken receives");
      
     } 
               
    // Store the token in AsyncStorage
    await AsyncStorage.setItem('adminToken', token);

    console.log('Token stored successfully:', token);
    
    return response.data;

  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
    throw error;
  }
};


//logout

export const logoutFun = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared');

    // Confirm storage is empty
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    console.log('Current AsyncStorage contents:', values);

    const result = await axios.get(`${port}admin/adminlogout`);
    console.log("logoutapi", result);
    console.log("Logged out successfully");

    // Return the API response (or just a success flag)
    return result.data; // Assuming result.data contains { success: true, ... }
  } catch (error) {
    console.error('Error logging out:', error.response?.data || error.message);
    return false;
  }
};

// Function to get admin profile
export const getUserProfile = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); 

    if (!accessToken) {
      console.error('Authorization token is missing');
      throw new Error('Authorization token is missing');
    }

    console.log("AccessToken retrieved:", accessToken);

    const response = await axiosInstance.get(`admin/admindetailes`, {  
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add Bearer prefix
      }
    });

    console.log('User Data:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};







//Adminsales

export const addSales = async (name,email,phonenumber,password) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.post(`sales/registersales`,{name,email,phonenumber,password}, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};
//sales/saleslogin

export const loginSales = async (email,password) => {
  try {
    console.log(email,password);
    
    const response = await axios.post(`${port}sales/loginsales`, {
      email,
      password
    });
    console.log();
    
if (response) {
console.log("response",response);
  
} else {
  console.log("no response");
  
}

    const { token } = response.data;

    if(token){
      console.log("successtoken",token);
      }

     else{
      console.log("notoken receives");
      
     } 
    
    // Store the token in AsyncStorage
    await AsyncStorage.setItem('salesToken', token);

    console.log('Token stored successfully:', token);
    
    return response.data;

  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
    throw error;
  }
};




export const getAllSales = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); 

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }

    console.log("AccessToken Retrieved:", accessToken);

    const response = await axiosInstance.get(`sales/getallsalesman`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Sales Data:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error fetching sales data:', error.response?.data || error.message);
    throw error;
  }
};





export const updateSales = async (id,name,email,phonenumber) => {
  try {
    const accessToken = await AsyncStorage.getItem('accessToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.put(`sales/updatesales/${id}`,{name,email,phonenumber}, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};
///deletesales/:id
export const deleteSales = async (id) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.delete(`sales/deletesales/${id}`, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};


//Adminproduction 
export const addProduction = async (name,email,phonenumber,password) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.post(`production/registerproduction`,{name,email,phonenumber,password}, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllProduction = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.get(`production/getallproduction`, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};


export const updateProduction = async (id,name,email,phonenumber) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.put(`production/updateproduction/${id}`,{name,email,phonenumber}, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteProduction = async (id) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.delete(`production/deleteproduction/${id}`, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

//AdminQc

export const addQc = async (name,email,phonenumber,password) => {
  try {
    console.log("qc api");
    
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.post(`qc/registerqc`,{name,email,phonenumber,password}, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdataqc',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

//Admingetallsales
export const getAllQc = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.get(`qc/getallqcdetailes`, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdataqc',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};


export const updateQc = async (id,name,email,phonenumber) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.put(`qc/updateqc/${id}`,{name,email,phonenumber}, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};
///deletesales/:id
export const deleteQc = async (id) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.delete(`qc/deleteqc/${id}`, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};


//Adminac

export const addAc = async (name,email,phonenumber,password) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.post(`ac1/registerac1`,{name,email,phonenumber,password}, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};


///colorshade
//productType,colorshades
export const addColorshade = async (producttype, colorshades) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken');

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    
    console.log("accessToken get successfully", accessToken);

    const response = await axiosInstance.post(`colorshade/createcolorshade`,
      { producttype, colorshades },
      {
        headers: {
          Authorization: `${accessToken}`,
          
        },
      }
    );

    if (response) {
      return response.data;
    } else {
      console.log("Error fetching user data");
    }
  } catch (error) {
    console.error('Error sending colorshade data:', error.response?.data || error.message);
    throw error;
  }
};

///colorshade/getcolorshade
export const getColorshade = async () => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken');

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }

    console.log("Access token retrieved:", accessToken);

    const response = await axiosInstance.get(`colorshade/getcolorshade`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });

    if (response.data) {
      console.log("Color shade data received:", response.data);
      return response.data;
    } else {
      throw new Error("No data received");
    }
  } catch (error) {
    console.error("Error fetching color shades:", error.response?.data || error.message);
    throw error;
  }
};


//colorshade by producttype

///colorshade/getcolorshadebyname?producttype=Membrane Doors

export const getColorshadeByname = async (producttype) => {
  try {
    console.log('producttype in api ',producttype);
    
    const accessToken = await AsyncStorage.getItem('adminToken');

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }

    console.log("Access token retrieved:", accessToken);

    const response = await axiosInstance.get(`colorshade/getcolorshadebyname?producttype=${producttype}`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });

    if (response.data) {
      console.log("Color shade data received:", response.data);
      return response.data; 
    } else {
      throw new Error("No data received");
    }
  } catch (error) {
    console.error("Error fetching color shades:", error.response?.data || error.message);
    throw error;
  }
};
// totalprocessingtime,pr1,pr2,pr3,pr4,,height,width,modelno,thickness
export const addProduct = async (height,
  width,
  producttype,
  modelno,
  thickness,
  colorshadedetailes,
  // pr1,
  // pr2,
  // pr3,
  // pr4,
  // qantityprocessingtime
) => {
  
  try {
   console.log("from api",height,
    width,
    producttype,
    modelno,
    thickness,
    colorshadedetailes,
    // pr1,
    // pr2,
    // pr3,
    // pr4,
    // qantityprocessingtime
  );
   
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.post(`product/createproduct`,{height,
      width,
      producttype,
      modelno,
      thickness,
      colorshadedetailes,
      // pr1,
      // pr2,
      // pr3,
      // pr4,
      // qantityprocessingtime
    }, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};
//getproducts

export const getProduct = async () => {
  try {
    console.log('hai from api');
    
   

    const response = await axios.get(`${port}product/getproduct`);

    if (response) {
      console.log("Color shade data received:", response.data);
      return response.data;
    } else {
      throw new Error("No data received");
    }
  } catch (error) {
    console.error("Error fetching color shades:", error.response?.data || error.message);
    throw error;
  }
};


//sales

export const SalesLoginfun = async (email, password) => {
  try {
    console.log(email,password);
    
    const response = await axios.post(`${port}sales/loginsales`, {
      email,
      password
    });
    console.log();
    
if (response) {
console.log("response",response);
  
} else {
  console.log("no response");
  
}

    const { token } = response.data;

    if(token){
      console.log("successtoken",token);
      }

     else{
      console.log("notoken receives");
      
     } 
    
    // Store the token in AsyncStorage
    await AsyncStorage.setItem('salesToken', token);

    console.log('Token stored successfully:', token);
    
    return response.data;

  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
    throw error;
  }
};


export const logoutsalesFun = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared');

    // Confirm storage is empty
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);
    console.log('Current AsyncStorage contents:', values);

    const result = await axios.get(`${port}sales/logoutsales`);
    console.log("logoutapi", result);
    console.log("Logged out successfully");

    // Return the API response (or just a success flag)
    return result.data; // Assuming result.data contains { success: true, ... }
  } catch (error) {
    console.error('Error logging out:', error.response?.data || error.message);
    return false;
  }
};

export const getSalesProfile = async () => {
  try {
    console.log("Fetching Sales Profile...");

    const accessToken = await AsyncStorage.getItem('salesToken');
    
    if (!accessToken) {
      console.error('Authorization token is missing');
      throw new Error('Authorization token is missing');
    }

    console.log("Sales Token Retrieved:", accessToken);

    const response = await axiosInstancesales.get('sales/salesdetailes', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('User Data:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};




























//production

export const ProductionLoginfun = async (email, password) => {
  try {
    console.log(email,password);
    
    const response = await axios.post(`${port}production/loginproduction`, {
      email,
      password
    });
    console.log();
    
if (response) {
console.log("response",response);
  
} else {
  console.log("no response");
  
}

    const { token } = response.data;

    if(token){
      console.log("successtoken",token);
      }

     else{
      console.log("notoken receives");
      
     } 
    
    // Store the token in AsyncStorage
    await AsyncStorage.setItem('accessToken', token);

    console.log('Token stored successfully:', token);
    
    return response.data;

  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
    throw error;
  }
};


export const getproductionProfile = async () => {
  try {
    console.log("process.env.BASE_URL",process.env.BASE_URL);
    
    const accessToken = await AsyncStorage.getItem('accessToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.get(`${port}production/productiondetailes`, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('userdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

//qc

export const QcLoginfun = async (email, password) => {
  try {
    console.log(email,password);
    
    const response = await axios.post(`${port}qc/loginqc`, {
      email,
      password
    });
    console.log();
    
if (response) {
console.log("response",response);
  
} else {
  console.log("no response");
  
}

    const { token } = response.data;

    if(token){
      console.log("successtoken",token);
      }

     else{
      console.log("notoken receives");
      
     } 
    
    // Store the token in AsyncStorage
    await AsyncStorage.setItem('accessToken', token);

    console.log('Token stored successfully:', token);
    
    return response.data;

  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
    throw error;
  }
};


export const getQcProfile = async () => {
  try {
    console.log("process.env.BASE_URL",process.env.BASE_URL);
    
    const accessToken = await AsyncStorage.getItem('accessToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.get(`${port}qc/qcdetailes`, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('qcdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};


//ac
export const AcLoginfun = async (email, password) => {
  try {
    console.log(email,password);
    
    const response = await axios.post(`${port}ac/acdetailes`, {
      email,
      password
    });
    console.log();
    
if (response) {
console.log("response",response);
  
} else {
  console.log("no response");
  
}

    const { token } = response.data;

    if(token){
      console.log("successtoken",token);
      }

     else{
      console.log("notoken receives");
      
     } 
    
    // Store the token in AsyncStorage
    await AsyncStorage.setItem('accessToken', token);

    console.log('Token stored successfully:', token);
    
    return response.data;

  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
    throw error;
  }
};


export const getAcProfile = async () => {
  try {
    console.log("process.env.BASE_URL",process.env.BASE_URL);
    
    const accessToken = await AsyncStorage.getItem('accessToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.get(`${port}ac/acdetailes`, {
      headers: {
        Authorization: `${accessToken}`, // Use the retrieved token
      },
    });
   if (response) {
    console.log('qcdata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

//update pproduct 

export const updateProduct = async (id,
  height,
  width,
  producttype,
  modelno,
  thickness,
  colorshadedetailes,
  pr1,
  pr2,
  pr3,
  pr4,
  qantityprocessingtime) => {
  try {
    console.log("update values send from updateproduct ",id,
      height,
      width,  
      producttype,
      modelno,
      thickness,
      colorshadedetailes,
      pr1,
      pr2,
      pr3,
      pr4,
      qantityprocessingtime ) ;
    
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.put(`product/updateproduct/${id}`,{ 
      
      height,
      width,
      producttype,
      modelno,
      thickness,
      colorshadedetailes,
      pr1,
      pr2,
      pr3,
      pr4,
      qantityprocessingtime}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Use the retrieved token
      },
    });
   if (response) {
    console.log('updateddata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    console.log("update values send from updateproduct ",id ) ;
    
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve token directly

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }
    else{{
      console.log("accessToken get successfullly",accessToken);
      
    }}

    const response = await axiosInstance.delete(`product/deleteproduct/${id}`,
   {  
     headers: {
    Authorization: `Bearer ${accessToken}`,
    // Use the retrieved token
  },}
    );
   if (response) {
    console.log('deletedata',response.data);
    

    return response.data; // Return user profile data if needed
   } else {
    console.log("error to user data");
    
   }
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};

//https://co.grafin.shop/api/v1/product/getproduct

export const getSampleProduct = async () => {
  try {
    console.log('hai from api');
    
   

    const response = await axios.get(`${port}product/getproduct`);

    if (response) {
      console.log("Color shade data received:", response);
      return response.data;
    } else {
      throw new Error("No data received");
    }
  } catch (error) {
    console.error("Error fetching color shades:", error.response?.data || error.message);
    throw error;
  }
};

export const addShop = async (shopData) => {
  try {
    const accessToken = await AsyncStorage.getItem('adminToken'); // Retrieve the admin token

    if (!accessToken) {
      throw new Error('Authorization token is missing');
    }

    console.log("Access token retrieved:", accessToken);

    const response = await axiosInstance.post(`ventor/createventor`, shopData, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Add Bearer prefix
        'Content-Type': 'application/json',
      },
    });

    console.log('Shop created successfully:', response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error creating shop:', error.response?.data || error.message);
    throw error; // Throw the error to be handled by the calling function
  }
};


// export const addShop = async (shopData) => {
//   try {
//     const response = await axios.post(`${port}ventor/createventor`, shopData);
//     return response.data;
//   } catch (error) {
//     console.error('API error:', error.response || error.message || error);
//     throw error;
//   }
// };

// export const getAllShops = async () => {
//   try {
//     const response = await axios.get(`${port}ventor/getallventor`);
//     return response.data;
//   } catch (error) {
//     console.error('API error:', error.response || error.message || error);
//     throw error;
//   }
// };

// export const updateShop = async (id, shopData) => {
//   try {
//     const response = await axios.put(`${port}ventor/updateventor/${id}`, shopData);
//     return response.data;
//   } catch (error) {
//     console.error('API error:', error.response || error.message || error);
//     throw error;
//   }
// };

// export const deleteShop = async (id) => {
//   try {
//     const response = await axios.delete(`${port}ventor/deleteventor/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('API error:', error.response || error.message || error);
//     throw error;
//   }
// };




