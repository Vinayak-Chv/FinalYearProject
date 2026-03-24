import * as Yup from "yup";

export const loginSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

export const customerRegistrationSchema = Yup.object({
    name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
    address: Yup.object({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.number()
            .min(100000, "Pincode must be 6 digits")
            .max(999999, "Pincode must be 6 digits")
            .required("Pincode is required"),
    }),
});

export const tailorRegistrationSchema = Yup.object({
    name: Yup.string().min(3).required("Name is required"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required("Phone is required"),
    businessName: Yup.string().min(3).required("Business name is required"),
    specialization: Yup.array().min(1, "At least one specialization is required"),
    experience: Yup.number().min(0).max(50).required("Experience is required"),
    serviceAreas: Yup.array().min(1, "At least one service area is required"),
    address: Yup.object({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.number().min(100000, "Pincode must be 6 digits").max(999999, "Pincode must be 6 digits").required("Pincode is required"),
    }),
    bio: Yup.string().max(500).optional(),
});

export const designerRegistrationSchema = Yup.object({
    name: Yup.string().min(3).required("Name is required"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Phone must be 10 digits").required("Phone is required"),
    brandName: Yup.string().min(3).required("Brand name is required"),
    specialization: Yup.array().min(1, "At least one specialization is required"),
    address: Yup.object({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.number().min(100000, "Pincode must be 6 digits").max(999999, "Pincode must be 6 digits").required("Pincode is required"),
    }),
    bio: Yup.string().max(2000).optional(),
    education: Yup.string().max(500).optional(),
});