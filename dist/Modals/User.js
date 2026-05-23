import mongoose, { Schema, Document, Model } from "mongoose";
const UserData = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});
const User = mongoose.model("user", UserData);
export default User;
