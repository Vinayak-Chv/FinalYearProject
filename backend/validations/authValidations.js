import Joi from "joi";

// Common fields for stakeholders
const commonFields = {
  name: Joi.string().min(3).max(50).required().messages({
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 digits",
      "any.required": "Phone number is required",
    }),
};

// Customer registration
export const registerCustomerSchema = Joi.object({
  ...commonFields,
  role: Joi.string().valid("customer").default("customer"),
  address: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    pincode: Joi.number().integer().min(100000).max(999999).required(),
  }).optional(),
});

// Tailor registration
export const registerTailorSchema = Joi.object({
  ...commonFields,
  role: Joi.string().valid("tailor").required(),
  businessName: Joi.string().min(3).max(100).required(),
  specialization: Joi.array().items(Joi.string()).min(1).required(),
  experience: Joi.number().integer().min(0).max(50).required(),
  serviceAreas: Joi.array()
    .items(Joi.number().integer().min(100000).max(999999))
    .min(1)
    .required(),

  portfolio: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid("image", "video", "link").required(),
        url: Joi.string().uri().required(),
        title: Joi.string().max(100).optional(),
        description: Joi.string().max(500).optional(),
      }),
    )
    .optional(),

  socialLinks: Joi.object({
    instagram: Joi.string().uri().optional(),
    facebook: Joi.string().uri().optional(),
    whatsapp: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional(),
    website: Joi.string().uri().optional(),
  }).optional(),

  bio: Joi.string().max(1000).optional(),
});

// Designer registration
export const registerDesignerSchema = Joi.object({
  ...commonFields,
  role: Joi.string().valid("designer").required(),
  brandName: Joi.string().min(3).max(100).required(),
  specialization: Joi.array().items(Joi.string()).min(1).required(),

  portfolio: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .valid("image", "video", "lookbook", "collection")
          .required(),
        url: Joi.string().uri().required(),
        title: Joi.string().max(100).required(),
        description: Joi.string().max(500).optional(),
        tags: Joi.array().items(Joi.string()).optional(),
      }),
    )
    .optional(),

  socialLinks: Joi.object({
    instagram: Joi.string().uri().optional(),
    pinterest: Joi.string().uri().optional(),
    behance: Joi.string().uri().optional(),
    website: Joi.string().uri().optional(),
    linkedin: Joi.string().uri().optional(),
  }).optional(),

  bio: Joi.string().max(2000).optional(),
  education: Joi.string().max(500).optional(),
  awards: Joi.array().items(Joi.string()).optional(),
});

// Login validation
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
