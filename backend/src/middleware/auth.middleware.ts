import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const isAuthenticated = async (req: any, res: any, next: any) => {
    try {
        console.log("Cookies:", req.cookies);
        console.log("Auth Header:", req.headers.authorization);
        // Check for token in cookies first, then check Authorization header
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
        console.log("Extracted Token:", token);
        if(!token){
            return res.status(401).json({
                message:'User not authenticated',
                success:false
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET!) as any;
        if(!decode){
            return res.status(401).json({
                message:'Invalid token',
                success:false
            });
        }
        req.id = decode.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message:'Invalid token',
            success:false
        });
    }
}
export default isAuthenticated;