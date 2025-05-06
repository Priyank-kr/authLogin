import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Button from "../components/Button.jsx";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import { useContext } from "react";

function ResetPassword() {
  axios.defaults.withCredentials = true;
 
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").split("");
    paste.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleResetPasswordEmailSubmit = async (e) => {
    try {
      e.preventDefault();
  
      const { data } = await axios.post(backendUrl + "/send-reset-otp", {email});
      if (data.success) {
        toast.success(data.success);
        setIsEmailSent(true)
       
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetPasswordOtpSubmit = async (e) => {
      e.preventDefault();
      const otp = inputRefs.current.map((e) => e.value).join("");
      setOtp(otp)
      setIsOtpSubmitted(true)     
  };

  const handleNewPassword = async (e) => {
    try {
      e.preventDefault();
      
      const { data } = await axios.post(backendUrl + "/reset-password", {
       email,otp, newPassword,
      });
      if (data.success) {
        toast.success(data.success);
      } else {
        toast.error(data.message);
      }
      navigate('/')
    } catch (error) {
      toast.error(error.message);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* Email form */}
      {!isEmailSent && (
      <div className="bg-slate-800 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm text-indigo-300 ">
        <form onSubmit={handleResetPasswordEmailSubmit}>
          <h2 className="text-3xl font-semibold text-white text-center mb-3">
            Reset Password
          </h2>
          <p className="text-center text-sm mb-6">
            Enter your registered email address
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="person" />
            <input
              type="email"
              placeholder="Email id"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-1 px-3 outline-none bg-transparent text-white placeholder:text-white placeholder:opacity-40"
            />
          </div>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">
            Submit
          </button>
        </form>
      </div>
)}

      {/* Reset Otp Form */}
      {!isOtpSubmitted && isEmailSent &&  
      <div className="bg-slate-800 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm text-indigo-300 ">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Reset Password Otp
        </h2>
        <p className="text-center text-sm mb-6">
          Enter Otp received in your email address
        </p>
        <form onSubmit={handleResetPasswordOtpSubmit}>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-xl"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">
            Submit
          </button>
        </form>
      </div>
}


{/* New Password form  */}
{isOtpSubmitted && isEmailSent && 
      <div className="bg-slate-800 p-10 rounded-lg shadow-lg w-full sm:w-96 text-sm text-indigo-300 ">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          New Password
        </h2>
        <p className="text-center text-sm mb-6">
          Enter New Password below
        </p>
        <form onSubmit={handleNewPassword}>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="person" />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="p-1 px-3 outline-none bg-transparent text-white placeholder:text-white placeholder:opacity-40"
            />
          </div>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer">
            Submit
          </button>
        </form>
      </div>
}
    </div>
  );
}

export default ResetPassword;
