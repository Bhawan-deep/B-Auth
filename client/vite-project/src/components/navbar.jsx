import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { UserContext } from "../contexts/context";
import axios from 'axios';
import { toast } from "react-toastify";

export default function Navbar() {
  const {
    backendUrl,
    SetUserData,
    isLoggedIn,
    SetisLoggedIn,
    userdata,
  } = useContext(UserContext);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoginClick = () => navigate('/login');

  const sendOtp = async () => {
    try {
      const resp = await axios.post(
        `${backendUrl}/AuthApi/send-otp`,
        {},
        { withCredentials: true }
      );
      if (resp.data.success) {
        toast.success(resp.data.msg);
        navigate("/emailverify");
      } else {
        toast.error(resp.data.msg || "Failed to send OTP");
      }
    } catch (e) {
      toast.error(e.message || "Failed to send OTP");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/AuthApi/logout`, {}, { withCredentials: true });
      SetisLoggedIn("false");
      SetUserData("");
      navigate("/home");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
  <nav className="w-full fixed top-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between  ">


     
      <img src={assets.logo} alt="Logo" className="w-24 sm:w-32" />

     
      <div className="hidden sm:flex items-center gap-4">
        {isLoggedIn === "true" ? (
          <div className="relative group">
            <div className="bg-black text-white rounded-full flex items-center justify-center h-8 w-8 cursor-pointer uppercase">
              {userdata?.name?.[0]}
            </div>
            <ul className="absolute top-10 right-0 bg-white border border-gray-300 shadow-md rounded-md text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 min-w-[120px]">
              {userdata?.registered === false && (
                <li
                  className="hover:bg-gray-100 px-4 py-2 rounded-t cursor-pointer"
                  onClick={sendOtp}
                >
                  Verify Email
                </li>
              )}
              <li
                className="hover:bg-red-400 px-4 py-2 rounded-b cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={handleLoginClick}
            className="flex items-center gap-1 border border-gray-600 text-gray-800 px-5 py-2 rounded-full hover:bg-gray-200 transition-all"
          >
            Login
            <img src={assets.arrow_icon} alt="Arrow" className="w-3 h-4" />
          </button>
        )}
      </div>

  
      <div className="sm:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <img
            src={assets.menu_icon || assets.arrow_icon}
            alt="Menu"
            className="w-6 h-6"
          />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-lg sm:hidden flex flex-col items-center text-sm py-4 z-40">
          {isLoggedIn === "true" ? (
            <>
              <div className="text-black mb-2 uppercase font-semibold">
                {userdata?.name}
              </div>
              {userdata?.registered === false && (
                <button
                  className="w-full text-left px-6 py-2 hover:bg-gray-100"
                  onClick={sendOtp}
                >
                  Verify Email
                </button>
              )}
              <button
                className="w-full text-left px-6 py-2 hover:bg-red-400"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="w-full text-left px-6 py-2 hover:bg-gray-200"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

