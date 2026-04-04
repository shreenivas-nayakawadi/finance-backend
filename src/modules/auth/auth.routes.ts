import { Router } from "express";
import { register, login, getMe } from "./auth.controller.js";
import { registerValidator, loginValidator } from "./auth.validators.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

export const authRouter = Router();

authRouter.post("/register", authLimiter, registerValidator, validate, register);
authRouter.post("/login", authLimiter, loginValidator, validate, login);
authRouter.get("/me", authenticate, getMe);
