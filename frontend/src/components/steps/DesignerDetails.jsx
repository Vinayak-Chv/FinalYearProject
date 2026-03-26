import { useFormik } from "formik";
import * as Yup from "yup";
import { FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";

const designerDetailsSchema = Yup.object({
    targetSegment: Yup.array().min(1, "Select at least one target segment"),
    address: Yup.object({
        street: Yup.string().required(),
        city: Yup.string().required(),
        state: Yup.string().required(),
        pincode: Yup.number().min(100000).max(999999).required(),
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

const DesignerDetails = ({ formData, updateFormData, onNext, onPrev }) => {
    const formik = useFormik({
        initialValues: {
            targetSegment: formData.targetSegment || [],
            address: formData.address || { street: "", city: "", state: "", pincode: "" },
            portfolio: formData.portfolio || [],
            socialLinks: formData.socialLinks || {},
            bio: formData.bio || "",
            education: formData.education || "",
            awards: formData.awards || [],
        },
        validationSchema: designerDetailsSchema,
        onSubmit: (values) => {
            // ✅ Remove confirmPassword before saving
            const { confirmPassword, ...dataToSave } = values;
            updateFormData(dataToSave);
            toast.success("Designer details saved");
            onNext();
        },
    });

    const handleCheckboxArray = (field, value) => {
        const current = formik.values[field] || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        formik.setFieldValue(field, updated);
    };

    const handleAwards = (e) => {
        const awards = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
        formik.setFieldValue("awards", awards);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold mb-4 text-center">Designer Details</h2>

            {/* Target Segment */}
            <div>
                <label className="block font-medium mb-1">Target Segment</label>
                <div className="flex flex-wrap gap-4">
                    {["Men", "Women", "Boys", "Girls"].map((segment) => (
                        <label key={segment} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                value={segment}
                                checked={formik.values.targetSegment.includes(segment)}
                                onChange={() => handleCheckboxArray("targetSegment", segment)}
                                className="rounded"
                            />
                            {segment}
                        </label>
                    ))}
                </div>
                {formik.touched.targetSegment && formik.errors.targetSegment && (
                    <p className="text-red-500 text-sm">{formik.errors.targetSegment}</p>
                )}
            </div>

            {/* Address */}
            <div className="space-y-3">
                <h3 className="font-semibold">Studio Address</h3>
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

            {/* Portfolio */}
            <div>
                <h3 className="font-semibold mb-2">Portfolio (optional)</h3>
                <input
                    type="text"
                    name="portfolioUrl"
                    placeholder="Image/Video URL"
                    value={formik.values.portfolio?.[0]?.url || ""}
                    onChange={(e) => {
                        const url = e.target.value;
                        formik.setFieldValue("portfolio", url ? [{ type: "image", url }] : []);
                    }}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            {/* Social Links */}
            <div>
                <h3 className="font-semibold mb-2">Social Links (optional)</h3>
                <input
                    type="url"
                    name="socialLinks.instagram"
                    placeholder="Instagram"
                    value={formik.values.socialLinks.instagram || ""}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                    type="url"
                    name="socialLinks.pinterest"
                    placeholder="Pinterest"
                    value={formik.values.socialLinks.pinterest || ""}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                    type="url"
                    name="socialLinks.behance"
                    placeholder="Behance"
                    value={formik.values.socialLinks.behance || ""}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                    type="url"
                    name="socialLinks.website"
                    placeholder="Website"
                    value={formik.values.socialLinks.website || ""}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                    type="url"
                    name="socialLinks.linkedin"
                    placeholder="LinkedIn"
                    value={formik.values.socialLinks.linkedin || ""}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            {/* Bio, Education, Awards */}
            <textarea
                name="bio"
                placeholder="Short Bio (optional)"
                value={formik.values.bio}
                onChange={formik.handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded"
            />
            <input
                type="text"
                name="education"
                placeholder="Education (optional)"
                value={formik.values.education}
                onChange={formik.handleChange}
                className="w-full px-3 py-2 border rounded"
            />
            <input
                type="text"
                name="awards"
                placeholder="Awards (comma separated, optional)"
                onChange={handleAwards}
                className="w-full px-3 py-2 border rounded"
            />

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

export default DesignerDetails;
