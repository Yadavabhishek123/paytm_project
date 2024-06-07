import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

// this middleware verify the give token in header

const authmiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || authHeader.startswith('Bearer')){
        return res.status(403).json({}); 
    }

    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;

        next();
    }catch(err){
        return req.status(403).json({});
    }
}

export default authmiddleware;
