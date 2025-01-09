import mongoose from "mongoose";

const productQuantityUpdateLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",  // Reference to the Product model
      required: true,
    },
    cook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cook",  // Reference to the Cook model
      required: true,
    },
    quantity: {
      type: Number,  // Correct type to store quantity as a number
      required: true,
    },
    updateDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ProductQuantityUpdateLogModel = mongoose.model(
  "ProductQuantityUpdateLog",
  productQuantityUpdateLogSchema
);

export default ProductQuantityUpdateLogModel;
