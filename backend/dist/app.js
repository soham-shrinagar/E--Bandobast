import express from "express";
import { registration, loginWithEmail, loginWithId } from "./controllers/AuthControl.js";
import dotenv from "dotenv";
import cors from "cors";
import { isAuthenticated } from "./middleware/authMiddleware.js";
import { extractCSV, extractExcel } from "./controllers/DashBoard.js";
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
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map