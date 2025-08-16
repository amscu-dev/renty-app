import { Response, Request, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import mongoose, { HydratedDocument, Query, Types } from "mongoose";
import { IProperty } from "../property/property.interface";
import { Property } from "../property/property.schema";
import AppError from "../utils/appError";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ITenant } from "../tenant/tenant.interface";
import { Tenant } from "../tenant/tenant.schema";
import { Lease } from "../lease/lease.schema";
import { Application } from "./application.schema";
import { ApplicationStatus } from "./application.interface";
import { ILease } from "../lease/lease.interface";
import { matchedData, validationResult } from "express-validator";
import formatValidationErrors from "../utils/formatValidationErrors";

interface AuthenticatedRequest extends Request {
  user: { id: string; role: string };
}

export const createApplication = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // EXTRACT VALIDATION DATA
    const results = validationResult(req).array();
    if (results.length > 0) {
      const validationErros = formatValidationErrors(results);
      return next(
        new AppError(JSON.stringify(validationErros), StatusCodes.BAD_REQUEST)
      );
    }
    // 01. Collect Data
    const { id: tenantCognitoId } = req.user;
    const {
      status,
      applicationDate,
      propertyId,
      name,
      email,
      phoneNumber,
      message,
    } = matchedData(req);

    // 02. Get Tenant
    const tenant: HydratedDocument<ITenant> | null = await Tenant.findOne({
      cognitoId: tenantCognitoId,
    });
    if (!tenant)
      return next(
        new AppError(
          "Property does not exist! Please try again with a valid one!",
          StatusCodes.NOT_FOUND
        )
      );

    // 03. Get Property
    const property: HydratedDocument<IProperty> | null =
      await Property.findById(propertyId);
    if (!property)
      return next(
        new AppError(
          "Property does not exist! Please try again with a valid one!",
          StatusCodes.NOT_FOUND
        )
      );

    // 04. Create And Execute Transaction
    const session = await mongoose.startSession();
    try {
      const newApplication = await session.withTransaction(async () => {
        // CREATE LEASE
        const lease = new Lease({
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ), // 1 year from today
          rent: property.pricePerMonth,
          deposit: property.securityDeposit,
          property: property._id,
          tenant: tenant._id,
          tenantCognitoId: tenantCognitoId,
          // TO COMPLETE WITH APP ID
        });
        // CREATE APPLICATION
        const application = new Application({
          applicationDate: new Date(applicationDate),
          status: "Pending",
          name,
          email,
          phoneNumber,
          message,
          property: property._id,
          tenant: tenant._id,
          tenantCognitoId: tenantCognitoId,
          // TO COMPLETE WITH LEASE ID
        });
        lease.application = application._id;
        application.lease = lease._id;
        // UPDATE PROPERTY WITH NEW LEASES AND APPLICATION
        const updatedProperty = await Property.findByIdAndUpdate(
          propertyId,
          {
            $addToSet: {
              leases: lease._id,
              applications: application._id,
            },
          },
          { session }
        );
        // UPDATE TENANT WITH NEW LEASE AND APPLICATION
        const updatedTenant = await Tenant.findByIdAndUpdate(
          tenant._id,
          {
            $addToSet: {
              leases: lease._id,
              applications: application._id,
            },
          },
          { session }
        );
        await application.save({ session });
        await lease.save({ session });
        return application;
      });
      // DE VAZUT CU CE POPULAM
      const responseApplication = await Application.findById(
        newApplication._id
      ).lean();
      if (!responseApplication)
        return next(
          new AppError(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        );
      const { createdAt, updatedAt, __v, ...applicationData } =
        responseApplication;
      // Send Response Back To Client
      res.status(StatusCodes.OK).json({
        status: "success",
        statusCode: StatusCodes.OK,
        data: applicationData,
        meta: {
          createdAt,
        },
      });
    } catch (error) {
      throw error;
    } finally {
      await session.endSession();
    }
  }
);
export const updateApplicationStatus = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // COLLECT DATA
    const { id } = req.params;
    const { status } = req.body;
    const { id: managerCognitoId } = req.user;

    // GET APPLICATION
    const application = await Application.findById(id).populate<{
      property: IProperty & { _id: Types.ObjectId };
    }>("property");
    if (!application)
      return next(
        new AppError(
          "There is no application with this ID.",
          StatusCodes.NOT_FOUND
        )
      );
    // CHECK IF MANAGER IS AUTHORIZED TO PERFORM THIS ACTION
    if (application.property.managerCognitoId !== managerCognitoId)
      return next(
        new AppError(
          "You are not authorized to perform this action",
          StatusCodes.UNAUTHORIZED
        )
      );

    if (status === "Denied") {
      application.status = ApplicationStatus.Denied;
      await application.save();
    }
    if (status === "Approved") {
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          // Update Status of Application to Approved
          application.status = ApplicationStatus.Approved;
          await application.save({ session });
          // Add Property to tenants properties
          await Tenant.findByIdAndUpdate(
            application.tenant,
            {
              $addToSet: { properties: application.property._id },
            },
            { session }
          );
          // Add Tenant to property tenats
          await Property.findByIdAndUpdate(
            application.property._id,
            {
              $addToSet: { tenants: application.tenant },
            },
            { session }
          );
        });
      } catch (error) {
        throw error;
      } finally {
        await session.endSession();
      }
    }
    // GET NEWLY UPDATED APPLICATION

    const updatedApplication = await Application.findById(id)
      .populate(["lease", "property", "tenant"])
      .lean();

    res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      data: updatedApplication,
      meta: {
        createdAt: updatedApplication!.createdAt,
      },
    });
  }
);
export const listApplications = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // COLLECT DATA
    const { userId, userType } = req.query;
    const { id, role } = req.user;

    if (!userId || !userType)
      return next(
        new AppError(
          "Please provide all the neccesarry data for retreving your applications.",
          StatusCodes.BAD_REQUEST
        )
      );

    // AUTHORIZATION CLAUSES
    if (userId !== id)
      return next(
        new AppError(
          "You are not authorized to perform this action",
          StatusCodes.UNAUTHORIZED
        )
      );
    if (userType !== role)
      return next(
        new AppError(
          "You are not authorized to perform this action",
          StatusCodes.UNAUTHORIZED
        )
      );

    // BUILD QUERY BY USER TYPE
    let query: ReturnType<typeof Application.find>;

    if (userType === "tenant") {
      query = Application.find({ tenantCognitoId: userId });
    } else if (userType === "manager") {
      const managerPropertyIds = (await Property.find({
        managerCognitoId: userId,
      }).distinct("_id")) as Types.ObjectId[];

      query = Application.find({ property: { $in: managerPropertyIds } });
    } else {
      return next(new AppError("Invalid user type", StatusCodes.BAD_REQUEST));
    }

    let applications = await query
      ?.populate<{ lease: ILease; property: IProperty; tenant: ITenant }>([
        "lease",
        "property",
        "tenant",
      ])
      .lean();

    function calculateNextPaymentDate(startDate: Date): Date {
      const today = new Date();
      const nextPaymentDate = new Date(startDate);
      while (nextPaymentDate <= today) {
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      }
      return nextPaymentDate;
    }
    const formatedApplications = applications.map((app) => {
      return {
        ...app,
        lease: {
          ...app.lease,
          nextPaymentDate: calculateNextPaymentDate(app.lease.startDate),
        },
      };
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      statusCode: StatusCodes.OK,
      data: formatedApplications,
      meta: {
        applicationNumber: formatedApplications.length,
      },
    });
  }
);
