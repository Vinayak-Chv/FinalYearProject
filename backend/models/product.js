import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  outfitType: {
    type: String,
    required: true,
  },
  vendorType: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  colorsAvailable: [String],
  isCustomizable: Boolean,
  inStock: {
    type: Boolean,
    required: true,
  },
  fabric: {
    type: [String],
    required: true,
  },
  ageRange: {
    type: [String],
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
});

export default mongoose.model("Product", productSchema, "dummy_data");
