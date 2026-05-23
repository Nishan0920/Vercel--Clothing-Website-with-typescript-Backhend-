import mongoose from "mongoose";
import express, { type Response, type Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const router = express.Router();

interface Product {
  _id: string;
  id: number;
  category: string;
  for?: string;
  gender?: string;
  name: string;
  description: string;
  image: string;
  sizes: any[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    ItemsData : Product[]
  };
}

router.get("/data", async (req: Request, res: Response<ApiResponse>) => {
  try {
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error("Database connection not ready");
    }

    const fetch_data = await db.collection("ItemsData").find({}).toArray()as unknown as Product[]

    res.status(200).json({
      success: true,
      message: "Successfully fetched all items",
      data: {
        ItemsData : fetch_data
      },
    });
    
  } catch (error) {
    console.error("Fetch Error:", error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
});

export default router;
