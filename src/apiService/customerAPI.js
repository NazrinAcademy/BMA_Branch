import axios from "axios";

const BASE_URL="http://127.0.0.1:8000/Mathavan"

export function CustomerAdd(data,config, callback, errorcallback) {
  axios.post(`${BASE_URL}/customer/add`,data, config)
    .then((response) => {
      if (callback) {
        callback(response);
      }
    })
    .catch((error) => {
      if (errorcallback) {
        errorcallback(error);
      }
    });
}

export function Customerget(config, callback, errorcallback) {
  axios.get(`${BASE_URL}/customer/get`, config)
    .then((response) => {
      if (callback) {
        callback(response);
      }
    })
    .catch((error) => {
      if (errorcallback) {
        errorcallback(error);
      }
    });
}
