import * as Yup from "yup";
import { commonFields } from "./common";

export const designerBasicInfoSchema = Yup.object({
    ...commonFields,
    brandName: Yup.string().min(3).required("Brand name is required"),
    specialization: Yup.array().min(1, "Select at least one specialization"),
});

export const designerDetailsSchema = Yup.object({
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
        pinterest: Yup.string().url().optional(),
        behance: Yup.string().url().optional(),
        website: Yup.string().url().optional(),
        linkedin: Yup.string().url().optional(),
    }).optional(),
    bio: Yup.string().optional(),
    education: Yup.string().optional(),
    awards: Yup.array().optional(),
});
