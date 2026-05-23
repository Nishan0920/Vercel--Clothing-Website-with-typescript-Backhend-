import express,{ type Request, type Response} from "express";
import User from "../Modals/User.js";
import { body,validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const router = express.Router()
interface signupProps {
    success : boolean;
    data? : object;
    message  : string;
    token ? : string;
    
    

}
interface signinProps {
    success : boolean;
    data? : object;
    message  : string;
    token ? : string;
    
    

}
router.post("/signup",
    [
        body("name").isString().isLength({min : 5}),
        body("email").isEmail(),
        body("password").isString().isLength({min : 6})
    ], async (req:Request<signupProps>,res:Response<signupProps>)=>{
     try {
        const result = validationResult(req)
        if(!result.isEmpty()){
            res.status(400).json({
                success : false,
                message : "Cant create user",
                data : result
            })
        }
        const {name,email,password} = req.body
        const exisitingUser = await User.findOne({email})
        if(exisitingUser){
            return res.status(400).json({
                success : false,
                message : "User Already Exist"
               
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashData = await bcrypt.hash(password,salt)
        const newUser = await User.create({
            name,
            email,
            password: hashData,
        })
        const secret = process.env.JWT_SECRET!
        const Data = {
            user : {
                id : newUser.id
            }
        }
        const Token = jwt.sign(Data,secret)
         res.status(200).json({
            success : true,
            message : "User Created Successfully",
            data : newUser,
             token : Token
         })
     } catch (error) {
        res.status(400).json({
            success : false,
            message : `Cant create user ${error}`
        
     })
     }
})
router.post("/signin",
    [
      
        body("email").isEmail(),
        body("password").isString().isLength({min : 6})
    ], async (req:Request<signinProps>,res:Response<signinProps>)=>{
     try {
        const result = validationResult(req)
        if(!result.isEmpty()){
            res.status(400).json({
                success : false,
                message : "User Not Found",
                data : result
            })
        }
        const {email,password} = req.body
       
        const salt = await bcrypt.genSalt(10)
        const hashData = await bcrypt.hash(password,salt)
        const  exisitingUser = await User.findOne({email})
        if(!exisitingUser){
            return res.status(400).json({
                success : false ,
                message : "Invalid Credentials"
            })
        }
        const isMatch = await bcrypt.compare(password,exisitingUser.password)
        if(!isMatch){
            return res.status(400).json({
                success : false,
                message : "Password doesnt match"
            })
        }
        const secret = process.env.JWT_SECRET!
        const Data = {
            user : {
                id : exisitingUser.id
            }
        }
        const Token = jwt.sign(Data,secret)
         res.status(200).json({
            success : true,
            message : "Login Successfully",
            data : exisitingUser,
             token : Token
         })
     } catch (error) {
        res.status(400).json({
            success : false,
            message : `Cant login , ${error}`
        
     })
     }
})
export default router