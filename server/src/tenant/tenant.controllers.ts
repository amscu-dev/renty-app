import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { ITenant } from "./tenant.interface";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Tenant } from "./tenant.schema";
import mongoose, { HydratedDocument } from "mongoose";
import { IProperty } from "../property/property.interface";
import { Property } from "../property/property.schema";
import { matchedData, validationResult } from "express-validator";
import formatValidationErrors from "../utils/formatValidationErrors";

interface AuthenticatedRequest extends Request {
  user: { id: string; role: string };
}

export const createTenant = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("HIT:POST Create Tenant Controller 🛃");
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
    const newTenant: HydratedDocument<ITenant> = await Tenant.create({
      cognitoId,
      name,
      email,
      phoneNumber: "",
    });
    const plainTenant = newTenant.toObject();
    const { createdAt, ...tenantData } = plainTenant;
    // Send Info To Client
    res.status(StatusCodes.CREATED).json({
      status: "success",
      statusCode: StatusCodes.CREATED,
      data: tenantData,
      meta: {
        createdAt,
      },
    });
  }
);

export const getTenant = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("HIT:GET Create Tenant Controller 🛃");
    // Collect Tenant Data
    const { cognitoId } = req.params;

    // Get Tenant From DB
    const tenant = await Tenant.findOne({ cognitoId })
      .select("-__v -updatedAt")
      .populate({
        path: "favorites",
        options: { lean: true },
        populate: {
          path: "location",
          options: { lean: true },
        },
      })
      .lean();

    // IF No Tenant DENY
    if (!tenant)
      return next(
        new AppError(
          "There is no customer registered with this ID. Please register.",
          StatusCodes.NOT_FOUND
        )
      );
    const { createdAt, ...tenantData } = tenant;

    // Else Send Info To Client
    res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      data: tenantData,
      meta: {
        createdAt: createdAt,
      },
    });
  }
);

export const updateTenant = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log("HIT:PATCH Update Tenant Controller 🛃");
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
    const tenant: HydratedDocument<ITenant> | null = await Tenant.findOne({
      cognitoId,
    });

    // If no user DENY
    if (!tenant)
      return next(new AppError("Tenant does not exist", StatusCodes.NOT_FOUND));

    // If tenant.cognitoID != id DENY
    if (tenant.cognitoId !== id) {
      return next(
        new AppError(
          "You are not authorized to perform this action!",
          StatusCodes.FORBIDDEN
        )
      );
    }
    // Modify Object
    tenant.name = name ? name : tenant.name;
    tenant.email = email ? email : tenant.email;
    tenant.phoneNumber = phoneNumber ? phoneNumber : tenant.phoneNumber;

    // Save tenant in db
    const updatedTenant = await tenant.save();

    // Separate Info
    const plainTenant = updatedTenant.toObject();
    const { createdAt, updatedAt, __v, ...tenantData } = plainTenant;

    // Else Send Info To Client
    res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      data: tenantData,
      meta: {
        createdAt: createdAt,
      },
    });
  }
);

export const addFavoriteProperty = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // 01. Get Params ID`s
    const { cognitoId, propertyId } = req.params;
    // 02. Get Tenant Cognito ID from token
    const { id } = req.user;

    // 03. If id != cognitoId DENY
    if (cognitoId !== id) {
      return next(
        new AppError(
          "You are not authorized to perform this action!",
          StatusCodes.FORBIDDEN
        )
      );
    }

    // 04. Find Tenant in DB
    const tenant: HydratedDocument<ITenant> | null = await Tenant.findOne({
      cognitoId,
    });

    // 05. If no user DENY
    if (!tenant)
      return next(new AppError("Tenant does not exist", StatusCodes.NOT_FOUND));

    // 06. If tenant.cognitoID != id DENY
    if (tenant.cognitoId !== id) {
      return next(
        new AppError(
          "You are not authorized to perform this action!",
          StatusCodes.FORBIDDEN
        )
      );
    }

    // 07. Get Property from DB
    const property: HydratedDocument<IProperty> | null =
      await Property.findById(propertyId);

    // 07.1 If no Property DENY
    if (!property)
      return next(new AppError("Tenant does not exist", StatusCodes.NOT_FOUND));

    // Create And Execute Transaction
    const session = await mongoose.startSession();
    try {
      console.log("INTO SESSION 💓");
      // .withTransaction = Convenient Transaction API offers automatic retry for TransientTransactionError, UnknownTransactionCommitResult
      const updatedDocuments = await session.withTransaction(async () => {
        const updatedTenant: HydratedDocument<ITenant> | null =
          await Tenant.findOneAndUpdate(
            { _id: tenant._id, favorites: { $ne: property._id } },
            { $addToSet: { favorites: property._id } },
            { session, new: true }
          );
        if (!updatedTenant)
          throw new AppError(
            "Current property it`s already in your favourite properties.",
            StatusCodes.CONFLICT
          );

        const updatedProperty: HydratedDocument<IProperty> | null =
          await Property.findOneAndUpdate(
            { _id: property._id, favoritedBy: { $ne: property._id } },
            { $addToSet: { favoritedBy: property._id } },
            { session, new: true }
          );
        return { updatedTenant, updatedProperty };
      });

      const { updatedTenant } = updatedDocuments;
      const plainTenant = updatedTenant.toObject();
      const { createdAt, updatedAt, __v, ...tenantData } = plainTenant;

      // Send Response Back To Client
      res.status(StatusCodes.OK).json({
        status: "success",
        statusCode: StatusCodes.OK,
        data: tenantData,
        meta: {
          createdAt,
          updatedAt,
        },
      });
    } catch (error) {
      console.log("ERROR THROW 📛");
      throw error;
    } finally {
      await session.endSession();
      console.log("FINISH SESSION ✅");
    }
  }
);

