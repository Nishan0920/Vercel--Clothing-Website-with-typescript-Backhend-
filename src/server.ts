import express, { type Response, type Request } from "express";
import Database from "./db.js";
import Data from './Routes/CollectionData.js'
import cors from 'cors'
import UserData from './Routes/User.js'
const app = express();

const port = process.env.PORT || 2000;
Database()
app.use(cors())
app.use(express.json())
app.use("/api",Data)
app.use("/api",UserData)
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Server running at the ${port} `);
});
