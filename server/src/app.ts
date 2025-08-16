/* EXTERNAL LIBRARIES */
import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
/* HELPERS */
import AppError from "./utils/appError";

/* MIDDLEWARS IMPORT */
import GlobalErrorHandler from "./middleware/globalErrorMiddleware";
import { protect, restricTo } from "./middleware/authMiddleware";
// import { protect, restricTo } from "./middleware/authMiddleware";

/* ROUTE IMPORT */
import tenantRoutes from "./tenant/tenant.routes";
import managerRoutes from "./manager/manager.routes";
import propertyRoutes from "./property/property.routes";
import applicationRoutes from "./application/application.routes";
import leaseRoutes from "./lease/lease.routes";
import { createPropertyValidator } from "./property/property.validator";
import { validationResult } from "express-validator";

/* CONFIGURATION */
// Initialize Express App
const app = express();

app.disable("x-powered-by");

// Parse Body
app.use(express.json());
//  Add Sec Headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Acitivity Logg
app.use(morgan("common"));

// Parse Req
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use(cors());

/* ROUTES */
app.post(
  "/test-validation",
  createPropertyValidator,
  (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      // handle validation errors
      return res.json(result);
    }
    return res.json("ok");
  }
);
// app.use("properties", propertyRoutes);
app.use("/tenants", protect, restricTo(["tenant"]), tenantRoutes);
app.use("/managers", protect, restricTo(["manager"]), managerRoutes);
app.use("/properties", propertyRoutes);
app.use("/applications", applicationRoutes);
app.use("/leases", leaseRoutes);

// Handling Unhandled Routes
app.all("{*splat}", (req, res, next) => {
  console.log(req.originalUrl);
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      StatusCodes.NOT_FOUND
    )
  );
});

// Global Error Handling Middleware:
app.use(GlobalErrorHandler);

export default app;
