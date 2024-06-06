import express from 'express';
import {User} from "../db"
import zod from "zod";                      // used for input validation
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config";

const app = express();
const router = express.Router();
const signupbody = zod.object({
    username:zod.string().email().min(3).max(30),
    password:zod.string().min(6),
    FirstName:zod.string().max(50),
    LastName:zod.stiring().max(50)
});

app.post("/signup", async(req, res) => {

    // in this way i tried to check the type of user input details
    const validation = signupbody.safeparse(req.body());
    if(!validation){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    // now check that any user exists or not same to this username
    const existsuser = await User.findOne({
        username:req.body.username,
    })
    if(existsuser){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    // collect all info from req body (creating user object from input )
    const user = await User.create({
        username:req.body.username,
        password:req.body.password,
        FirstName:req.body.FisrtName,
        LastName:req.body.LastName
    })

    const userId = user._id; // what is this
    const token = jwt.sign({userId}, JWT_SECRET);
    res.json({
        message:"User Created Successfully",
        token: token
    })

})

const signinbody = zod.object({
    username:zod.string(),
    password:zod.string()
})
app.post("/singin", async(req, res)=>{
    const validation = signinbody.safeparse(req.body());
    if(!validation){
        req.status(411).json({
            message: "Error while logging in"
        })
    }

    const existuser = await User.findOne({
        username:req.body.username,
        password:req.body.password
    })

    if(existuser){
        const token = jwt.sign({
            userId: User._id
        }, JWT_SECRET);

        res.json({
            token:token
        })

        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })

})



module.exports = router;