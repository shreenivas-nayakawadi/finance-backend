import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middlewares/authenticate.js";
import { sendSuccess } from "../../utils/response.js";
import {
  getCategoryBreakdown,
  getMonthlyTrends,
  getRecentActivity,
  getSummary,
} from "./dashboard.service.js";

export const summary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getSummary();
    sendSuccess(res, data, 200, "Dashboard summary fetched successfully");
  } catch (err) {
    next(err);
  }
};

export const categoryBreakdown = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getCategoryBreakdown();
    sendSuccess(
      res,
      { categories: data },
      200,
      "Category breakdown fetched successfully",
    );
  } catch (err) {
    next(err);
  }
};

export const monthlyTrends = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getMonthlyTrends();
    sendSuccess(
      res,
      { trends: data },
      200,
      "Monthly trends fetched successfully",
    );
  } catch (err) {
    next(err);
  }
};

export const recent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = req.query["limit"] ? Number(req.query["limit"]) : 10;
    const data = await getRecentActivity(limit);
    sendSuccess(
      res,
      { records: data },
      200,
      "Recent activity fetched successfully",
    );
  } catch (err) {
    next(err);
  }
};
