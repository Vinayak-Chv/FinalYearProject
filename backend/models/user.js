import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["customer", "tailor", "designer", "admin"],
    default: "customer",
  },

  // Customer - specific fields
  customerProfile: {
    address: [
      {
        street: String,
        city: String,
        state: String,
        pincode: { type: Number, required: true },
        isdefault: { type: Boolean, default: false },
      },
    ],
    measurements: [
      {
        chest: { type: Number, required: true },
        waist: { type: Number, required: true },
        hips: { type: Number, required: true },
        shoulder: { type: Number, required: true },
        sleeve: { type: Number, required: true },
        length: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },

  //Timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Tailor-specific
  tailorProfile: {
    businessName: String,
    workType: [String],
    garmentType: [String],
    targetSegment: [String],
    experience: Number,
    serviceAreas: [Number],
    portfolio: [
      {
        type: { type: String, enum: ["image", "video", "link"] },
        url: String,
        title: String,
        description: String,
      },
    ],
    socialLinks: {
      instagram: String,
      facebook: String,
      whatsapp: String,
      website: String,
    },
    bio: String,
    verificationStatus: { type: String, default: "pending" },
    address: [
      {
        street: String,
        city: String,
        state: String,
        pincode: { type: Number, required: true },
        isdefault: { type: Boolean, default: false },
      },
    ],
  },

  // Designer-specific
  designerProfile: {
    brandName: String,
    specialization: [String],
    targetSegment: [String],
    portfolio: [
      {
        type: {
          type: String,
          enum: ["image", "video", "lookbook", "collection"],
        },
        url: String,
        title: String,
        description: String,
        tags: [String],
      },
    ],
    socialLinks: {
      instagram: String,
      pinterest: String,
      behance: String,
      website: String,
      linkedin: String,
    },
    bio: String,
    education: String,
    awards: [String],
    verificationStatus: { type: String, default: "pending" },
    address: [
      {
        street: String,
        city: String,
        state: String,
        pincode: { type: Number, required: true },
        isdefault: { type: Boolean, default: false },
      },
    ],
  },
});

export default mongoose.model("User", userSchema);
