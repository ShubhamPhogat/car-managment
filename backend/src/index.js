import express from "express";
import connectDb from "./db/connect.db.js";
import findConfig from "find-config";
import cookieParser from "cookie-parser";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import carRouter from "./routes/carRoute.js";
import infoRouter from "./routes/infoRoute.js";
import authRouter from "./routes/authRoutes.js";
dotenv.config({ path: findConfig("../.env") });
connectDb();
app.use(cors({ origin: true }));
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  next();
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use("/api/v1/car", carRouter);
app.use("/api/v1/info", infoRouter);
app.use("/api/v1/auth", authRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
