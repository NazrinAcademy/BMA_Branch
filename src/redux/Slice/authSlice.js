import { createSlice } from '@reduxjs/toolkit';

const userData = JSON.parse(localStorage.getItem("user"))
const initialState = {
  userDetails:!userData? {
    id:"",
    access_token:"",
    email:"",
    refresh_token:"",
    username:""
  }:userData
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.userDetails = { ...state.userDetails, ...action.payload };
    },
  },
});

export const { setUserDetails } = authSlice.actions;
export default authSlice.reducer;
