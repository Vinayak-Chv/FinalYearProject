import * as Yup from "yup";

export const commonFields = {
    name: Yup.string().min(3, "At least 3 characters").required("Name is required"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),
};
