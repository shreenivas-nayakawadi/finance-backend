import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import * as ctrl from "./user.controller.js";
import {
  userIdParamValidator,
  updateRoleValidator,
  updateStatusValidator,
} from "./user.validators.js";

export const userRouter = Router();

userRouter.use(authenticate);

userRouter.get("/", authorize("ADMIN"), ctrl.listUsers);
userRouter.get(
  "/:id",
  authorize("ADMIN"),
  userIdParamValidator,
  validate,
  ctrl.getUser,
);
userRouter.patch(
  "/:id/role",
  authorize("ADMIN"),
  updateRoleValidator,
  validate,
  ctrl.updateRole,
);
userRouter.patch(
  "/:id/status",
  authorize("ADMIN"),
  updateStatusValidator,
  validate,
  ctrl.updateStatus,
);
userRouter.delete(
  "/:id",
  authorize("ADMIN"),
  userIdParamValidator,
  validate,
  ctrl.deleteUser,
);
