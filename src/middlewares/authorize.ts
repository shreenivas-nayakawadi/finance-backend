import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authenticate.js";
import { AppError } from "../utils/AppError.js";
import type { Role } from "@prisma/client";

export const authorize =
  (...roles: Role[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Forbidden: insufficient permissions", 403);
    }
    next();
  };
