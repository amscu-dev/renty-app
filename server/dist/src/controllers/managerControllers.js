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
exports.updateManager = exports.createManager = exports.getManager = void 0;
const client_1 = require("@prisma/client");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const prisma = new client_1.PrismaClient();
exports.getManager = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cognitoId } = req.params;
    const manager = yield prisma.tenant.findUnique({
        where: { cognitoId },
    });
    if (!manager)
        return next(new appError_1.default("Tenant not found!", 404));
    res.status(200).json({
        status: "success",
        data: Object.assign({}, manager),
    });
}));
exports.createManager = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cognitoId, name, email, phoneNumber } = req.body;
    const manager = yield prisma.tenant.create({
        data: { cognitoId, name, email, phoneNumber },
    });
    res.status(201).json({
        status: "success",
        data: Object.assign({}, manager),
    });
}));
exports.updateManager = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { cognitoId } = req.params;
    const { name, email, phoneNumber } = req.body;
    const updateManager = yield prisma.manager.update({
        where: { cognitoId },
        data: { name, email, phoneNumber },
    });
    console.log("PUT/Tentant Controller HIT👥");
    res.status(201).json({
        status: "success",
        data: Object.assign({}, updateManager),
    });
}));
