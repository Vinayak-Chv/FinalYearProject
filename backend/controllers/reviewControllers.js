import Review from "../models/review.js";

export const getProfessionalReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ professionalId: id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Reviews where the logged-in user is the professional (tailor/designer) */
export const getTailorReviews = async (req, res) => {
  try {
    if (!["tailor", "designer"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only tailors and designers can access this resource",
      });
    }

    const reviews = await Review.find({ professionalId: req.user.id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
