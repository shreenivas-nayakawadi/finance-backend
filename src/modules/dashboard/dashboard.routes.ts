import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import {
  categoryBreakdown,
  monthlyTrends,
  recent,
  summary,
} from "./dashboard.controller.js";
import { recentActivityValidator } from "./dashboard.validators.js";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/summary",
  authenticate,
  authorize("ANALYST", "ADMIN", "VIEWER"),
  summary,
);

dashboardRouter.get(
  "/categories",
  authenticate,
  authorize("ANALYST", "ADMIN"),
  categoryBreakdown,
);

dashboardRouter.get(
  "/trends",
  authenticate,
  authorize("ANALYST", "ADMIN"),
  monthlyTrends,
);

dashboardRouter.get(
  "/recent",
  authenticate,
  authorize("ANALYST", "ADMIN", "VIEWER"),
  recentActivityValidator,
  validate,
  recent,
);
