import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../validations/authValidations";
import { FiMail, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [error, setError] = useState("");

  // Redirect after login
  if (user) {
    if (user.role === "customer") {
      navigate("/");
    } else {
      navigate("/dashboard");
    }
    return null;
  }

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError("");
      const result = await login(values.email, values.password);
      if (!result.success) {
        setError(result.message);
        toast.error(result.message);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Welcome Back</h1>
        <p className="text-text-secondary mt-2">Sign in to your account</p>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${formik.touched.email && formik.errors.email
                ? "border-red-300 bg-red-50"
                : "border-neutral-light"
                }`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-primary ${formik.touched.password && formik.errors.password
                ? "border-red-300 bg-red-50"
                : "border-neutral-light"
                }`}
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
        >
          {formik.isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center mt-6 text-text-secondary">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary hover:text-blue-500 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;