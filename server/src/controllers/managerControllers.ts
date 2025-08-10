import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
const prisma = new PrismaClient();

export const getManager = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { cognitoId } = req.params;
    const manager = await prisma.tenant.findUnique({
      where: { cognitoId },
    });

    if (!manager) return next(new AppError("Tenant not found!", 404));

    res.status(200).json({
      status: "success",
      data: {
        ...manager,
      },
    });
  }
);

export const createManager = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const manager = await prisma.tenant.create({
      data: { cognitoId, name, email, phoneNumber },
    });

    res.status(201).json({
      status: "success",
      data: {
        ...manager,
      },
    });
  }
);

export const updateManager = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;

    const updateManager = await prisma.manager.update({
      where: { cognitoId },
      data: { name, email, phoneNumber },
    });

    console.log("PUT/Tentant Controller HIT👥");
    res.status(201).json({
      status: "success",
      data: {
        ...updateManager,
      },
    });
  }
);
