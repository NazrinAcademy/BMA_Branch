import Axios from "../Axios/Axios"

const api = Axios .create({
  baseURL: process.env.REACT_APP_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;