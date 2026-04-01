import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  body("role")
    .optional()
    .isIn(["VIEWER", "ANALYST", "ADMIN"])
    .withMessage("Role must be VIEWER, ANALYST, or ADMIN"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password is required"),
];
