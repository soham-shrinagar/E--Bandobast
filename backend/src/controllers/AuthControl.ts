import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import prisma from "../db/client.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import { insertUser } from "../db/dbfunction.js";
import { getUserByEmail } from "../db/dbfunction.js";
import { getUserById } from "../db/dbfunction.js";


export const registration = async(req: Request, res: Response) => {
    try{
        const reqBody = z.object({
            officerId: z.string().min(1).max(50),
            name: z.string().min(3).max(100),
            email: z.string().min(3).max(200).email(),
            password: z.string().min(3).max(100),
            gender: z.string(),
            age: z.number(),
            phoneNumber: z.string().min(10).max(10),
            stationName: z.string().min(1).max(200) 
        });

        const safeParseData = reqBody.safeParse(req.body);

        if(!safeParseData.success){
            res.status(401).json({
                message: "Invalid Inputs"
            });
            console.error("Error from registration endpoint: ", safeParseData.error);
            return;
        }

        const { officerId, name, email, password, gender, age, phoneNumber, stationName } = safeParseData.data;

        const checkEmail = await prisma.officer.findUnique({where: {email}});
        const checkPhoneNumber = await prisma.officer.findUnique({where: {phoneNumber}});
        const checkOfficerId = await prisma.officer.findUnique({where: {officerId}});

        if(checkEmail || checkOfficerId || checkPhoneNumber){
            return res.status(401).json({
                message: "User with these credentials already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newOfficer = await insertUser(officerId, name, email, hashPassword, gender, age, phoneNumber, stationName);

        res.status(200).json({
            message: "Registration Sucessfull",
            officer: {id: newOfficer.officerId, name: newOfficer.name, stationName: newOfficer.stationName}
        });
    }
    catch(err){
        console.error("Something went wrong: ", err);
        console.log("Error from backend registration endpoint");
        return res.status(401).json({
            message: "Registration Failed!"
        });
    }
}

export const loginWithEmail = async(req: Request, res: Response) => {
    try{
        const reqBody = z.object({
            email: z.string().min(3).max(200).email(),
            password: z.string().min(3).max(50)
        });

        const safeParseData = reqBody.safeParse(req.body);

        if(!safeParseData.success){
            res.status(401).json({
                message: "Invalid inputs"
            });
            console.log("Error from signin endpoint from backend");
            console.error(safeParseData.error);
            return;
        }

        const { email, password } = safeParseData.data;
        const existingUser = await getUserByEmail(email);

        if(!existingUser){
            return res.status(401).json({
                message: "User with this email does not exists"
            });
        }
        //@ts-ignore
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchPassword){
            return res.status(401).json({
                message: "Incorrect Password"
            });
        }

        if(!process.env.SECRET_KEY){
            res.status(500).json({
                message: "Internal server error"
            });
            console.log("JWT_SECRET missing");
            return;
        }

        const token = jwt.sign({ userId: existingUser.id }, process.env.SECRET_KEY, {
            expiresIn: "3h"
        });

        res.status(200).json({
            message: "You have successfully logged in", 
            token: token,
            officer: existingUser.name,
            officerId: existingUser.officerId
        });
    }
    catch(err){
        res.status(401).json({
            message: "Something went wrong"
        });
        console.log("Error from login endpoint from the backend");
        console.error(err);
    }
}

export const loginWithId = async(req: Request, res: Response) => {
    try{
        const reqBody = z.object({
            officerId: z.string().min(1).max(50),
            password: z.string().min(3).max(50)
        });

        const safeParseData = reqBody.safeParse(req.body);

        if(!safeParseData.success){
            res.status(401).json({
                message: "Invalid inputs"
            });
            console.log("Error from signin endpoint from backend");
            console.error(safeParseData.error);
            return;
        }

        const { officerId, password } = safeParseData.data;
        const existingUser = await getUserById(officerId);

        if(!existingUser){
            return res.status(401).json({
                message: "User with this email does not exists"
            });
        }
        //@ts-ignore
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchPassword){
            return res.status(401).json({
                message: "Incorrect Password"
            });
        }

        if(!process.env.SECRET_KEY){
            res.status(500).json({
                message: "Internal server error"
            });
            console.log("JWT_SECRET missing");
            return;
        }

        const token = jwt.sign({ userId: existingUser.id }, process.env.SECRET_KEY, {
            expiresIn: "3h"
        });

        res.status(200).json({
            message: "You have successfully logged in", 
            token: token,
            officer: existingUser.name,
            officerId: existingUser.officerId
        });
    }
    catch(err){
        res.status(401).json({
            message: "Something went wrong"
        });
        console.log("Error from login endpoint from the backend");
        console.error(err);
    }
}