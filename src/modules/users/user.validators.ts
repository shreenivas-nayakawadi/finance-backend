import { body, param, query } from "express-validator";

export const listUsersValidator = [
  query("search")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Search must be a non-empty string"),
];

export const userIdParamValidator = [
  param("id").isUUID().withMessage("Valid user id is required"),
];

export const updateRoleValidator = [
  ...userIdParamValidator,
  body("role")
    .isIn(["VIEWER", "ANALYST", "ADMIN"])
    .withMessage("Role must be VIEWER, ANALYST, or ADMIN"),
];

export const updateStatusValidator = [
  ...userIdParamValidator,
  body("status")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE"),
];
