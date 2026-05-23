import express, {} from "express";
import Database from "./db.js";
import Data from './Routes/CollectionData.js';
import cors from 'cors';
import UserData from './Routes/User.js';
const app = express();
app.use(cors({
    origin: "https://vercel-clothing-website-with-typesc.vercel.app",
    credentials: true
}));
app.use(express.json());
app.use(async (req, res, next) => {
    try {
        await Database();
        next();
    }
    catch (err) {
        res.status(500).send("Database connection failed");
    }
});
app.use("/api", Data);
app.use("/api", UserData);
app.get("/", (req, res) => {
    res.send("Hello World! Backend is Live.");
});
export default app;
