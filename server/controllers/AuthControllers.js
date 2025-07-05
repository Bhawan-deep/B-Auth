import dotenv from 'dotenv';
dotenv.config();
import Users from "../models/Users.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../configs/mailTransporter.js';

const JWT_SECRET = process.env.JWT_SECRET;

const sendMail = async (to, subject, text, html = null) => {
    try {
        const mailOptions = {
            from: `"Auth" <bhawandeepsingh976@gmail.com>`,
            to,
            subject,
            text,
        };
        if (html) mailOptions.html = html;
        await transporter.sendMail(mailOptions);
    } catch (err) {}
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, msg: "Please fill all fields" });
    }

    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new Users({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        sendMail(
            email,
            process.env.Reg_Email_SUB,
            `You have successfully created an account with the email: ${email}`,
            `<p>You have successfully created an account with the email: <b>${email}</b></p>`
        );

        res.status(201).json({ success: true, msg: "User registered successfully" });
    } catch {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, msg: "Please fill all fields" });
    }

    try {
        const user = await Users.findOne({ email });
        if (!user) return res.status(400).json({ success: false, msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, msg: "Login successful" });
    } catch {
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        res.json({ success: true, msg: "Logged out successfully" });
    } catch {
        res.json({ success: false, msg: "Error logging out" });
    }
};

export const sendOtp = async (req, res) => {
    const id = req.userId;

    try {
        const user = await Users.findById(id);
        if (!user) return res.status(400).json({ success: false, msg: "User not found" });
        if (user.isAccountVerified) {
            return res.json({ success: false, msg: "User already verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.OtpExpireAt = Date.now() + 5 * 60 * 1000;
        await user.save();

        sendMail(
            user.email,
            process.env.Reg_Email_OTP,
            `Your otp is: ${otp}, Enter this otp to login`,
            `<p>Your otp is: <b>${otp}</b>, Enter this otp to login</p>`
        );

        res.json({ success: true, msg: "OTP sent successfully" });
    } catch {
        res.json({ success: false, msg: "Cannot send OTP" });
    }
};

export const verifyOtp = async (req, res) => {
    const id = req.userId;
    const { otp } = req.body;

    if (!id || !otp) {
        return res.json({ success: false, msg: "Missing details" });
    }

    try {
        const user = await Users.findById(id);
        if (!user) return res.status(400).json({ success: false, msg: "User not found" });
        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.json({ success: false, msg: "Please provide valid OTP" });
        }
        if (Date.now() > user.OtpExpireAt) {
            return res.status(400).json({ success: false, msg: "OTP expired" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.OtpExpireAt = 0;
        await user.save();

        res.json({ success: true, msg: "User verification successful" });
    } catch {
        res.json({ success: false, msg: "Please try again" });
    }
};

export const resetpassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, msg: "Please provide Email" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
        return res.json({ success: false, msg: "No user found, please enter valid Email" });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000;
        await user.save();

        sendMail(
            user.email,
            process.env.Reg_Email_OTP,
            `Your otp is: ${otp}, Enter this otp to reset password`,
            `<p>Your otp is: <b>${otp}</b>, Enter this otp to reset password</p>`
        );

        return res.json({ success: true, msg: "OTP sent successfully" });
    } catch {
        res.json({ success: false, msg: "Error occurred, try again" });
    }
};

export const resetOtpVerify = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, msg: "Please enter all fields" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
        return res.json({ success: false, msg: "No user found, please enter valid Email" });
    }

    try {
        if (!otp || otp !== user.resetOtp) {
            return res.json({ success: false, msg: "Please provide a valid OTP" });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, msg: "OTP expired, try again!" });
        }

        return res.json({ success: true, msg: "OTP Verified!" });
    } catch (e) {
        return res.json({ success: false, msg: e.message });
    }
};

export const passwordUpdate = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!newPassword) {
        return res.json({ success: false, msg: "Please enter Password" });
    }

    const user = await Users.findOne({ email });
    if (!user) {
        return res.json({ success: false, msg: "No user found, please enter valid Email" });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, msg: "Password updated successfully" });
    } catch (error) {
        return res.json({ success: false, msg: error.message });
    }
};

export const IsAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
