import axios from "axios";

const BASE_URLS = import.meta.env.VITE_BASE_URL;


export const addPurchaseInvoice = async (purchaseData) => {
    try {
        const response = await axios.post(`${BASE_URLS}/Mathavan`, purchaseData);
        console.log("Purchase invoice posted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error posting purchase invoice:", error);
        throw error; 
    }
};


export const getPurchaseInvoices = async () => {
    try {
        const response = await axios.get(`${BASE_URLS}/Mathavan`);
        console.log("Fetched purchase invoices:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching purchase invoices:", error);
        throw error;
    }
}


export const updatePurchaseInvoice = async (id, purchaseData) => {
    try {
        const response = await axios.put(`${BASE_URLS}/Mathavan/${id}`,purchaseData);
        console.log("Update purchase invoice:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating purchase invoice:", error);
        throw error;
    }
}

export const deletePurchaseInvoice = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URLS}/Mathavan/${id}`);
        console.log("purchase invoice deleted successfully", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting purchase invoice", error);
        throw error;
    }
}