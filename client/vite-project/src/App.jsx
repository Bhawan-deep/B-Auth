import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

import ResetPassword from './pages/ResetPassword';
import UserContextProvider from './contexts/context';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmailVerify from './pages/EmailVerify';
function App() {
  return (
    <BrowserRouter>
    
    <UserContextProvider>
      <ToastContainer/>
 <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/emailverify" element={<EmailVerify />} />
         <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
    </UserContextProvider>
      
    </BrowserRouter>
  )
}

export default App
