import express from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes.js";
import { userRouter } from "./modules/users/user.routes.js";
import { recordRouter } from "./modules/records/record.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(globalLimiter);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Finance Backend API is running", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/records", recordRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
