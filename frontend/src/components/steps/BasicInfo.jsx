import { useFormik } from "formik";
import { FiUser, FiPhone } from "react-icons/fi";
import toast from "react-hot-toast";
import { tailorBasicInfoSchema } from "../../validations/tailorValidations";
import { designerBasicInfoSchema } from "../../validations/designerValidations";

const BasicInfo = ({ role, formData, updateFormData, onNext }) => {
    const validationSchema =
        role === "tailor"
            ? tailorBasicInfoSchema
            : role === "designer"
                ? designerBasicInfoSchema
                : null;

    const formik = useFormik({
        initialValues: {
            name: formData.name || "",
            phone: formData.phone || "",
            ...(role === "tailor" && {
                businessName: formData.businessName || "",
                experience: formData.experience || "",
                bio: formData.bio || "",
            }),
            ...(role === "designer" && {
                brandName: formData.brandName || "",
                specialization: formData.specialization || [],
            }),
        },
        validationSchema,
        onSubmit: (values) => {
            updateFormData(values);
            toast.success("Basic info saved");
            onNext();
        },
    });

    const handleCheckboxArray = (field, value) => {
        const current = formik.values[field] || [];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        formik.setFieldValue(field, updated);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold mb-4 text-center">Basic Information</h2>

            {/* Name */}
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
                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}

            {/* Phone */}
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
                <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}

            {/* Tailor-specific */}
            {role === "tailor" && (
                <>
                    <input
                        type="text"
                        name="businessName"
                        placeholder="Business Name"
                        value={formik.values.businessName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border rounded focus:border-primary"
                    />
                    {formik.touched.businessName && formik.errors.businessName && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.businessName}</p>
                    )}

                    <input
                        type="number"
                        name="experience"
                        placeholder="Years of Experience"
                        value={formik.values.experience}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border rounded focus:border-primary"
                    />
                    {formik.touched.experience && formik.errors.experience && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.experience}</p>
                    )}

                    <textarea
                        name="bio"
                        placeholder="Short Bio (optional)"
                        value={formik.values.bio}
                        onChange={formik.handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border rounded"
                    />
                </>
            )}

            {/* Designer-specific */}
            {role === "designer" && (
                <>
                    <input
                        type="text"
                        name="brandName"
                        placeholder="Brand Name"
                        value={formik.values.brandName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border rounded focus:border-primary"
                    />
                    {formik.touched.brandName && formik.errors.brandName && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.brandName}</p>
                    )}

                    <div>
                        <label className="block font-medium mb-1">Specializations</label>
                        <div className="flex flex-wrap gap-4">
                            {["Bridal Wear", "Ethnic Wear", "Indo-Western", "Kids Wear"].map(
                                (spec) => (
                                    <label key={spec} className="flex items-center gap-1">
                                        <input
                                            type="checkbox"
                                            value={spec}
                                            checked={formik.values.specialization?.includes(spec)}
                                            onChange={() => handleCheckboxArray("specialization", spec)}
                                            className="rounded"
                                        />
                                        {spec}
                                    </label>
                                )
                            )}
                        </div>
                        {formik.touched.specialization && formik.errors.specialization && (
                            <p className="text-red-500 text-sm">{formik.errors.specialization}</p>
                        )}
                    </div>
                </>
            )}

            <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark"
            >
                Next
            </button>
        </form>
    );
};

export default BasicInfo;
