import { query } from "express-validator";

export const recentActivityValidator = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100")
    .toInt(),
];
