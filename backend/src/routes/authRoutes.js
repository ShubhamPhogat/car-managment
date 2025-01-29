import express from "express";
import {
  loggoutUser,
  loginUser,
  registerUser,
  deleteUserByEmail,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", verifyJWT, loggoutUser);
authRouter.post("/delete", deleteUserByEmail);
export default authRouter;
