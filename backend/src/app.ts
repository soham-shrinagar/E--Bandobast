import express from "express";
import { registration, loginWithEmail, loginWithId } from "./controllers/AuthControl.js";
import dotenv from "dotenv";
import cors from "cors";
import { isAuthenticated } from "./middleware/authMiddleware.js";
import type { RequestHandler } from "express";
import { extractCSV, extractExcel } from "./controllers/DashBoard.js";
import { sendOtpDev, verifyOtpDev } from "./controllers/otp.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); 
  },
  credentials: true
}));

app.use(express.json());

app.post("/api/registration", registration);
app.post("/api/login-email", loginWithEmail);
app.post("/api/login-Id", loginWithId);
app.post("/api/extract-csv", extractCSV);
app.post("/api/extract-excel", extractExcel);

// Officer sends OTP to a user
app.post("/send-otp", (req, res) => {
  const { phoneNumber } = req.body;
  sendOtpDev(phoneNumber); // generates + logs OTP in console
  res.json({ success: true, message: "OTP sent (check backend console)" });
});

// User enters OTP from mobile app
app.post("/verify-otp", (req, res) => {
  const { phoneNumber, otp } = req.body;
  const isValid = verifyOtpDev(phoneNumber, otp);
  if (isValid) {
    res.json({ success: true, message: "OTP verified ✅" });
  } else {
    res.json({ success: false, message: "Invalid OTP ❌" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});