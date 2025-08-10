"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restricTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.protect = (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hit protect middleware 🔏");
    let token;
    // 1) Getting the token and check if its there
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
        return next(new appError_1.default("You are not authorized to perform this action", 401));
    // 2) Validate the token (Verification)
    const decoded = jsonwebtoken_1.default.decode(token);
    // GUARD
    if (!decoded)
        return next(new appError_1.default("Invalid token", 401));
    // 3) Attach User Info To Request
    const userRole = decoded["custom:role"] || "";
    req.user = {
        id: decoded.sub,
        role: userRole,
    };
    next();
}));
const restricTo = (allowedRoles) => (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hit restrict middleware 👥");
    const userRole = req.user.role;
    const hasAccess = allowedRoles.includes(userRole.toLocaleLowerCase());
    if (!hasAccess)
        return next(new appError_1.default("Access Denied", 403));
    next();
}));
exports.restricTo = restricTo;
