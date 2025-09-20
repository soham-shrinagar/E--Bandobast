import express from "express";
import { registration, loginWithEmail, loginWithId } from "./controllers/AuthControl.js";
import dotenv from "dotenv";
import cors from "cors";
import { isAuthenticated } from "./middleware/authMiddleware.js";
import { extractCSV, extractExcel } from "./controllers/DashBoard.js";
import { sendOtpDev, verifyOtpDev } from "./controllers/otp.js";
import { getAllPersonnel } from "./controllers/DashBoard.js";
import { deletePersonnel } from "./controllers/DashBoard.js";
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
app.post("/send-otp", isAuthenticated, (req, res) => {
    const { phoneNumber } = req.body;
    sendOtpDev(phoneNumber);
    res.json({ success: true, message: "OTP sent (check backend console)" });
});
app.post("/verify-otp", isAuthenticated, (req, res) => {
    const { phoneNumber, otp } = req.body;
    const isValid = verifyOtpDev(phoneNumber, otp);
    if (isValid) {
        res.json({ success: true, message: "OTP verified ✅" });
    }
    else {
        res.json({ success: false, message: "Invalid OTP ❌" });
    }
});
app.post("/api/delete-personnel", isAuthenticated, deletePersonnel);
app.post('/api/send-notification', isAuthenticated, async (req, res) => {
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
        }
        else {
            res.status(500).json({ error: 'Failed to send notification' });
        }
    }
    catch (error) {
        console.error('Notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post("/api/extract-csv", isAuthenticated, extractCSV);
app.post("/api/extract-excel", isAuthenticated, extractExcel);
app.get("/api/personnel", isAuthenticated, getAllPersonnel);
app.delete("/api/delete-personnel", isAuthenticated, deletePersonnel);
app.get("/main", isAuthenticated, (req, res) => {
    res.json({ message: "Protected Dashboard" });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map