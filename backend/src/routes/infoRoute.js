import express from "express";
import { carsList, getCar, searchCar } from "../controllers/info.controller.js";

const infoRouter = express.Router();
infoRouter.get("/carList/:userId", carsList);
infoRouter.get("/car/:carId", getCar);
infoRouter.post("/searchCar", searchCar);

export default infoRouter;
