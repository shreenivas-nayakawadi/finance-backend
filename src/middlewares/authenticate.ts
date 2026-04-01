import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import type { Role } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: { userId: string; role: Role };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new AppError("No token provided", 401);
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      role: Role;
    };
    req.user = decoded;
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
};
