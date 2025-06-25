import mongoose from "mongoose";

const AIOrderSchema = new mongoose.Schema(
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
    productType: {
      type: String,
      default: "Bible AI API Key",
    },
    totalcost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    apiKey: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Generate and save API key before saving the order
AIOrderSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'completed') {
    // Generate a random API key (you might want a more secure method)
    this.apiKey = `bibleai_${this._id.toString().slice(-12)}_${Math.random().toString(36).substring(2, 10)}`;
  }
  next();
});

export default mongoose.model("AIOrder", AIOrderSchema);