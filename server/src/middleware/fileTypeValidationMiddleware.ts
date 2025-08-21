import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    console.log("HIT: Validate MIME TYPE Middleware 🌀");
    const { fileTypeFromBuffer } = await import("file-type");
    // 01. Get Files
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return next(new AppError("No files uploaded.", StatusCodes.BAD_REQUEST));
    }

    // 02. Get Buffer for each file
    const bufferArray = files?.map((file: Express.Multer.File) => file.buffer);
    for (const buffer of bufferArray) {
      // validate
      const type = await fileTypeFromBuffer(buffer);

      if (!type || !ALLOWED.has(type.mime))
        return next(
          new AppError(
            "The uploaded file type is not supported. Permitted types: image/jpeg, image/png, image/webp.",
            StatusCodes.UNSUPPORTED_MEDIA_TYPE
          )
        );
    }
    return next();
  } catch (error) {
    return next(
      new AppError(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
