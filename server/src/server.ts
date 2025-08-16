import mongoose from "mongoose";
// mongoose.set("debug", true); -- vad query urile.
import dotenv from "dotenv";
// Handling Uncaught Exceptions
process.on("uncaughtException", (err: any) => {
  console.log("Uncaught Exceptions! 📛 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Initialize ENV VARS
dotenv.config();

// Import App
import app from "./app";
const port = process.env.PORT || 3002;

// Intialize DB Connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGO_QUERY}`,
    { dbName: `${process.env.NODE_ENV}-rentEase` }
  )
  .then((data) => {
    console.log("Successfully connected to Atlas DB ✅");
  })
  .catch((err: any) => {
    console.log("Failed to connect to Atlas DB 📛");
  });

const server = app.listen(port, () => {
  console.log(
    `Application has successfully started! Running on PORT: ${process.env.PORT} ✅`
  );
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err: any) => {
  console.error(err.name, err.message);
  console.log("Unhandled Promise Rejection! 📛 Shutting down...");
  // .close dam timp server ul sa termine request urile ce sunt in procesare.
  server.close(() => {
    process.exit(1);
  });
});
