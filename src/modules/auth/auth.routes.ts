import { Router } from "express";
import { register, login, getMe } from "./auth.controller.js";
import { registerValidator, loginValidator } from "./auth.validators.js";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";

export const authRouter = Router();

authRouter.post("/register", registerValidator, validate, register);
authRouter.post("/login", loginValidator, validate, login);
authRouter.get("/me", authenticate, getMe);
