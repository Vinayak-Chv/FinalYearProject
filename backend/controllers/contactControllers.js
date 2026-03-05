import Contact from "../models/contact.js";
import Joi from "joi";

// Validations
const contactSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than 50 characters",
    "any.required": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),

  subject: Joi.string().min(3).max(100).required().messages({
    "string.min": "Subject must be at least 3 characters",
    "string.max": "Subject must be less than 100 characters",
    "any.required": "Subject is required",
  }),

  message: Joi.string().min(10).max(1000).required().messages({
    "string.min": "Message must be at least 10 characters",
    "string.max": "Message must be less than 1000 characters",
    "any.required": "Message is required",
  }),
});

export const submitContact = async (req, res) => {
  const { error } = contactSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
  }

  try {
    const { name, email, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Message successfully sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
