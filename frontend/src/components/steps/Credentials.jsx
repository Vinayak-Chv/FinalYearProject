import { useFormik } from "formik";
import { FiMail, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";
import { credentialsSchema } from "../../validations/credentialsValidations";

const Credentials = ({ formData, updateFormData, onNext }) => {
    const formik = useFormik({
        initialValues: {
            email: formData.email || "",
            password: formData.password || "",
            confirmPassword: formData.confirmPassword || "",
        },
        validationSchema: credentialsSchema,
        onSubmit: (values) => {
            // Only save email and password to main formData
            const { email, password } = values;
            updateFormData({ email, password });
            toast.success("Credentials saved");
            onNext();
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-bold mb-4 text-center">Account Credentials</h2>

            {/* Email */}
            <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:border-primary"
                />
            </div>
            {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}

            {/* Password */}
            <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:border-primary"
                />
            </div>
            {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}

            {/* Confirm Password */}
            <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full pl-10 pr-3 py-2 border rounded focus:border-primary"
                />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
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

export default Credentials;
