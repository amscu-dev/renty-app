"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    // Operational Error, trusted: create cu new AppError
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        // Programming or other unknown error: don`t want to leak error details to client
        // 1) Log error
        console.error("ERROR 📛", err);
        // 2) Sent generic message
        res.status(500).json({
            status: "error",
            message: "Something went wrong! 📛",
        });
    }
};
// const handleCastErroDB = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };
const handleDuplicateFieldsDB = (err) => {
    var _a;
    const duplicatedValue = (_a = err.meta) === null || _a === void 0 ? void 0 : _a.target[0];
    const message = `Duplicate filed value: '${duplicatedValue}'. Please use another value.`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = () => {
    return new appError_1.default("Invalid Data Provided! Please provide all necessary data", 400);
};
// const handleInvalidTokenError = () => new AppError("Invalid Token!", 400);
// const handleExpiredTokenError = (err) =>
//   new AppError("Invalid Token. Please login again", 401);
const errorHandler = (err, _req, res, next) => {
    console.log(err);
    console.log(process.env.NODE_ENV);
    // DEFAULT VALUES
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    // DEVELOPMENT (PRINT STACK TRACE)
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = Object.assign(Object.assign({}, err), { 
            //  Error defineşte message (şi name, stack etc.) ca proprietăţi non-enumerabile, aşa încât nu vor fi preluate de spread. REZOLVARE:
            message: err.message, stack: err.stack, name: err.name });
        // Handling Mongoose Validation Errors
        if (err.name === "PrismaClientValidationError")
            error = handleValidationErrorDB();
        // Handling Duplicate Database Fields
        if (err.code === "P2002")
            error = handleDuplicateFieldsDB(error);
        // // Acestea 3 vor crea erori operationale ( cu constructorul AppError )
        // // Handling Invalid Database IDs
        // if (err.name === "CastError") error = handleCastErroDB(error);
        // Handling Invalid TokenError
        // if (err.name === "JsonWebTokenError") error = handleInvalidTokenError();
        // // Handling Expired TokenError
        // if (err.name === "TokenExpiredError")
        //   error = handleExpiredTokenError(error);
        sendErrorProd(error, res);
    }
};
exports.default = errorHandler;
