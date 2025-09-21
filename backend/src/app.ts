import express from "express";
import {
  registration,
  loginWithEmail,
  loginWithId,
} from "./controllers/AuthControl.js";
import dotenv from "dotenv";
import cors from "cors";
import { isAuthenticated } from "./middleware/authMiddleware.js";
import type { RequestHandler } from "express";
import { extractCSV, extractExcel } from "./controllers/DashBoard.js";
import { sendOtpDev, verifyOtpDev } from "./controllers/otp.js";
import { getAllPersonnel, getAllGeofences } from "./controllers/DashBoard.js";
import { deletePersonnel } from "./controllers/DashBoard.js";
import prisma from "./db/client.js";
import {
  mobileLoginWithPhoneNumber,
  mobileRegistration,
} from "./controllers/mobileAuthControl.js";
import { newGeofence } from "./controllers/DashBoard.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

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

app.post(
  "/api/delete-personnel",
  isAuthenticated as RequestHandler,
  deletePersonnel
);

app.post(
  "/api/send-notification",
  isAuthenticated as RequestHandler,
  async (req, res) => {
    const { phoneNumber, message } = req.body;

    try {
      const response = await fetch(
        "https://your-notification-service.com/send",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer YOUR_API_KEY",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: phoneNumber,
            message: message,
          }),
        }
      );

      if (response.ok) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to send notification" });
      }
    } catch (error) {
      console.error("Notification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/api/extract-csv",
  isAuthenticated as RequestHandler,
  extractCSV as any
);
app.post(
  "/api/extract-excel",
  isAuthenticated as RequestHandler,
  extractExcel as any
);
app.get("/api/personnel", isAuthenticated as RequestHandler, getAllPersonnel);
app.delete(
  "/api/delete-personnel",
  isAuthenticated as RequestHandler,
  deletePersonnel
);

app.get("/main", isAuthenticated as RequestHandler, (req, res) => {
  res.json({ message: "Protected Dashboard" });
});

app.post("/api/mobileRegistration", mobileRegistration);
app.post("/api/mobileLogin", mobileLoginWithPhoneNumber);

app.post("/api/updateCoords", async (req, res) => {
  const { phoneNumber, coords } = req.body;

  if (!phoneNumber || !coords) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const updatedUser = await prisma.personnelMobile.update({
      where: { phoneNumber },
      //@ts-ignore
      data: { currentCords: coords },
    });
    console.log("Updating coords for", phoneNumber, coords);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update coords" });
  }
});

app.get("/api/geofences", isAuthenticated as RequestHandler, getAllGeofences);
//@ts-ignore
app.post("/api/save-geofence", newGeofence);

app.post("/api/deploy-personnel", async (req, res) => {
  const { phoneNumbers, geofenceId } = req.body;

  if (!phoneNumbers?.length || !geofenceId) {
    return res
      .status(400)
      .json({ error: "Missing phoneNumbers or geofenceId" });
  }

  try {
    // Fetch geofence name
    const geofence = await prisma.geofencing.findUnique({
      where: { id: geofenceId },
    });
    if (!geofence) return res.status(404).json({ error: "Geofence not found" });

    // Update personnelMobile records
    const updated = await prisma.personnelMobile.updateMany({
      where: { phoneNumber: { in: phoneNumbers } },
      data: {
        deployed: true,
        //@ts-ignore
        geofenceId: geofence.id
      },
    });

    return res.json({ message: "Personnel deployed", count: updated.count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});
// app.get("/api/geofence/:phoneNumber", async (req, res) => {
//   const { phoneNumber } = req.params;
//   try {
//     const user = await prisma.personnelMobile.findUnique({
//       where: { phoneNumber },
//     });

//     if (!user || !user.deployed || !user.geofenceId) {
//       return res.status(404).json({ error: "User not deployed or geofence not set" });
//     }

//     const geofence = await prisma.geofencing.findUnique({
//       where: { id: user.geofenceId },
//     });

//     if (!geofence) return res.status(404).json({ error: "Geofence not found" });

//     res.json(geofence);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

app.get("/api/geofence/:id/personnel", async (req, res) => {
  const { id } = req.params;

  try {
    const personnel = await prisma.personnelMobile.findMany({
      where: {
        deployed: true,
        geofenceId: Number(id),
      },
      select: {
        phoneNumber: true,
        currentCords: true, // assuming coords is stored as { lat, long }
      },
    });

    res.json(personnel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
