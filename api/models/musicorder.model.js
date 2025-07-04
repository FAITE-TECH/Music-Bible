import mongoose from "mongoose";

const musicOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    musicId: {
      type: String,
      required: true,
    },
    musicTitle: {
      type: String,
      required: true,
    },
    musicImage: {
      type: String,
    },
    musicFile: {  
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("MusicOrder", musicOrderSchema);