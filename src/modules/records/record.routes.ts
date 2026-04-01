import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import {
  createNewRecord,
  deleteRecord,
  getRecord,
  listRecords,
  updateExistingRecord,
} from "./record.controller.js";
import {
  createRecordValidator,
  listRecordsValidator,
  recordIdParamValidator,
  updateRecordValidator,
} from "./record.validators.js";

export const recordRouter = Router();

recordRouter.get(
  "/",
  authenticate,
  authorize("ANALYST", "ADMIN"),
  listRecordsValidator,
  validate,
  listRecords,
);

recordRouter.get(
  "/:id",
  authenticate,
  authorize("ANALYST", "ADMIN"),
  recordIdParamValidator,
  validate,
  getRecord,
);

recordRouter.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createRecordValidator,
  validate,
  createNewRecord,
);

recordRouter.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  updateRecordValidator,
  validate,
  updateExistingRecord,
);

recordRouter.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  recordIdParamValidator,
  validate,
  deleteRecord,
);
