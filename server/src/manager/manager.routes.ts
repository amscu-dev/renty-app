import express from "express";
import {
  createManager,
  getManager,
  updateManager,
  getManagerProperties,
} from "./manager.controllers";
import {
  createManagerValidator,
  updateManagerValidator,
} from "./manager.validator";

const router = express.Router();
router.get("/:cognitoId/properties", getManagerProperties);
router
  .route("/:cognitoId")
  .get(getManager)
  .patch(updateManagerValidator, updateManager);

router.route("/").post(createManagerValidator, createManager);
export default router;
