import axios from 'axios';
import React, { useContext, useState, useRef } from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/context';

function ResetPassword() {
  const navigate = useNavigate();
  const { backendUrl } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [showOtp, setShowOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const updatedOtp = [...otpArray];
    updatedOtp[index] = value;
    setOtpArray(updatedOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
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
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return toast.error("Paste 6-digit OTP only");
    const newOtp = paste.split("");
    setOtpArray(newOtp);
    inputRefs.current[5]?.focus();
  };

  const otp = otpArray.join("");

  const sendOtpToEmail = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${backendUrl}/AuthApi/resetpassword`, { email }, { withCredentials: true });
      if (resp.data.success) {
        toast.success(resp.data.msg);
        setShowOtp(true);
      } else {
        toast.error(resp.data.msg || "Failed to send OTP");
      }
    } catch (e) {
      toast.error(e.message || "Failed to send OTP");
    }
  };

  const verifyHandler = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${backendUrl}/AuthApi/resetOtpVerify`, { email, otp }, { withCredentials: true });
      if (resp.data.success) {
        toast.success(resp.data.msg);
        setOtpVerified(true);
      } else {
        toast.error(resp.data.msg || "OTP verification failed");
      }
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Invalid OTP");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${backendUrl}/AuthApi/updatePassword`, { email, newPassword }, { withCredentials: true });
      if (resp.data.success) {
        toast.success("Password reset successfully");
        navigate("/login");
      } else {
        toast.error(resp.data.msg || "Reset failed");
      }
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Reset error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-400 px-4 relative">
      <img src={assets.logo} alt="Logo" className="absolute top-6 left-6 w-24 sm:w-28" />
      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-lg p-6 sm:p-8">
        {!showOtp && (
          <form className="space-y-5" onSubmit={sendOtpToEmail}>
            <h1 className="text-white text-2xl sm:text-3xl font-bold text-center">Reset Password</h1>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-white rounded-md bg-[#333A5C] focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
            >
              Send OTP
            </button>
          </form>
        )}

        {showOtp && !otpVerified && (
          <>
            <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-2">Verify OTP</h1>
            <p className="text-gray-300 text-sm sm:text-base mb-6 text-center">
              6-digit verification code sent to <b>{email}</b>
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
                    className="w-10 sm:w-12 h-10 sm:h-12 text-center text-xl font-semibold rounded-lg bg-[#333A5C] text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}

        {otpVerified && (
          <form className="space-y-5 mt-6" onSubmit={handlePasswordReset}>
            <h1 className="text-white text-2xl sm:text-3xl font-bold text-center mb-4">Set New Password</h1>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 text-white rounded-md bg-[#333A5C] focus:outline-none"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
