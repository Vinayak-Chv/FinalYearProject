import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUser, FiPhone, FiMapPin, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { customerRegistrationSchema } from "../validations/authValidations";

const RegisterCustomer = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formik = useFormik({
        initialValues: {
            name: "",
            phone: "",
            address: {
                street: "",
                city: "",
                state: "",
                pincode: "",
            },
        },
        validationSchema: customerRegistrationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values) => {
            setError("");
            setLoading(true);
            try {
                const { data } = await axios.post("http://localhost:3000/api/auth/temp-profile", {
                    role: "customer",
                    profileData: values,
                });
                if (data.success) {
                    toast.success("Profile saved! Please log in to complete registration.");
                    navigate(`/login?token=${data.token}`);
                } else {
                    throw new Error(data.message || "Something went wrong");
                }
            } catch (err) {
                const msg = err.response?.data?.message || err.message || "Server error";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        },
    });

    const nextStep = () => {
        // Validate only the fields in step 1 before moving to step 2
        if (step === 1) {
            formik.validateField("name");
            formik.validateField("phone");
            if (formik.errors.name || formik.errors.phone) {
                toast.error("Please fill in all required fields correctly.");
                return;
            }
            setStep(2);
        }
    };

    const prevStep = () => setStep(1);

    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Customer Registration</h1>
            {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                {step === 1 && (
                    <>
                        <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 pr-3 py-2 border rounded focus:border-primary"
                            />
                        </div>
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-red-500 text-sm">{formik.errors.name}</p>
                        )}

                        <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full pl-10 pr-3 py-2 border rounded focus:border-primary"
                            />
                        </div>
                        {formik.touched.phone && formik.errors.phone && (
                            <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                        )}
                    </>
                )}

                {step === 2 && (
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
                )}

                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex items-center gap-2 text-primary hover:underline"
                        >
                            <FiArrowLeft /> Back
                        </button>
                    )}
                    {step < 2 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="ml-auto flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                        >
                            Next <FiArrowRight />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Complete Registration"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default RegisterCustomer;