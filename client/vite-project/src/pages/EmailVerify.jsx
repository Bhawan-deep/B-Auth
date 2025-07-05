import React, { useState, useRef, useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../contexts/context";
import axios from 'axios';
import { toast } from "react-toastify";

function EmailVerify() {
  const navigate = useNavigate();
  const { backendUrl, userdata, isLoggedIn, getUserData } = useContext(UserContext);

  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn === "true" && userdata?.registered) {
      navigate("/home");
    }
  }, [isLoggedIn, userdata]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const updatedOtp = [...otpArray];
    updatedOtp[index] = value;
    setOtpArray(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      const updatedOtp = [...otpArray];
      updatedOtp[index - 1] = "";
      setOtpArray(updatedOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    if (!/^\d{6}$/.test(paste)) {
      return toast.error("Please paste a 6-digit OTP only");
    }
    const newOtp = paste.split("");
    setOtpArray(newOtp);
    const nextEmpty = newOtp.findIndex((d) => d === "");
    if (nextEmpty === -1) inputRefs.current[5]?.focus();
    else inputRefs.current[nextEmpty]?.focus();
  };

  const verifyHandler = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(
        `${backendUrl}/AuthApi/verify-otp`,
        { otp: otpArray.join("") },
        { withCredentials: true }
      );

      if (resp.data.success) {
        toast.success(resp.data.msg);
        await getUserData();
        navigate("/home");
      } else {
        toast.error(resp.data.msg || "Failed to verify OTP");
      }
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Invalid OTP or request");
    }
  };

  const sendOtp = async () => {
    try {
      const resp = await axios.post(`${backendUrl}/AuthApi/send-otp`, {}, { withCredentials: true });
      if (resp.data.success) {
        toast.success(resp.data.msg);
      } else {
        toast.error(resp.data.msg || "Failed to send OTP");
      }
    } catch (e) {
      toast.error(e.message || "Failed to send OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-400 relative px-4 py-6 sm:px-6">
      <img src={assets.logo} alt="Logo" className="absolute top-4 left-4 w-20 sm:w-28" />

      <div className="w-full max-w-sm sm:max-w-md bg-slate-900 rounded-3xl shadow-xl p-6 sm:p-8">
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-3 text-center">
          Verify Your Email
        </h1>

        <p className="text-gray-300 text-sm sm:text-base mb-6 text-center leading-relaxed">
          We've sent a 6-digit verification code to <b>{userdata?.email}</b>.
          Please enter the code below to verify your email and continue.
        </p>

        <form className="space-y-6" onSubmit={verifyHandler}>
          <div className="flex justify-center gap-2 sm:gap-3">
            {otpArray.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onPaste={handlePaste}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold rounded-md sm:rounded-lg bg-[#333A5C] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2 sm:py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200 text-sm sm:text-base"
          >
            Verify
          </button>

          <p className="text-gray-400 text-sm text-center">
            Didn’t receive the code?{" "}
            <span
              className="text-purple-400 hover:underline cursor-pointer"
              onClick={() => {
                if (count < 3) {
                  setCount((prev) => prev + 1);
                  sendOtp();
                } else {
                  toast.error("You have exceeded the OTP requests! Please try again later.");
                }
              }}
            >
              Resend
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default EmailVerify;
