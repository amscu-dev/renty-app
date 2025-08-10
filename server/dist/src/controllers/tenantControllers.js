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
exports.updateTenant = exports.createTenant = exports.getTenant = void 0;
const client_1 = require("@prisma/client");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const prisma = new client_1.PrismaClient();
exports.getTenant = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cognitoId } = req.params;
    const tenant = yield prisma.tenant.findUnique({
        where: { cognitoId },
        include: {
            favorites: true,
        },
    });
    if (!tenant)
        return next(new appError_1.default("Tenant not found!", 404));
    console.log("GET/Tentant Controller HIT👥");
    res.status(200).json({
        status: "success",
        data: Object.assign({}, tenant),
    });
}));
exports.createTenant = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const tenant = yield prisma.tenant.create({
        data: { cognitoId, name, email, phoneNumber },
    });
    console.log("POST/Tentant Controller HIT👥");
    res.status(201).json({
        status: "success",
        data: Object.assign({}, tenant),
    });
}));
exports.updateTenant = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;
    const updateTenant = yield prisma.tenant.update({
        where: { cognitoId },
        data: { name, email, phoneNumber },
    });
    console.log("PUT/Tentant Controller HIT👥");
    res.status(201).json({
        status: "success",
        data: Object.assign({}, updateTenant),
    });
}));
