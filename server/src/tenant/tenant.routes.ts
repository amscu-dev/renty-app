import express from "express";
import {
  createTenant,
  getTenant,
  updateTenant,
  addFavoriteProperty,
  removeFavoriteProperty,
  getCurrentResidences,
} from "./tenant.controllers";
import {
  createTenantValidator,
  updateUpdateValidator,
} from "./tenant.validator";

const router = express.Router();
router.route("/").post(createTenantValidator, createTenant);
router
  .route("/:cognitoId")
  .get(getTenant)
  .patch(updateUpdateValidator, updateTenant);
router.post("/:cognitoId/favorites/:propertyId", addFavoriteProperty);
router.delete("/:cognitoId/favorites/:propertyId", removeFavoriteProperty);
router.get("/:cognitoId/current-residences", getCurrentResidences);
export default router;
