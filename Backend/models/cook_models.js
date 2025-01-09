import mongoose from "mongoose";

const cookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      //  unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const CookModel = mongoose.model("Cook", cookSchema);

export default CookModel;

