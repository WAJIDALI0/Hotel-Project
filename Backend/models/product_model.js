import mongoose from "mongoose";

const Productschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  perUnitPrice: {
    type: Number,
    required: true,
  },
  dateOfPurchase: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", Productschema);

export default Product;
