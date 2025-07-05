import express from 'express';
const userRouter=express.Router();
import Profile from "../controllers/userController.js"
import verifyTokenFromCookie from "../authMiddlewares/middleware.js"
userRouter.get('/profile',verifyTokenFromCookie,Profile)

export default userRouter;