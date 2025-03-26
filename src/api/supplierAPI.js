import axios from "axios";

const BASE_URLS = import.meta.env.VITE_BASE_URL;

// const BASE_URL="http://127.0.0.1:8000/Mathavan"

// post api function:
export function SupplierAdd(data,config,callback,errorcallback){
    axios.post(`${BASE_URLS}/Mathavan/supplier/add`,data,config)
.then((response)=>{
    if(callback){
        callback(response);
    }
})
.catch((error)=>{
    if(errorcallback){
        errorcallback(error);
    }

});

}

// get api function:

export function Supplierget(config,callback,errorcallback){
    axios.get(`${BASE_URLS}/Mathavan/supplier/get/all`,config)
    .then((response)=>{
        if(callback){
            callback(response);
        }
    })
    .catch((error)=>{
        if(errorcallback){
        errorcallback(error);
        }
    });
}

// update api function:
export function SupplierUpdate(id,data, config, callback, errorcallback) {
    axios.put(`${BASE_URLS}/Mathavan/supplier/update?object_id=${id}`, data, config)
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


// delete api function:

export function SupplierDelete(id, config, callback, errorcallback) {
    axios.delete(`${BASE_URLS}/Mathavan/supplier/delete?object_id=${id}`, config)
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
