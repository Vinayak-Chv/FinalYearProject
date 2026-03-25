import { useFormik } from "formik";
import * as Yup from "yup";
import { FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";

const customerDetailsSchema = Yup.object({
    address: Yup.object({
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pincode: Yup.number().min(100000, "6 digits").max(999999, "6 digits").required("Pincode required"),
    }),

    measurements: Yup.object({
        chest: Yup.number()
            .nullable()
            .transform((v, o) => (o === "" ? null : v)),

        waist: Yup.number()
            .nullable()
            .transform((v, o) => (o === "" ? null : v)),

        hips: Yup.number()
            .nullable()
            .transform((v, o) => (o === "" ? null : v)),

        shoulder: Yup.number()
            .nullable()
            .transform((v, o) => (o === "" ? null : v)),

        sleeve: Yup.number()
            .nullable()
            .transform((v, o) => (o === "" ? null : v)),

        length: Yup.number()
            .nullable()
            .transform((v, o) => (o === "" ? null : v)),
    }).optional(),

});

const CustomerDetails = ({ formData, updateFormData, onNext, onPrev }) => {
    const formik = useFormik({
        initialValues: {
            address: formData.address || { street: "", city: "", state: "", pincode: "" },
            measurements: formData.measurements || {},
        },
        validationSchema: customerDetailsSchema,
        onSubmit: (values) => {
            const cleanedValues = { ...values };

            if (
                !cleanedValues.measurements ||
                Object.values(cleanedValues.measurements).every(
                    (val) => val === "" || val === undefined
                )
            ) {
                delete cleanedValues.measurements;
            }

            updateFormData(cleanedValues);
            toast.success("Customer details saved");
            onNext();
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold mb-4 text-center">Customer Details</h2>

            {/* Address */}
            <div className="space-y-3">
                <h3 className="font-semibold">Address</h3>
                <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                    <input
                        type="text"
                        name="address.street"
                        placeholder="Street"
                        value={formik.values.address.street}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-10 pr-3 py-2 border rounded"
                    />
                </div>
                {formik.touched.address?.street && formik.errors.address?.street && (
                    <p className="text-red-500 text-sm">{formik.errors.address.street}</p>
                )}
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="text"
                        name="address.city"
                        placeholder="City"
                        value={formik.values.address.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="px-3 py-2 border rounded"
                    />
                    <input
                        type="text"
                        name="address.state"
                        placeholder="State"
                        value={formik.values.address.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="px-3 py-2 border rounded"
                    />
                </div>
                <input
                    type="text"
                    name="address.pincode"
                    placeholder="Pincode"
                    value={formik.values.address.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded"
                />
                {formik.touched.address?.pincode && formik.errors.address?.pincode && (
                    <p className="text-red-500 text-sm">{formik.errors.address.pincode}</p>
                )}
            </div>

            {/* Measurements (optional) */}
            <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold">Measurements (optional)</h3>
                <div className="grid grid-cols-2 gap-3">
                    {["chest", "waist", "hips", "shoulder", "sleeve", "length"].map((field) => (
                        <input
                            key={field}
                            type="number"
                            name={`measurements.${field}`}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={formik.values.measurements[field] || ""}
                            onChange={formik.handleChange}
                            className="px-3 py-2 border rounded"
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button type="button" onClick={onPrev} className="text-primary hover:underline">
                    Back
                </button>
                <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark"
                >
                    Next
                </button>
            </div>
        </form>
    );
};

export default CustomerDetails;