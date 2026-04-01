import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../../middlewares/authenticate.js";
import { sendSuccess } from "../../utils/response.js";
import * as userService from "./user.service.js";
import type { Role, UserStatus } from "@prisma/client";

export const listUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.listUsers();
    sendSuccess(res, { users }, 200, "Users fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.getUserById(req.params["id"] as string);
    sendSuccess(res, { user }, 200, "User fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const updateRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role } = req.body as { role: Role };
    const user = await userService.updateUserRole(
      req.params["id"] as string,
      role,
    );
    sendSuccess(res, { user }, 200, "User role updated successfully");
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status } = req.body as { status: UserStatus };
    const user = await userService.updateUserStatus(
      req.params["id"] as string,
      status,
    );
    sendSuccess(res, { user }, 200, "User status updated successfully");
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await userService.deleteUser(req.params["id"] as string);
    sendSuccess(res, null, 200, "User deleted successfully");
  } catch (err) {
    next(err);
  }
};
