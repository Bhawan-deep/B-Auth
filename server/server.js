import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();
const port = process.env.PORT;
const db = process.env.MONGO_URL;

// Middleware
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect(db, {
  serverSelectionTimeoutMS: 10000,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(() => console.error("❌ Failed to connect to MongoDB"));

// Routes
app.use("/AuthApi", authRouter);
app.use("/User", userRouter);

// Server start
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
