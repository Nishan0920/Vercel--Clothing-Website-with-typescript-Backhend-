import express, { Router } from "express";
import User from "../Modals/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();
router.post("/signup", [
    body("name").isString().isLength({ min: 5 }),
    body("email").isEmail(),
    body("password").isString().isLength({ min: 6 })
], async (req, res) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                data: result.array()
            });
        }
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists"
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashData = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name,
            email,
            password: hashData,
        });
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }
        const payload = {
            user: { id: newUser.id }
        };
        const token = jwt.sign(payload, secret);
        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: { id: newUser.id, name: newUser.name, email: newUser.email },
            token: token
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
});
router.post("/signin", [
    body("email").isEmail(),
    body("password").isString().isLength({ min: 6 })
], async (req, res) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Invalid input data",
                data: result.array()
            });
        }
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is missing in environment variables");
        }
        const payload = {
            user: { id: existingUser.id }
        };
        const token = jwt.sign(payload, secret);
        res.status(200).json({
            success: true,
            message: "Login Successfully",
            data: { id: existingUser.id, name: existingUser.name, email: existingUser.email },
            token: token
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: `Server Error: ${error.message}`
        });
    }
});
export default router;
