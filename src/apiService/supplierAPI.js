import axios from "axios";

const BASE_URL="http://127.0.0.1:8000/Mathavan"

// post api function:
export function SupplierAdd(data,config,callback,errorcallback){
    axios.post(`${BASE_URL}/supplier/add`,data,config)
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
    axios.get(`${BASE_URL}/supplier/get/all`,config)
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
export function SupplierUpdate(data, config, callback, errorcallback) {
    axios.put(`${BASE_URL}/supplier/update/${data.id}`, data, config)
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
    axios.delete(`${BASE_URL}/supplier/delete/${id}`, config)
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
