import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";

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
    console.log("HIT protect middleware 🔏");
    let token: string | undefined;
    // Getting the token and check if its there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Deny Access if No Token
    if (!token)
      return next(
        new AppError(
          "You are not authorized to perform this action",
          StatusCodes.UNAUTHORIZED
        )
      );

    // Validate the token (Verification)
    const decoded = jwt.decode(token) as DecodedToken;
    console.log(decoded);
    // Deny Access if Token is invalid as JWT Token
    if (!decoded)
      return next(new AppError("Invalid token", StatusCodes.UNAUTHORIZED));

    // If Token format OK, attach user info to request
    const userRole = decoded["custom:role"] || "";
    req.user = {
      id: decoded.sub,
      role: userRole,
    };
    // allow access
    next();
  }
);

export const restricTo =
  (allowedRoles: string[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    console.log("HIT restrict middleware 👥");
    // Extract Role
    const userRole = req.user!.role;
    // Verify Role
    const hasAccess = allowedRoles.includes(userRole.toLocaleLowerCase());
    // Deny Access
    if (!hasAccess)
      return next(new AppError("Access Denied", StatusCodes.FORBIDDEN));
    // OR allow access
    next();
  };
