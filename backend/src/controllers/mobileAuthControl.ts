import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../db/client.js";
import bcrypt from "bcrypt";
import { insertMobileUser } from "../db/mobiledbfunction.js";
import { getMobileUserByPhoneNumber } from "../db/mobiledbfunction.js";

export const mobileRegistration = async (req: Request, res: Response) => {
  try {
    const reqBody = z.object({
      phoneNumber: z.string().min(10).max(10),
      password: z.string().min(3).max(100),
    });

    const safeParseData = reqBody.safeParse(req.body);

    if (!safeParseData.success) {
      res.status(401).json({
        message: "Invalid Inputs",
      });
      console.error(
        "Error from mobileRegistration endpoint: ",
        safeParseData.error
      );
      return;
    }

    const { phoneNumber, password } = safeParseData.data;

    const checkPhoneNumber = await prisma.personnelMobile.findUnique({
      where: { phoneNumber },
    });

    if (checkPhoneNumber) {
      return res.status(401).json({
        message: "User with these credentials already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newPersonnelMobile = await insertMobileUser(
      phoneNumber,
      hashPassword
    );

    res.status(200).json({
      message: "mobileRegistration Sucessfull",
      officer: {
        phoneNumber: newPersonnelMobile.phoneNumber,
      },
    });
  } catch (err) {
    console.error("Something went wrong: ", err);
    console.log("Error from backend mobileRegistration endpoint");
    return res.status(401).json({
      message: "Registration Failed!",
    });
  }
};

export const mobileLoginWithPhoneNumber = async (
  req: Request,
  res: Response
) => {
  try {
    const reqBody = z.object({
      phoneNumber: z.string().min(10).max(10),
      password: z.string().min(3).max(100),
    });

    const safeParseData = reqBody.safeParse(req.body);

    if (!safeParseData.success) {
      res.status(401).json({
        message: "Invalid inputs",
      });
      console.log(
        "Error from mobileLoginWithPhoneNumber endpoint from backend"
      );
      console.error(safeParseData.error);
      return;
    }

    const { phoneNumber, password } = safeParseData.data;
    const existingUser = await getMobileUserByPhoneNumber(phoneNumber);

    if (!existingUser) {
      return res.status(401).json({
        message: "User with this phone number does not exists",
      });
    }
    //@ts-ignore
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }
    if (!process.env.SECRET_KEY) {
      res.status(500).json({
        message: "Internal server error",
      });
      console.log("JWT_SECRET missing");
      return;
    }

    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );

    res.status(200).json({
      message: "You have successfully logged in",
      token: token,
      personnelMobile: existingUser.phoneNumber,
    });
  } catch (err) {
    res.status(401).json({
      message: "Something went wrong",
    });
    console.log(
      "Error from mobileLoginWithPhoneNumber endpoint from the backend"
    );
    console.error(err);
  }
};
