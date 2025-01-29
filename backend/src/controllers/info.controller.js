import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Car } from "../models/car.model.js";
import { User } from "../models/user.model.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";
import dotenvPath from "../../dotenvPath.js";
import mongoose from "mongoose";
config({ path: dotenvPath });
const S3 = new S3Client({
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_LOCATION,
});

export const carsList = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("car list", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found while fetching car list" });
    }

    const cars = await Car.aggregate([
      {
        $match: {
          ownerId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          name: 1,
          _id: 1,
          model: 1,
          yearOfManufacture: 1,
          description: 1,
          tags: 1,
          price: 1,
          images: 1,
        },
      },
    ]);

    console.log("fetched cars: ", cars);

    let allcars = [];
    for (let Data of cars) {
      const imageUrls = await Promise.all(
        Data.images.map(async (image) => {
          const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: image,
          });
          return await getSignedUrl(S3, command, { expiresIn: 3600 });
        })
      );

      const imageData = { ...Data, images: imageUrls };

      allcars.push(imageData);
    }

    res.status(200).json({ data: allcars });
  } catch (error) {
    console.log("Error in fetching car list:", error);
    res
      .status(500)
      .json({ message: "Error fetching car list", error: error.message });
  }
};

// ****************************************************************

export const getCar = async (req, res) => {
  try {
    const { carId } = req.params;
    if (!carId) {
      return res.status(400).json({ message: "car id is required" });
    }
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ message: "car not found" });
    }
    let urls = [];
    for (let image of car.images) {
      const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: image,
      });
      const url = await getSignedUrl(S3, command, { expiresIn: 3600 });
      urls.push(url);
    }
    return res
      .status(200)
      .json({ message: "success", data: { ...car, images: urls } });
  } catch (error) {
    console.log("error in finding the carsList", error);
  }
};

// ****************************************************************

export const searchCar = async (req, res) => {
  try {
    const { userId, query } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    // const allUserCars = await Car.find({
    //   ownerId: new mongoose.Types.ObjectId(userId),
    // });

    // // Then filter cars based on tags
    // const filtereCars = [];
    // console.log(typeof allUserCars[0].tags[0]);
    // console.log(
    //   "searched cars",
    //   allUserCars[0].tags[0],
    //   allUserCars[0].tags.length
    // );
    // for (let j = 0; j < allUserCars.length; j++) {
    //   for (let i = 0; i < allUserCars[j].tags.length; i++) {
    //     let temp = allUserCars[j].tags[i].toLowerCase();
    //     if (temp.startsWith(query.toLowerCase())) {
    //       filtereCars.push(allUserCars[j]);
    //     }
    //   }
    // }

    const cars = await Car.aggregate([
      // Match documents for the specific owner
      {
        $match: {
          ownerId: new mongoose.Types.ObjectId(userId),
        },
      },

      // Unwind the tags array to work with individual tags
      {
        $unwind: {
          path: "$tags",
          preserveNullAndEmptyArrays: true, // Keep cars even if tags array is empty
        },
      },

      // Match tags that start with the query
      {
        $match: {
          tags: {
            $regex: `^${query}`,
            $options: "i", // case-insensitive
          },
        },
      },

      // Group back by car document
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          model: { $first: "$model" },
          price: { $first: "$price" },
          yearOfManufacture: { $first: "$yearOfManufacture" },
          ownerId: { $first: "$ownerId" },
          description: { $first: "$description" },
          images: { $first: "$images" },
          tags: { $push: "$tags" },
        },
      },
    ]);

    let allcars = [];
    for (let Data of cars) {
      const imageUrls = await Promise.all(
        Data.images.map(async (image) => {
          const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: image,
          });
          return await getSignedUrl(S3, command, { expiresIn: 3600 });
        })
      );

      const imageData = { ...Data, images: imageUrls };

      allcars.push(imageData);
    }

    return res.status(200).json({
      success: true,
      data: allcars,
    });
  } catch (error) {
    console.error("Error in car search aggregation:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
