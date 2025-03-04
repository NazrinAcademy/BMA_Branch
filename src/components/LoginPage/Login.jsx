import React, { useState } from "react";
import groupimg from "../../assets/Group login.png";
import groupText from "../../assets/Group 220.png";
import { formLogin } from "../../apiService/PGapi";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { setUserDetails } from "../../redux/Slice/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch=useDispatch()

  const eyeClick = () => {
    setShowPassword(!showPassword);
  };

  const handelChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };
  const validate = () => {
    if (!loginData.email) {
      toast.error("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!loginData.password) {
      toast.error("Password is required");
      return false;
    } else if (loginData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
  const config={  headers: {
      "Content-Type": "application/json",
    }}
  
    if (!validate()) return; // Stop if validation fails
    const result = await formLogin(loginData,config);
    if (result) {
      dispatch(setUserDetails(result))
      localStorage.setItem("user", JSON.stringify(result)); // Store user data
      toast.success("Login successful!");
      setTimeout(() => {
        window.location.href = "/dashboard"; // Force page reload to update authentication state
      }, 1000);
    } else {
      toast.error("Invalid email or password. Please try again.");
    }
  };
  
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="  rounded-lg flex w-full max-w-4xl">
          <div className="hidden md:flex w-1/2 items-center justify-center p-6">
            <img
              src={groupimg}
              alt="Login Illustration"
              className="w-full h-auto"
            />
          </div>

          <div className="w-full md:w-1/2 p-8">
            <div className="flex justify-center mb-6">
              <img src={groupText} className="w-28 h-auto" />
            </div>
            <h3 className="text-2xl font-bold font-jakarta text-[#202020] text-center mb-2">
              Welcome to Mobisoft
            </h3>
            <p className="text-[#838383] text-base font-jakarta font-medium text-center mb-6">
              Manage your invoices and transactions with ease!
            </p>

            <form onSubmit={handelSubmit}>
              <div className="mb-6 px-9 relative">
                <input
                  type="email"
                  id="email"
                  value={loginData.email}
                  onChange={handelChange}
                  name="email"
                  placeholder=""
                  className="peer w-80 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                />
                <label
                  htmlFor="email"
                  className="absolute left-12 -top-2 text-xs text-[#838383] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                >
                  Email
                </label>
              </div>

              <div className="mb-6 px-9 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={loginData.password}
                  onChange={handelChange}
                  name="password"
                  placeholder=""
                  className="peer w-80 h-11 px-2 text-sm border border-[#c9c9cd] focus:outline-none focus:border-[#593FA9] rounded"
                />
                <label
                  htmlFor="password"
                  className="absolute left-12 -top-2 text-xs text-[#838383] bg-white px-1 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 
                   peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-500 peer-focus:bg-white"
                >
                  Password
                </label>
                <button
                  className="absolute right-12 top-3 text-[#202020]"
                  type="button"
                  onClick={eyeClick}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mb-4 px-9">
                <button
                  type="submit"
                  className="w-80   bg-[#593fa9] text-white font-semibold font-jakarta py-2 rounded transition"
                >
                  Login
                </button>
              </div>
              <div className="flex items-center justify-between  px-9">
                <label className="flex items-center text-sm text-[#202020]">
                  <input
                    type="checkbox"
                    className="mr-2 font-jakarta text-[#202020] font-normal text-sm"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-sm font-jakarta text-[#1e88d4] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </form>

            <p className="text-sm text-[#202020] font-jakarta text-center mt-8">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-[#1e88d4] hover:underline font-jakarta"
                onClick={()=>navigate("/register")}
                
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
