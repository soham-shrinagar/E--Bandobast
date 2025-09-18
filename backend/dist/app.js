import express from "express";
import { registration, loginWithEmail, loginWithId } from "./controllers/AuthControl.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.post("/api/registration", registration);
app.post("/api/login-email", loginWithEmail);
app.post("/api/login-Id", loginWithId);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map