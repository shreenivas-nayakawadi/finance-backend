import { body, param, query } from "express-validator";

export const recordIdParamValidator = [
  param("id").isUUID().withMessage("Valid record id is required"),
];

export const listRecordsValidator = [
  query("search")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Search must be a non-empty string"),
  query("type")
    .optional()
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),
  query("category")
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Category must be a non-empty string"),
  query("from")
    .optional()
    .isISO8601()
    .withMessage("From must be a valid ISO 8601 date"),
  query("to")
    .optional()
    .isISO8601()
    .withMessage("To must be a valid ISO 8601 date"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be an integer greater than 0")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100")
    .toInt(),
];

export const createRecordValidator = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0")
    .toFloat(),
  body("type")
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),
  body("category").trim().notEmpty().withMessage("Category is required"),
  body("date").isISO8601().withMessage("Date must be a valid ISO 8601 date"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

export const updateRecordValidator = [
  ...recordIdParamValidator,
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0")
    .toFloat(),
  body("type")
    .optional()
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be INCOME or EXPENSE"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body().custom((value) => {
    if (
      value.amount === undefined &&
      value.type === undefined &&
      value.category === undefined &&
      value.date === undefined &&
      value.description === undefined
    ) {
      throw new Error("At least one field is required to update a record");
    }
    return true;
  }),
];
