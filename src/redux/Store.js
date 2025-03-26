import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../redux/Slice/authSlice"


const store = configureStore({
  reducer: {
    auth:authReducer
  },
});

export default store;
