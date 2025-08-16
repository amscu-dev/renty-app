import express from "express";
import { protect, restricTo } from "../middleware/authMiddleware";
import { getLeasePayments, getLeases } from "./lease.controllers";

const router = express.Router();

router.get("/", protect, restricTo(["manager", "tenant"]), getLeases);
router.get(
  "/:id/payments",
  protect,
  restricTo(["manager", "tenant"]),
  getLeasePayments
);

export default router;
