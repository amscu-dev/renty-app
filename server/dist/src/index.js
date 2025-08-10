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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const tenantRoutes_1 = __importDefault(require("./routes/tenantRoutes"));
const managerRoutes_1 = __importDefault(require("./routes/managerRoutes"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Initialize ENV VARS
dotenv_1.default.config();
/* ROUTE IMPORT */
/* CONFIGURATION */
// Initialize Express App
const app = (0, express_1.default)();
app.disable("x-powered-by");
// Parse Body
app.use(express_1.default.json({ limit: "1mb" }));
//  Add Sec Headers
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
// Acitivity Logg
app.use((0, morgan_1.default)("common"));
//
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// CORS
app.use((0, cors_1.default)());
/* ROUTES */
app.get("/", (req, res, next) => {
    res.send("This is home route!");
});
app.use("/tenants", authMiddleware_1.protect, (0, authMiddleware_1.restricTo)(["tenant"]), tenantRoutes_1.default);
app.use("/managers", authMiddleware_1.protect, (0, authMiddleware_1.restricTo)(["manager"]), managerRoutes_1.default);
// Global Error Handling Middleware:
app.use(errorController_1.default);
function checkDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("🔌 Checking database connection...");
            yield prisma.$connect();
            yield prisma.$queryRaw `SELECT 1`;
            console.log("✅ Database connection OK");
        }
        catch (err) {
            console.error("❌ Cannot connect to the database:", err);
            process.exit(1); // oprește serverul
        }
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkDatabaseConnection();
    });
}
/* SERVER */
const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
startServer();
