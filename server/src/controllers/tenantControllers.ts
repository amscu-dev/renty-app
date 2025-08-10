import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
const prisma = new PrismaClient();

export const getTenant = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { cognitoId } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { cognitoId },
      include: {
        favorites: true,
      },
    });

    if (!tenant) return next(new AppError("Tenant not found!", 404));
    console.log("GET/Tentant Controller HIT👥");
    res.status(200).json({
      status: "success",
      data: {
        ...tenant,
      },
    });
  }
);

export const createTenant = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { cognitoId, name, email, phoneNumber } = req.body;

    const tenant = await prisma.tenant.create({
      data: { cognitoId, name, email, phoneNumber },
    });
    console.log("POST/Tentant Controller HIT👥");
    res.status(201).json({
      status: "success",
      data: {
        ...tenant,
      },
    });
  }
);

export const updateTenant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    const updateTenant = await prisma.tenant.update({
      where: { cognitoId },
      data: { name, email, phoneNumber },
    });

    console.log("PUT/Tentant Controller HIT👥");
    res.status(201).json({
      status: "success",
      data: {
        ...updateTenant,
      },
    });
  }
);
