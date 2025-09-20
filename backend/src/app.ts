import express from "express";
import { registration, loginWithEmail, loginWithId } from "./controllers/AuthControl.js";
import dotenv from "dotenv";
import cors from "cors";
import { isAuthenticated } from "./middleware/authMiddleware.js";
import type { RequestHandler } from "express";
import { extractCSV, extractExcel } from "./controllers/DashBoard.js";
import { sendOtpDev, verifyOtpDev } from "./controllers/otp.js";
import { getAllPersonnel } from "./controllers/DashBoard.js";

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
//app.post("/api/extract-csv", extractCSV);
//app.post("/api/extract-excel", extractExcel);

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


// Example backend API route (Node.js/Express)
app.post('/api/send-notification', async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    // Here you would integrate with your mobile notification service
    // This could be Firebase Cloud Messaging (FCM), Twilio, or a custom solution
    
    // Example using a hypothetical notification service
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

app.post("/api/extract-csv", extractCSV as any);
app.post("/api/extract-excel", extractExcel as any);
app.get("/api/personnel", getAllPersonnel);
app.listen(3000, () => console.log("Server running on :3000"));


const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});