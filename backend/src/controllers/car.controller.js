import { Car } from "../models/car.model.js";
import { User } from "../models/user.model.js";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { config } from "dotenv";
import dotenvPath from "../../dotenvPath.js";
config({ path: dotenvPath });
const S3 = new S3Client({
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_LOCATION,
});

export const addCar = async (req, res) => {
  try {
    let { name, model, manufactureYear, description, tags, price, ownerId } =
      req.body;
    console.log(
      name,
      model,
      manufactureYear,
      description,
      tags,
      price,
      ownerId
    );
    if (
      !model ||
      !manufactureYear ||
      !description ||
      !tags ||
      !price ||
      !ownerId
    ) {
      return res.status(400).send({ message: "All fields are required" });
    }

    tags = Object.values(JSON.parse(tags));
    console.log(tags);
    const CarImage = req.files;
    if (!CarImage) {
      return res.status(400).send({ message: "Car Image is required" });
    }
    CarImage.map(async (file) => {
      try {
        const insertCommand = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        });
        await S3.send(insertCommand);
      } catch (error) {
        console.error("error in uploding the images", error);
      }
    });
    let images = [];
    CarImage.map((file) => {
      images.push(file.originalname.toString());
    });
    const car = new Car({
      name,
      model,
      yearOfManufacture: manufactureYear,
      description,
      tags,
      price,
      ownerId,
      images,
    });
    const savedCar = await car.save({ validateBeforeSave: false });
    console.log("new car saved", savedCar);
    const user = await User.findById(savedCar.ownerId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    await User.findByIdAndUpdate(
      savedCar.ownerId,
      { $push: { CarList: savedCar._id } }, // Push the new car's ID to the CarList array
      { new: true, runValidators: false } // Return the updated user and skip validation
    );
    res.status(201).send({ mezasage: "car saved succesful", data: savedCar });
  } catch (error) {
    console.log("error in adding the car", error);
  }
};

// ************************************************************************************

export const editCar = async (req, res) => {
  try {
    let { carId, name, model, manufactureYear, description, tags, price } =
      req.body;
    console.log(
      "editing car",
      carId,
      name,
      model,
      manufactureYear,
      description,
      tags,
      price
    );

    if (!carId) {
      return res.status(400).send({ message: "Car ID is required" });
    }
    tags = Object.values(JSON.parse(tags));
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).send({ message: "Car not found" });
    }

    const CarImage = req.files;
    let updatedImages = car.images;

    if (CarImage && CarImage.length > 0) {
      const imageUploadPromises = CarImage.map(async (file) => {
        const insertCommand = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: file.originalname,
          Body: file.buffer,
          ContentType: file.mimetype,
        });
        await S3.send(insertCommand);
        return file.originalname.toString();
      });

      const newImages = await Promise.all(imageUploadPromises);
      updatedImages = [...updatedImages, ...newImages];
    }

    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      {
        $set: {
          name: name || car.name,
          model: model || car.model,
          manufactureYear: manufactureYear || car.manufactureYear,
          description: description || car.description,
          tags: tags || car.tags,
          price: price || car.price,
          images: updatedImages,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).send({
      message: "Car updated successfully",
      data: updatedCar,
    });
  } catch (error) {
    console.error("Error in editing the car:", error);
    res
      .status(500)
      .send({ message: "An error occurred", error: error.message });
  }
};
// ******************************************************************************

export const deleteCar = async (req, res) => {
  try {
    const { carId } = req.params;
    console.log("deleting car", carId);
    if (!carId) {
      return res.status(400).send({ message: "Car ID is required" });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).send({ message: "Car not found" });
    }

    const imageDeletionPromises = car.images.map(async (imageKey) => {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: imageKey,
        });
        await S3.send(deleteCommand);
      } catch (error) {
        console.error(`Failed to delete image ${imageKey}:`, error);
      }
    });
    await Promise.all(imageDeletionPromises);

    // Remove the car from the database
    await Car.findByIdAndDelete(carId);

    await User.findByIdAndUpdate(
      car.ownerId,
      { $pull: { CarList: carId } },
      { new: true }
    );

    res.status(200).send({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error in deleting the car:", error);
    res
      .status(500)
      .send({ message: "An error occurred", error: error.message });
  }
};
