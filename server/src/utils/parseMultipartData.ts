// parseMultipartData.ts
import { Request, Response, NextFunction } from "express";
import AppError from "./appError";
import { StatusCodes } from "http-status-codes";

export function parseMultipartData(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  // CHECK FOR JSON DATA
  const raw = req.body?.data;

  if (!raw)
    return next(
      new AppError(
        "Please provided all required information in order to register a new property.",
        StatusCodes.BAD_REQUEST
      )
    );
  // PARSE JSON
  const parsed = JSON.parse(raw);

  // VALIDATE JSON FORMAT
  if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return next(
      new AppError("Invalid JSON Object Provided", StatusCodes.BAD_REQUEST)
    );
  }

  // ASSIGGN DATA TO REQ.BODY
  Object.assign(req.body, parsed);

  // DELETE DATA STRING
  delete req.body.data;

  // GO TO NEXT MIDDLEWARE
  return next();
}
