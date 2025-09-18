import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export interface AuthReq extends Request{
    userId?: string | JwtPayload;
}

export const isAuthenticated = (req: AuthReq, res: Response, next: NextFunction) => {
    try{
        const token = req.headers.token as string;

        if(!token){
            res.status(401).json({
                message: "Auth token is missing"
            });
            console.log("Error from middleware");
            return;
        }

        if(!process.env.SECRET_KEY){
            res.status(500).json({
                message: "Internal Server Error!"
            });
            console.log("JWT_SECRET key missing!");
            return;
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;

        if(typeof decoded == "object" && decoded.userId){
            req.userId = decoded.userId;
            return next();
        }
        else{
            return res.status(401).json({
                message: "Invalid token payload"
            });
        }
    }
    catch(err){
        console.error("JWT verification error: ", err);
        console.log("Error from middleware");

        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token"
        });
    }
};