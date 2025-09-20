import express from "express";
import { registration, loginWithEmail, loginWithId } from "./controllers/AuthControl.js";
import dotenv from "dotenv";
import cors from "cors";
import { isAuthenticated } from "./middleware/authMiddleware.js";
import type { RequestHandler } from "express";
import { extractCSV, extractExcel } from "./controllers/DashBoard.js";
import { sendOtpDev, verifyOtpDev } from "./controllers/otp.js";
import { getAllPersonnel } from "./controllers/DashBoard.js";
import { deletePersonnel } from "./controllers/DashBoard.js";

import { mobileLoginWithPhoneNumber, mobileRegistration } from "./controllers/mobileAuthControl.js";

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

app.post("/send-otp", isAuthenticated as RequestHandler, (req, res) => {
  const { phoneNumber } = req.body;
  sendOtpDev(phoneNumber); 
  res.json({ success: true, message: "OTP sent (check backend console)" });
});

app.post("/verify-otp", isAuthenticated as RequestHandler, (req, res) => {
  const { phoneNumber, otp } = req.body;
  const isValid = verifyOtpDev(phoneNumber, otp);
  if (isValid) {
    res.json({ success: true, message: "OTP verified ✅" });
  } else {
    res.json({ success: false, message: "Invalid OTP ❌" });
  }
});

app.post("/api/delete-personnel", isAuthenticated as RequestHandler,deletePersonnel);


app.post('/api/send-notification', isAuthenticated as RequestHandler, async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    const response = await fetch('https://your-notification-service.com/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
      }),
    });

    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to send notification' });
    }
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/api/extract-csv", isAuthenticated as RequestHandler ,extractCSV as any);
app.post("/api/extract-excel", isAuthenticated as RequestHandler ,extractExcel as any);
app.get("/api/personnel", isAuthenticated as RequestHandler,getAllPersonnel);
app.delete("/api/delete-personnel", isAuthenticated as RequestHandler, deletePersonnel);

app.get("/main", isAuthenticated as RequestHandler, (req, res) => {
  res.json({message: "Protected Dashboard"})
})













app.post("/api/mobileRegistration", mobileRegistration);
app.post("/api/mobileLogin", mobileLoginWithPhoneNumber)


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});