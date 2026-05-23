import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongouri = process.env.MONGO_URI;
if (!mongouri) {
    throw new Error("MONGO_URI is missing from the .env");
}
const ConnectDB = async () => {
    try {
        const db = await mongoose.connect(mongouri);
        console.log("Connected Successfully");
    }
    catch (error) {
        console.log("Database is not online");
    }
};
export default ConnectDB;
