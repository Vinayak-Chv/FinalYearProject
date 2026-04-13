import User from "../models/user.js";

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
