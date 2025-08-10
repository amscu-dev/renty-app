import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import { promisify } from "util";
import catchAsync from "../utils/catchAsync";

interface DecodedToken extends JwtPayload {
  sub: string; // cognitoID
  "custom:role"?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const protect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    console.log("Hit protect middleware 🔏");
    let token: string | undefined;
    // 1) Getting the token and check if its there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
      return next(
        new AppError("You are not authorized to perform this action", 401)
      );

    // 2) Validate the token (Verification)
    const decoded = jwt.decode(token) as DecodedToken;
    // GUARD
    if (!decoded) return next(new AppError("Invalid token", 401));

    // 3) Attach User Info To Request
    const userRole = decoded["custom:role"] || "";
    req.user = {
      id: decoded.sub,
      role: userRole,
    };
    next();
  }
);

export const restricTo = (allowedRoles: string[]) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    console.log("Hit restrict middleware 👥");
    const userRole = req.user!.role;
    const hasAccess = allowedRoles.includes(userRole.toLocaleLowerCase());
    if (!hasAccess) return next(new AppError("Access Denied", 403));
    next();
  });
