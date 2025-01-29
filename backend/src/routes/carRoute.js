import express from "express";
const carRouter = express.Router();
import multer from "multer";
import { addCar, deleteCar, editCar } from "../controllers/car.controller.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });

carRouter.post("/add", upload.array("image", 10), addCar);
carRouter.post("/edit", upload.array("image", 10), editCar);
carRouter.delete("/delete/:carId", deleteCar);

export default carRouter;
