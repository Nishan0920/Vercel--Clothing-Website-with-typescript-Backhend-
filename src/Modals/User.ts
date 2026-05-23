import mongoose,{Schema,Document,Model} from "mongoose";
  interface UserProps {
    name : string;
    password : string;
    email : string;
    createdAt ? : Date
}

const UserData = new Schema<UserProps>({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    }
   
},{
    timestamps : true
})
const User = mongoose.model("user",UserData)
export default User