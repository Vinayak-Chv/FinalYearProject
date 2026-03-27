import * as Yup from "yup";

export const customerDetailsSchema = Yup.object({
    address: Yup.object({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.number()
            .min(100000, "6 digits")
            .max(999999, "6 digits")
            .required("Pincode required"),
    }),
    measurements: Yup.object({
        chest: Yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
        waist: Yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
        hips: Yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
        shoulder: Yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
        sleeve: Yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
        length: Yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
    }).optional(),
});
