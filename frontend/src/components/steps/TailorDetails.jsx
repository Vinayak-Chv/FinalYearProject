import { useFormik } from "formik";
import * as Yup from "yup";
import { FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";

const tailorDetailsSchema = Yup.object({
    workType: Yup.array().min(1, "Select at least one work type"),
    garmentType: Yup.array().min(1, "Select at least one garment type"),
    targetSegment: Yup.array().min(1, "Select at least one target segment"),
    serviceAreas: Yup.array().min(1, "Select at least one service area"),
    address: Yup.object({
        street: Yup.string().required(),
        city: Yup.string().required(),
        state: Yup.string().required(),
        pincode: Yup.number().min(100000).max(999999).required(),
    }),
    portfolio: Yup.array().optional(),
    socialLinks: Yup.object({
        instagram: Yup.string().url().optional(),
        facebook: Yup.string().url().optional(),
        whatsapp: Yup.string().optional(),
        website: Yup.string().url().optional(),
    }).optional(),
});

const TailorDetails = ({ formData, updateFormData, onNext, onPrev }) => {
    const formik = useFormik({
        initialValues: {
            workType: formData.workType || [],
            garmentType: formData.garmentType || [],
            targetSegment: formData.targetSegment || [],
            serviceAreas: formData.serviceAreas || [],
            address: formData.address || { street: "", city: "", state: "", pincode: "" },
            portfolio: formData.portfolio || [],
            socialLinks: formData.socialLinks || {},
        },
        validationSchema: tailorDetailsSchema,
        onSubmit: (values) => {
            updateFormData(values);
            toast.success("Tailor details saved");
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

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold mb-4 text-center">Tailor Details</h2>

            {/* Work Type */}
            <div>
                <label className="block font-medium mb-1">Work Type</label>
                <div className="flex flex-wrap gap-4">
                    {["stitching", "alterations", "custom design", "embroidery", "repair"].map((type) => (
                        <label key={type} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                value={type}
                                checked={formik.values.workType.includes(type)}
                                onChange={() => handleCheckboxArray("workType", type)}
                                className="rounded"
                            />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                    ))}
                </div>
                {formik.touched.workType && formik.errors.workType && (
                    <p className="text-red-500 text-sm">{formik.errors.workType}</p>
                )}
            </div>

            {/* Garment Type */}
            <div>
                <label className="block font-medium mb-1">Garment Type</label>
                <div className="flex flex-wrap gap-4">
                    {["Bridal Wear", "Ethnic Wear", "Casual Wear", "Kids Wear"].map((type) => (
                        <label key={type} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                value={type}
                                checked={formik.values.garmentType.includes(type)}
                                onChange={() => handleCheckboxArray("garmentType", type)}
                                className="rounded"
                            />
                            {type}
                        </label>
                    ))}
                </div>
                {formik.touched.garmentType && formik.errors.garmentType && (
                    <p className="text-red-500 text-sm">{formik.errors.garmentType}</p>
                )}
            </div>

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

            {/* Service Areas */}
            <div>
                <label className="block font-medium mb-1">Service Areas (pincodes)</label>
                <div className="flex flex-wrap gap-4">
                    {["560001", "560002", "560003", "560004", "560005"].map((pincode) => (
                        <label key={pincode} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                value={pincode}
                                checked={formik.values.serviceAreas.includes(pincode)}
                                onChange={() => handleCheckboxArray("serviceAreas", pincode)}
                                className="rounded"
                            />
                            {pincode}
                        </label>
                    ))}
                </div>
                {formik.touched.serviceAreas && formik.errors.serviceAreas && (
                    <p className="text-red-500 text-sm">{formik.errors.serviceAreas}</p>
                )}
            </div>

            {/* Address */}
            <div className="space-y-3">
                <h3 className="font-semibold">Shop/Studio Address</h3>
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

            {/* Portfolio and Social Links (simplified) */}
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

            <div>
                <h3 className="font-semibold mb-2">Social Links (optional)</h3>
                <input
                    type="url"
                    name="socialLinks.instagram"
                    placeholder="Instagram URL"
                    value={formik.values.socialLinks.instagram || ""}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                    type="url"
                    name="socialLinks.facebook"
                    placeholder="Facebook URL"
                    value={formik.values.socialLinks.facebook || ""}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded mb-2"
                />
                <input
                    type="text"
                    name="socialLinks.whatsapp"
                    placeholder="WhatsApp (optional)"
                    value={formik.values.socialLinks.whatsapp || ""}
                    onChange={formik.handleChange}
                    className="w-full px-3 py-2 border rounded"
                />
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

export default TailorDetails;