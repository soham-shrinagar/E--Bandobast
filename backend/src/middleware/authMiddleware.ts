import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthReq extends Request {
  decodedToken?: any;
}

export const isAuthenticated = (req: AuthReq, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token as string;

    if (!token) {
      return res.status(401).json({
        message: "Auth token is missing",
      });
    }

    if (!process.env.SECRET_KEY) {
      console.error("JWT_SECRET key missing!");
      return res.status(500).json({
        message: "Internal Server Error!",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.decodedToken = decoded;

    return next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
