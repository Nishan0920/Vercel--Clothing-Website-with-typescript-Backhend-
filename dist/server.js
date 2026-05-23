import express, {} from "express";
import Database from "./db.js";
import Data from './Routes/CollectionData.js';
import cors from 'cors';
import UserData from './Routes/User.js';
const app = express();
const port = process.env.PORT || 2000;
Database();
app.use(cors({
    origin: "https://vercel-clothing-website-with-typesc.vercel.app",
    credentials: true
}));
app.use(express.json());
app.use("/api", Data);
app.use("/api", UserData);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
export default app;
