import User from "../models/user.js";

export const getProfessionals = async (req, res) => {
  try {
    const professionals = await User.find(
      { role: { $in: ["tailor", "designer"] } },
      "name avatar role tailorProfile.designerProfile",
    ).lean();

    // Format response
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
