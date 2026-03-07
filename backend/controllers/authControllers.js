import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  registerCustomerSchema,
  registerTailorSchema,
  registerDesignerSchema,
  loginSchema,
} from "../validations/authValidations.js";

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
    const { name, email, password, phone, address } = req.body;

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
      businessName,
      specialization,
      experience,
      serviceAreas,
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
      role: "tailor",
      tailorProfile: {
        businessName,
        specialization,
        experience,
        serviceAreas,
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
      brandName,
      specialization,
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
      role: "designer",
      designerProfile: {
        brandName,
        specialization,
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
        role: user.role,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
