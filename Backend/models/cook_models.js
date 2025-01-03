import mongoose from "mongoose";

const cookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    //   required: true,
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

// Add unique index for `name`
cookSchema.index({ name: 1 }, { unique: true });

const CookModel = mongoose.models.Cook || mongoose.model("Cook", cookSchema);

export default CookModel;