export const removeFavoriteProperty = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // 01. Get Params ID`s
    const { cognitoId, propertyId } = req.params;
    // 02. Get Tenant Cognito ID from token
    const { id } = req.user;

    // 03. If id != cognitoId DENY
    if (cognitoId !== id) {
      return next(
        new AppError(
          "You are not authorized to perform this action!",
          StatusCodes.FORBIDDEN
        )
      );
    }

    // 04. Find Tenant in DB
    const tenant: HydratedDocument<ITenant> | null = await Tenant.findOne({
      cognitoId,
    });

    // 05. If no user DENY
    if (!tenant)
      return next(new AppError("Tenant does not exist", StatusCodes.NOT_FOUND));

    // 06. If tenant.cognitoID != id DENY
    if (tenant.cognitoId !== id) {
      return next(
        new AppError(
          "You are not authorized to perform this action!",
          StatusCodes.FORBIDDEN
        )
      );
    }

    // 07. Get Property from DB
    const property: HydratedDocument<IProperty> | null =
      await Property.findById(propertyId);

    // 07.1 If no Property DENY
    if (!property)
      return next(new AppError("Tenant does not exist", StatusCodes.NOT_FOUND));

    // Create And Execute Transaction
    const session = await mongoose.startSession();
    try {
      console.log("INTO SESSION 💓");
      // .withTransaction = Convenient Transaction API offers automatic retry for TransientTransactionError, UnknownTransactionCommitResult
      const updatedDocuments = await session.withTransaction(async () => {
        const updatedTenant: HydratedDocument<ITenant> | null =
          await Tenant.findOneAndUpdate(
            { _id: tenant._id, favorites: { $eq: property._id } },
            { $pull: { favorites: property._id } },
            { session, new: true }
          );
        if (!updatedTenant)
          throw new AppError(
            "This property it`s not on your favourites list to be removed.",
            StatusCodes.CONFLICT
          );

        const updatedProperty: HydratedDocument<IProperty> | null =
          await Property.findOneAndUpdate(
            { _id: property._id, favoritedBy: { $eq: property._id } },
            { $pull: { favoritedBy: property._id } },
            { session, new: true }
          );
        return { updatedTenant, updatedProperty };
      });

      const { updatedTenant } = updatedDocuments;
      const plainTenant = updatedTenant.toObject();
      const { createdAt, updatedAt, __v, ...tenantData } = plainTenant;

      // Send Response Back To Client
      res.status(StatusCodes.OK).json({
        status: "success",
        statusCode: StatusCodes.OK,
        data: tenantData,
        meta: {
          createdAt,
          updatedAt,
        },
      });
    } catch (error) {
      console.log("ERROR THROW 📛");
      throw error;
    } finally {
      await session.endSession();
      console.log("FINISH SESSION ✅");
    }
  }
);

export const getCurrentResidences = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // COLECT DATA
    const { cognitoId } = req.params;
    const { id } = req.user;
    // GUARD CLAUSE FOR UNAUTHENTICATED REQU
    if (cognitoId !== id)
      return next(
        new AppError(
          "You are not allowed to perform this actions",
          StatusCodes.UNAUTHORIZED
        )
      );
    // GET CURRENT TENANT
    const currentTenant = await Tenant.findOne({ cognitoId: id });
    // GUARD CLAUSE IF NO TENANT FOUND
    if (!currentTenant)
      return next(
        new AppError(
          "There is no user with this id. Please register.",
          StatusCodes.NOT_FOUND
        )
      );

    // GET PROPERTIES BY TENANTID IN TENANTS
    const tenantProperties = await Property.find({
      tenants: { $eq: currentTenant._id },
    }).populate("location");

    // RETURN RESPONSE TO USER
    res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      data: tenantProperties,
      meta: {
        propertiesNumber: tenantProperties.length,
      },
    });
  }
);
