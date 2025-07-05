import axios from 'axios';
axios.defaults.withCredentials = true;

import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/context';

function Login() {
  const navigate = useNavigate();
  const { backendUrl, SetisLoggedIn, getUserData } = useContext(UserContext);

  const [state, setState] = useState("Sign-up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleForgot = () => {
    navigate("/resetPassword");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = state === "Sign-up"
      ? `${backendUrl}/AuthApi/register`
      : `${backendUrl}/AuthApi/login`;

    const payload = state === "Sign-up"
      ? { name, email, password }
      : { email, password };

    try {
      const res = await axios.post(url, payload);
      if (res.data.success) {
        toast.success(res.data.msg);
        SetisLoggedIn("true");
        getUserData();
        navigate("/home");
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Something went wrong");
    }
  };

  const toggleState = () => {
    setState(prev => (prev === "Sign-up" ? "Login" : "Sign-up"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-400 px-4 py-8 sm:px-6 lg:px-8 relative">
      
      <img src={assets.logo} alt="Logo" className="absolute top-4 left-4 w-20 sm:w-24 lg:w-28" />

      <div className="w-full max-w-md bg-slate-900 rounded-3xl shadow-lg p-6 sm:p-8">
        <h1 className="text-white text-2xl sm:text-3xl font-bold mb-2 text-center">
          {state === 'Sign-up' ? 'Create Account' : 'Login Account'}
        </h1>
        <p className="text-center mb-6 text-white/70 text-sm sm:text-base">
          {state === 'Sign-up' ? 'Create your Account' : 'Welcome Back!'}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {state === 'Sign-up' && (
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-white rounded-md bg-[#333A5C] focus:outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-white rounded-md bg-[#333A5C] focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-white rounded-md bg-[#333A5C] focus:outline-none"
            required
          />

          {state !== 'Sign-up' && (
            <p
              onClick={handleForgot}
              className="text-blue-400 cursor-pointer hover:underline text-sm text-right"
            >
              Forgot password?
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
          >
            {state}
          </button>
        </form>

        <p className="mt-4 text-white text-sm text-center">
          {state === 'Sign-up' ? "Already have an account?" : "Don't have an account?"}
          <span
            onClick={toggleState}
            className="text-blue-400 cursor-pointer hover:underline ml-1"
          >
            {state === 'Sign-up' ? "Login" : "Sign-Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

