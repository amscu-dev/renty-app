import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import GlobalErrorHandler from "./controllers/errorController";
import { protect, restricTo } from "./middleware/authMiddleware";
import tenantRoutes from "./routes/tenantRoutes";
import managerRoutes from "./routes/managerRoutes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Initialize ENV VARS
dotenv.config();
/* ROUTE IMPORT */

/* CONFIGURATION */

// Initialize Express App
const app = express();

app.disable("x-powered-by");

// Parse Body
app.use(express.json({ limit: "1mb" }));
//  Add Sec Headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Acitivity Logg
app.use(morgan("common"));

//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use(cors());

/* ROUTES */
app.get("/", (req, res, next) => {
  res.send("This is home route!");
});

app.use("/tenants", protect, restricTo(["tenant"]), tenantRoutes);
app.use("/managers", protect, restricTo(["manager"]), managerRoutes);

// Global Error Handling Middleware:
app.use(GlobalErrorHandler);

async function checkDatabaseConnection() {
  try {
    console.log("🔌 Checking database connection...");
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection OK");
  } catch (err) {
    console.error("❌ Cannot connect to the database:", err);
    process.exit(1); // oprește serverul
  }
}

async function startServer() {
  await checkDatabaseConnection();
}

/* SERVER */
const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

startServer();
