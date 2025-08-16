import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
} from "./property.controllers";
import multer from "multer";
import { protect, restricTo } from "../middleware/authMiddleware";
import { MAX_FILE_NUMBER, MAX_FILE_SIZE } from "../constants";
import { fileValidation } from "../middleware/fileTypeValidationMiddleware";
import { parseMultipartData } from "../utils/parseMultipartData";
import { createPropertyValidator } from "./property.validator";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router
  .route("/")
  .post(
    protect,
    restricTo(["manager"]),
    upload.array("photos", MAX_FILE_NUMBER),
    fileValidation,
    parseMultipartData,
    createPropertyValidator,
    createProperty
  );

export default router;
