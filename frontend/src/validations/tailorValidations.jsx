import * as Yup from "yup";
import { commonFields } from "./common";

export const tailorBasicInfoSchema = Yup.object({
    ...commonFields,
    businessName: Yup.string().min(3).required("Business name is required"),
    experience: Yup.number().min(0).max(50).required("Experience is required"),
    bio: Yup.string().optional(),
});

export const tailorDetailsSchema = Yup.object({
    workType: Yup.array().min(1, "Select at least one work type"),
    garmentType: Yup.array().min(1, "Select at least one garment type"),
    targetSegment: Yup.array().min(1, "Select at least one target segment"),
    address: Yup.object({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.number().min(100000, "6 digits").max(999999, "6 digits").required("Pincode required"),
    }),
    portfolio: Yup.array().optional(),
    socialLinks: Yup.object({
        instagram: Yup.string().url().optional(),
        facebook: Yup.string().url().optional(),
        whatsapp: Yup.string().optional(),
        website: Yup.string().url().optional(),
    }).optional(),
});

