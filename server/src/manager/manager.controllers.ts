import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { IManager } from "./manager.interface";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Manager } from "./manager.schema";
import { HydratedDocument } from "mongoose";
import { Property } from "../property/property.schema";
import { matchedData, validationResult } from "express-validator";
import formatValidationErrors from "../utils/formatValidationErrors";

interface AuthenticatedRequest extends Request {
  user: { id: string; role: string };
}

type FieldValidationError = {
  type: "field";
  location: Location;
  path: string;
  value: any;
  msg: any;
};

export const createManager = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("HIT:POST Create Manager Controller 🛃");
    // EXTRACT VALIDATION DATA
    const results = validationResult(req).array();
    if (results.length > 0) {
      const validationErros = formatValidationErrors(results);
      return next(
        new AppError(JSON.stringify(validationErros), StatusCodes.BAD_REQUEST)
      );
    }
    // Collect Tenant Data
    const { id } = req.user;
    // COLLECT VALIDATED & SANITIZED DATA
    const { cognitoId, name, email } = matchedData<{
      cognitoId: string;
      name: string;
      email: string;
    }>(req);

    // IF cognitoId Provided in Req != cognitoId decoded: DENY
    if (id !== cognitoId)
      return next(
        new AppError(ReasonPhrases.UNAUTHORIZED, StatusCodes.UNAUTHORIZED)
      );

    // Else Allow
    const newManager: HydratedDocument<IManager> = await Manager.create({
      cognitoId,
      name,
      email,
      phoneNumber: "",
    });

    const { createdAt, ...managerData } = newManager;
    // Send Info To Client
    res.status(StatusCodes.CREATED).json({
      status: "success",
      statusCode: StatusCodes.CREATED,
      data: managerData,
      meta: {
        createdAt,
      },
    });
  }
);

export const getManager = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("HIT:GET Create Manager Controller 🛃");
    // Collect Tenant Data
    const { cognitoId } = req.params;

    // Get Tenant From DB
    const manager = await Manager.findOne({ cognitoId })
      .select("-__v -updatedAt")
      .lean();

    // IF No Tenant DENY
    if (!manager)
      return next(
        new AppError(
          "There is no customer registered with this ID. Please register.",
          StatusCodes.NOT_FOUND
        )
      );
    const { createdAt, ...managerData } = manager;

    // Else Send Info To Client
    res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      data: managerData,
      meta: {
        createdAt: createdAt,
      },
    });
  }
);

export const updateManager = catchAsync(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("HIT:PATCH Update Manager Controller 🛃");
    // EXTRACT VALIDATION DATA
    const results = validationResult(req).array();
    if (results.length > 0) {
      const validationErros = formatValidationErrors(results);
      return next(
        new AppError(JSON.stringify(validationErros), StatusCodes.BAD_REQUEST)
      );
    }
    // Get Tenant Info
    const { cognitoId } = req.params;
    const { id } = req.user;
    const { name, email, phoneNumber } = matchedData<{
      phoneNumber?: string;
      name?: string;
      email?: string;
    }>(req);

    // If id != cognitoId DENY
    if (cognitoId !== id) {
      return next(
        new AppError(
          "You are not authorized to perform this action!",
          StatusCodes.FORBIDDEN
        )
      );
    }

    // Find Tenant in DB
    const manager: HydratedDocument<IManager> | null = await Manager.findOne({
      cognitoId,
    });

    // If no user DENY
    if (!manager)
      return next(new AppError("Tenant does not exist", StatusCodes.NOT_FOUND));

    // If manager.cognitoID != id DENY
    if (manager.cognitoId !== id) {
      return next(
        new AppError(
          "You are not authorized to perform this action!",
          StatusCodes.FORBIDDEN
        )
      );
    }
    // Modify Object
    manager.name = name ? name : manager.name;
    manager.email = email ? email : manager.email;
    manager.phoneNumber = phoneNumber ? phoneNumber : manager.phoneNumber;

    // Save manager in db
    const updatedManager = await manager.save();

    // Separate Info
    const plainTenant = updatedManager.toObject();
    const { createdAt, updatedAt, __v, ...managerData } = plainTenant;

    // Else Send Info To Client
    res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      data: managerData,
      meta: {
        createdAt: createdAt,
      },
    });
  }
);

export const getManagerProperties = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("HIT:PATCH Update Manager Controller 🛃");
    // Get Tenant Info
    const { cognitoId } = req.params;
    const { id } = req.user;
    // If id != cognitoId DENY
    if (cognitoId !== id) {
      return next(
        new AppError(
          "You are not authorized to perform this action!",
          StatusCodes.FORBIDDEN
        )
      );
    }
    const managerProperties = await Property.find({
      managerCognitoId: cognitoId,
    })
      .select("-__v")
      .populate([
        { path: "location", select: "-__v -createdAt -updatedAt -properties" },
      ]);

    res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      data: managerProperties,
      meta: {},
    });
  }
);
