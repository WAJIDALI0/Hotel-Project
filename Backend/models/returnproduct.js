import mongoose from "mongoose";

const returnProductSchema = new mongoose.Schema(
  {
    cook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cook",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    returnedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ReturnProductModel = mongoose.model("ReturnProduct", returnProductSchema);

export default ReturnProductModel;
