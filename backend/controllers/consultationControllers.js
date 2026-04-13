import Consultation from "../models/consultation.js";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

// Create a consultation (customer requests)
export const createConsultation = async (req, res) => {
  try {
    const { professionalId, scheduledAt, notes } = req.body;
    const customerId = req.user.id;

    // Check if a pending consultation already exists between these two
    const existing = await Consultation.findOne({
      customerId,
      professionalId,
      status: "pending",
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a pending consultation request with this professional.",
      });
    }

    const consultation = new Consultation({
      customerId,
      professionalId,
      scheduledAt: scheduledAt || Date.now(),
      meetingLink: "", // empty until accepted
      notes,
      status: "pending",
    });
    await consultation.save();

    // Send a chat message to the professional (request notification)
    let conversation = await Conversation.findOne({
      participants: { $all: [customerId, professionalId] },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [customerId, professionalId],
      });
      await conversation.save();
    }

    const systemMessage = new Message({
      conversationId: conversation._id,
      senderId: customerId,
      receiverId: professionalId,
      text: `📅 You have a new consultation request from ${req.user.name}. Please check your dashboard.`,
      read: false,
    });
    await systemMessage.save();

    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: systemMessage.text,
      updatedAt: Date.now(),
    });

    res.status(201).json({ success: true, consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get consultations for the logged-in user (as customer or professional)
export const getMyConsultations = async (req, res) => {
  try {
    const userId = req.user.id;
    const consultations = await Consultation.find({
      $or: [{ customerId: userId }, { professionalId: userId }],
    })
      .populate("customerId", "name avatar")
      .populate("professionalId", "name avatar")
      .sort({ createdAt: -1 });
    res.json({ success: true, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: get all consultations
export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find()
      .populate("customerId", "name email")
      .populate("professionalId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, consultations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update consultation status (completed, cancelled, etc.)
export const updateConsultationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res
        .status(404)
        .json({ success: false, message: "Consultation not found" });
    }
    consultation.status = status;
    await consultation.save();
    res.json({ success: true, consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Professional accepts or rejects a pending consultation
export const respondToConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return res
        .status(404)
        .json({ success: false, message: "Consultation not found" });
    }

    // Ensure the logged-in user is the professional
    if (consultation.professionalId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (consultation.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Consultation already responded" });
    }

    if (action === "accept") {
      const meetingLink = `consult-${consultation.customerId}-${consultation.professionalId}-${Date.now()}`;
      consultation.meetingLink = meetingLink;
      consultation.status = "scheduled";
      await consultation.save();

      // Send a message in the chat with the meeting link
      const conversation = await Conversation.findOne({
        participants: {
          $all: [consultation.customerId, consultation.professionalId],
        },
      });
      if (conversation) {
        await Message.create({
          conversationId: conversation._id,
          senderId: consultation.professionalId,
          receiverId: consultation.customerId,
          text: `✅ Your consultation request has been accepted. Join the meeting: https://meet.jit.si/${meetingLink}`,
        });
        await Conversation.findByIdAndUpdate(conversation._id, {
          lastMessage: "Consultation accepted",
          updatedAt: Date.now(),
        });
      }
    } else if (action === "reject") {
      consultation.status = "cancelled";
      await consultation.save();
      // Send rejection message
      const conversation = await Conversation.findOne({
        participants: {
          $all: [consultation.customerId, consultation.professionalId],
        },
      });
      if (conversation) {
        await Message.create({
          conversationId: conversation._id,
          senderId: consultation.professionalId,
          receiverId: consultation.customerId,
          text: `❌ Your consultation request has been declined.`,
        });
        await Conversation.findByIdAndUpdate(conversation._id, {
          lastMessage: "Consultation declined",
          updatedAt: Date.now(),
        });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });
    }

    res.json({ success: true, consultation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending requests for the professional (for their dashboard)
export const getPendingRequests = async (req, res) => {
  try {
    const requests = await Consultation.find({
      professionalId: req.user.id,
      status: "pending",
    }).populate("customerId", "name avatar");
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
