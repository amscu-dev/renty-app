import { NextFunction, Response, Request } from "express";
import catchAsync from "../utils/catchAsync";

interface AuthenticatedRequest extends Request {
  user: { id: string; role: string };
}

export const getLeases = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {}
);
export const getLeasePayments = catchAsync<AuthenticatedRequest>(
  async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {}
);
