import mongoose from "mongoose";

const productAssignmentLogSchema = new mongoose.Schema(
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
    assignedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ProductAssignmentLogModel = mongoose.model(
  "ProductAssignmentLog",
  productAssignmentLogSchema
);

export default ProductAssignmentLogModel;
