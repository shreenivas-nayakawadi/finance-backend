import { body, param } from "express-validator";

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
