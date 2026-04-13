import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

// Get or create a conversation between two users
export const getOrCreateConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body;
    const userId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [userId, otherUserId],
      });
      await conversation.save();
    }

    res.json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all conversations for the logged-in user
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name avatar")
      .sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, receiverId, text } = req.body;
    const senderId = req.user.id;

    const message = new Message({
      conversationId,
      senderId,
      receiverId,
      text,
    });
    await message.save();

    // Update conversation's lastMessage and updatedAt
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      updatedAt: Date.now(),
    });

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
