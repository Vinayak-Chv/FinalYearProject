import Joi from "joi";

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

export default contactSchema;
