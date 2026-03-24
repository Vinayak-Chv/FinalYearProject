import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  registerCustomerSchema,
  registerTailorSchema,
  registerDesignerSchema,
  loginSchema,
} from "../validations/authValidations.js";
import crypto from "crypto";
import PendingUser from "../models/PendingUser.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

// Customer registration
export const registerCustomer = async (req, res) => {
  const { error } = registerCustomerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  try {
    const { name, email, password, phone, address, avatar } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashpassword,
      phone,
      avatar: avatar || "",
      role: "customer",
      customerProfile: { addresses: address ? [address] : [] },
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tailor registration
export const registerTailor = async (req, res) => {
  const { error } = registerTailorSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  try {
    const {
      name,
      email,
      password,
      phone,
      avatar,
      businessName,
      specialization,
      experience,
      serviceAreas,
      address,
      portfolio,
      socialLinks,
      bio,
    } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashpassword,
      phone,
      avatar: avatar || "",
      role: "tailor",
      tailorProfile: {
        businessName,
        specialization,
        experience,
        serviceAreas,
        address: address || {},
        portfolio: portfolio || [],
        socialLinks: socialLinks || {},
        bio: bio || "",
        verificationStatus: "pending",
      },
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Tailor registered successfully. Pending admin approval.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Designer registration
export const registerDesigner = async (req, res) => {
  const { error } = registerDesignerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return res
      .status(400)
      .json({ success: false, message: "Validation failed", errors });
  }

  try {
    const {
      name,
      email,
      password,
      phone,
      avatar,
      brandName,
      specialization,
      address,
      portfolio,
      socialLinks,
      bio,
      education,
      awards,
    } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashpassword,
      phone,
      avatar: avatar || "",
      role: "designer",
      designerProfile: {
        brandName,
        specialization,
        address: address || {},
        portfolio: portfolio || [],
        socialLinks: socialLinks || {},
        bio: bio || "",
        education: education || "",
        awards: awards || [],
        verificationStatus: "pending",
      },
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: "Designer registered successfully. Pending admin approval.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save temporary profile data (no credentials)
export const saveTempProfile = async (req, res) => {
  try {
    const { role, profileData } = req.body;

    // Validate role and profileData structure (optional, but recommended)
    let schema;
    if (role === "customer") schema = registerCustomerSchema;
    else if (role === "tailor") schema = registerTailorSchema;
    else if (role === "designer") schema = registerDesignerSchema;
    else return res.status(400).json({ message: "Invalid role" });

    // For simplicity, we'll just ensure required top‑level fields exist
    // You can do deeper validation if needed

    const token = crypto.randomBytes(32).toString("hex");
    const pending = new PendingUser({ token, role, profileData });
    await pending.save();

    res.status(201).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Attach temporary profile to authenticated user
export const attachProfile = async (req, res) => {
  try {
    const { token } = req.body;
    const pending = await PendingUser.findOne({ token });
    if (!pending) {
      return res
        .status(404)
        .json({ message: "Profile data not found or expired" });
    }

    // req.user is set by `protect` middleware (from JWT)
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { role, profileData } = pending;

    // Merge profile data into user's document
    if (role === "customer") {
      if (profileData.address)
        user.customerProfile.address.push(profileData.address);
      if (profileData.measurements)
        user.customerProfile.measurements.push(profileData.measurements);
    } else if (role === "tailor") {
      user.tailorProfile = { ...user.tailorProfile, ...profileData };
    } else if (role === "designer") {
      user.designerProfile = { ...user.designerProfile, ...profileData };
    }

    await user.save();
    await pending.deleteOne();

    res.status(200).json({ success: true, message: "Profile attached", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
