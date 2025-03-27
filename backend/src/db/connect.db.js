import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const db = await mongoose.connect(
      `mongodb+srv://sphogat444:O4crZr5TI28ECT3w@cluster0.i9y7h6t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("connected successfully");
  } catch (err) {
    console.log("error in connecting mongo db", err);
  }
};
export default connectDb;
