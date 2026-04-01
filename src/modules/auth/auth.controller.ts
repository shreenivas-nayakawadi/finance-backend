// src/modules/auth/auth.controller.ts
import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middlewares/authenticate.js";
import { registerUser, loginUser } from "./auth.service.js";
import { sendSuccess } from "../../utils/response.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { Role } from "@prisma/client";

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: Role;
    };
    const user = await registerUser(name, email, password, role);
    sendSuccess(res, { user }, 201, "Account created successfully");
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { token, user } = await loginUser(email, password);
    sendSuccess(res, { token, user }, 200, "Login successful");
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
    if (!user) throw new AppError("User not found", 404);
    sendSuccess(res, { user }, 200, "Profile fetched successfully");
  } catch (err) {
    next(err);
  }
};
