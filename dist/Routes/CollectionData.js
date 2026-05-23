import mongoose from "mongoose";
import express, {} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();
router.get("/data", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection not ready");
        }
        const fetch_data = await db.collection("ItemsData").find({}).toArray();
        res.status(200).json({
            success: true,
            message: "Successfully fetched all items",
            data: {
                ItemsData: fetch_data
            },
        });
    }
    catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});
export default router;
