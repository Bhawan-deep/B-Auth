import express from 'express';
const router=express.Router(); 
import verifyTokenFromCookie from "../authMiddlewares/middleware.js"
import { register, login, logout ,sendOtp,verifyOtp,resetpassword,passwordUpdate,resetOtpVerify, IsAuthenticated} from '../controllers/AuthControllers.js';
router.post("/register",register)
router.post("/login",login)
router.post('/logout',logout)
router.post('/send-otp',verifyTokenFromCookie,sendOtp)
router.post('/verify-otp',verifyTokenFromCookie,verifyOtp)
router.post('/resetpassword',resetpassword)
router.post('/resetOtpVerify',resetOtpVerify)
router.post('/updatePassword',passwordUpdate)
router.get('/is-Auth',verifyTokenFromCookie,IsAuthenticated)


export default router;