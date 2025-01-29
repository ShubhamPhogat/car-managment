import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  yearOfManufacture: {
    type: Number,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
  },
});

export const Car = mongoose.model("Car", carSchema);
