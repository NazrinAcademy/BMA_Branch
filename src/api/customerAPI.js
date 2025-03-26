import axios from "axios";

const BASE_URLS = import.meta.env.VITE_BASE_URL;


export function CustomerAdd(data,config, callback, errorcallback) {
  axios.post(`${BASE_URLS}/Mathavan/customer/add`,data, config)
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
  axios.get(`${BASE_URLS}/Mathavan/customer/get/all`, config)
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

// update api function:

export function CustomerUpdate(data, config, callback, errorcallback){
  axios.put(`${BASE_URLS}/Mathavan/customer/update/${data.id}`, data, config)
    .then((response) => {
      if(callback) {
        callback(response);
      }
    })
    .catch((error) => {
      if(errorcallback) {
        errorcallback(error);
      }
    });
}

// delete api function:

export function CustomerDelete(id, config, callback, errorcallback){
  axios.delete(`${BASE_URLS}/Mathavan/customer/delete?object_id=${id}`, config)
  .then((response) => {
    if(callback) {
      callback(response);
    }
  })
  .catch((error) => {
    if (errorcallback) {
      errorcallback(error);
    }
  });
}