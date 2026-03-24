import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { useAuth } from "../context/AuthContext";
import { loginSchema } from "../validations/authValidations";
import { FiMail, FiLock } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  const [error, setError] = useState("");
  const token = new URLSearchParams(location.search).get("token");

  // After login, attach pending profile if token exists
  useEffect(() => {
    const attachProfile = async () => {
      if (user && token) {
        try {
          await axios.post(
            "http://localhost:3000/api/auth/attach-profile",
            { token },
            { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
          );
          toast.success("Welcome! Your profile is complete.");
          navigate("/");
        } catch (err) {
          console.error("Failed to attach profile", err);
          toast.error("Could not attach profile data. Please contact support.");
          navigate("/");
        }
      } else if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        navigate("/");
      }
    };
    attachProfile();
  }, [user, token, navigate]);

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