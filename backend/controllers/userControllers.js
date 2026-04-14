import User from "../models/user.js";
import bcrypt from "bcrypt";
import Cart from "../models/cart.js";

export const getProfessionals = async (req, res) => {
  try {
    const professionals = await User.find(
      { role: { $in: ["tailor", "designer"] } },
      "name avatar role tailorProfile designerProfile",
    ).lean();

    const formatted = professionals.map((prof) => ({
      _id: prof._id,
      name: prof.name,
      avatar:
        prof.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      role: prof.role,
      specialization:
        prof.role === "tailor"
          ? prof.tailorProfile?.specialization
          : prof.designerProfile?.specialization,
    }));

    res.json({ success: true, professionals: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfessionalById = async (req, res) => {
  try {
    const professional = await User.findOne({
      _id: req.params.id,
      role: { $in: ["tailor", "designer"] },
    }).lean();

    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    res.json({
      success: true,
      professional: {
        _id: professional._id,
        name: professional.name,
        avatar:
          professional.avatar ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        role: professional.role,
        tailorProfile: professional.tailorProfile || null,
        designerProfile: professional.designerProfile || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyMeasurements = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("customerProfile.measurements")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const list = user?.customerProfile?.measurements || [];
    const measurements = Array.isArray(list) && list.length > 0 ? list[list.length - 1] : null;

    res.json({
      success: true,
      measurements: measurements || null,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveMyMeasurements = async (req, res) => {
  try {
    const { chest, waist, hips, shoulder, sleeve, length } = req.body || {};

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.customerProfile) user.customerProfile = {};
    if (!Array.isArray(user.customerProfile.measurements)) {
      user.customerProfile.measurements = [];
    }

    const parsed = {
      chest: chest === "" || chest === null || chest === undefined ? undefined : Number(chest),
      waist: waist === "" || waist === null || waist === undefined ? undefined : Number(waist),
      hips: hips === "" || hips === null || hips === undefined ? undefined : Number(hips),
      shoulder:
        shoulder === "" || shoulder === null || shoulder === undefined ? undefined : Number(shoulder),
      sleeve: sleeve === "" || sleeve === null || sleeve === undefined ? undefined : Number(sleeve),
      length: length === "" || length === null || length === undefined ? undefined : Number(length),
    };

    user.customerProfile.measurements.push(parsed);
    await user.save();

    const saved = user.customerProfile.measurements[user.customerProfile.measurements.length - 1];

    res.json({
      success: true,
      message: "Measurements saved",
      measurements: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body || {};

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Clean up user-owned cart (safe + minimal).
    await Cart.deleteOne({ userId });

    await User.deleteOne({ _id: userId });

    return res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
