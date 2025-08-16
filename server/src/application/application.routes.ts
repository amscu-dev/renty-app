import express from "express";
import { protect, restricTo } from "../middleware/authMiddleware";
import {
  createApplication,
  listApplications,
  updateApplicationStatus,
} from "./application.controllers";
import { createApplicationValidator } from "./application.validator";

const router = express.Router();

router.post(
  "/",
  protect,
  restricTo(["tenant"]),
  createApplicationValidator,
  createApplication
);
router.patch(
  "/:id/status",
  protect,
  restricTo(["manager"]),
  updateApplicationStatus
);
router.get("/", protect, restricTo(["tenant", "manager"]), listApplications);

export default router;
