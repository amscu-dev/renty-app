import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { StatusCodes, getReasonPhrase, ReasonPhrases } from "http-status-codes";
import AppError from "../utils/appError";
import { MAX_FILE_NUMBER } from "../constants";

interface ValidationErrorItem {
  name: "ValidatorError";
  message: string;
  properties: Record<string, unknown>;
  kind: string;
  path: string;
  value: unknown;
}

interface PossibleError extends Partial<AppError> {
  stack?: string | undefined;
  name?: string;
  code?: number | string;
  path?: string;
  value?: string;
  errors?: Record<string, ValidationErrorItem>;
}

const sendErrorDev = (err: PossibleError, res: Response) => {
  console.log("HIT Development Error 🚧");
  res.status(err.statusCode!).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: PossibleError, res: Response) => {
  console.log("HIT Production Error 🎥");
  // Operational Error, trusted: create cu new AppError
  if (err.isOperational) {
    res.status(err.statusCode!).json({
      statusCode: err.statusCode,
      status: err.status,
      error: getReasonPhrase(err.statusCode!),
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don`t want to leak error details to client
    // 1) Log error
    console.error("ERROR 📛", err);
    // 2) Sent generic message
    res.status(500).json({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      status: "error",
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: "Something went wrong! 📛",
    });
  }
};

const handleCastErroDB = (err: PossibleError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err: any) => {
  const duplicatedValue = Object.values(err.keyValue)[0];

  const message = `Duplicate filed value: '${duplicatedValue}'. Please use another value.`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleValidationErrorDB = (err: PossibleError) => {
  const erros = Object.values(err.errors!)
    .map((field) => field.message)
    .reduce((acc, errorMessage) => acc + ` ${errorMessage}.`, "");
  const message = `Invalid input data. ${erros}`;
  return new AppError(message, StatusCodes.BAD_REQUEST);
};

const handleMulterError = (err: PossibleError) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return new AppError(
      "The uploaded file exceeds the permitted size limit (max 1 MB/ file).",
      StatusCodes.REQUEST_TOO_LONG
    );
  } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return new AppError(
      `The number of uploaded files exceeds the permitted limit (max${MAX_FILE_NUMBER}).`,
      StatusCodes.BAD_REQUEST
    );
  } else {
    return new AppError(
      "Internal Server Error",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
// const handleInvalidTokenError = (err) =>
//   new AppError("Invalid Token. Please login again", StatusCodes.UNAUTHORIZED);

// const handleExpiredTokenError = (err) =>
//   new AppError("Invalid Token. Please login again", StatusCodes.UNAUTHORIZED);

const errorHandler: ErrorRequestHandler = (
  err: PossibleError,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("HIT Global Error Middleware 🔥");
  // DEFAULT VALUES
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // DEVELOPMENT (PRINT STACK TRACE)
  if (process.env.NODE_ENV === "development") {
    // Format Error For Development
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error: PossibleError = {
      ...err,
      //  Error defineşte message (şi name, stack etc.) ca proprietăţi non-enumerabile, aşa încât nu vor fi preluate de spread. REZOLVARE:
      message: err.message,
      stack: err.stack,
      name: err.name,
    };
    // Acestea 3 vor crea erori operationale ( cu constructorul AppError )
    // Handling Invalid Database IDs
    if (err.name === "CastError") error = handleCastErroDB(error);
    // Handling Duplicate Database Fields
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    // Handling Mongoose Validation Errors
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    // Handle Multer Error
    if (err.name === "MulterError") error = handleMulterError(error);
    // // Handling Invalid TokenError
    // if (err.name === "JsonWebTokenError")
    //   error = handleInvalidTokenError(error);
    // // Handling Expired TokenError
    // if (err.name === "TokenExpiredError")
    //   error = handleExpiredTokenError(error);

    // Format Error For Production
    sendErrorProd(error, res);
  }
};

export default errorHandler;
