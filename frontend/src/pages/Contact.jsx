import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { FiMail, FiUser, FiMessageSquare, FiSend, FiCheckCircle } from "react-icons/fi"

const ContactSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),

  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  subject: Yup.string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be less than 100 characters")
    .required("Subject is required"),

  message: Yup.string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters")
    .required("Message is required")
})

const Contact = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
    validationSchema: ContactSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
      try {
        await axios.post("http://localhost:3000/api/contact", values)
        setStatus({
          type: "success",
          message: "Message sent successfully! We'll get back to you soon."
        })
        resetForm()
      } catch (error) {
        setStatus({
          type: "error",
          message: error.response?.data?.message || "Something went wrong"
        })
      } finally {
        setSubmitting(false)
        setTimeout(() => setStatus(null), 5000)
      }
    }
  })

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-accent-light/30 py-16">
      <div className='max-w-7xl mx-auto px-4'>

        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-24 h-1 bg-primary rounded-full"></div>
          <h1 className='text-5xl font-bold text-text-primary pt-8 mb-4'>
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className='text-lg text-text-secondary max-w-2xl mx-auto'>
            Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </div>

        {/* Status Message */}
        {formik.status && (
          <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-lg flex items-center gap-3 ${formik.status.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
            }`}>
            {formik.status.type === "success" ? (
              <FiCheckCircle className="text-xl" />
            ) : (
              <FiSend className="text-xl rotate-45" />
            )}
            <span>{formik.status.message}</span>
          </div>
        )}

        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Left Column - Contact Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <h2 className="text-2xl font-semibold text-text-primary mb-6">Contact Information</h2>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center">
                    <FiMail className="text-primary-dark text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Email</p>
                    <p className="font-medium">vinayak.c@somaiya.edu</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center">
                    <FiUser className="text-primary-dark text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Phone</p>
                    <p className="font-medium">+91 99874 07840</p>
                    <p className="text-sm text-text-secondary">Mon-Fri, 9am-6pm</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-light rounded-full flex items-center justify-center">
                    <FiMessageSquare className="text-primary-dark text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Address</p>
                    <p className="font-medium">67 Elfheim Street</p>
                    <p className="font-medium">Calabasses - 560038</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-primary text-white p-8 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">Send a Message</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="relative">
                <FiUser className="absolute left-4 top-4.5 text-neutral" />
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Your Name"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${formik.touched.name && formik.errors.name
                    ? "border-red-300 bg-red-50"
                    : "border-neutral-light focus:border-primary"
                    }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-500 text-sm mt-1 ml-2">{formik.errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="relative">
                <FiMail className="absolute left-4 top-4.5 text-neutral" />
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Email Address"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${formik.touched.email && formik.errors.email
                    ? "border-red-300 bg-red-50"
                    : "border-neutral-light focus:border-primary"
                    }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-2">{formik.errors.email}</p>
                )}
              </div>

              {/* Subject Field */}
              <div className="relative">
                <FiMessageSquare className="absolute left-4 top-4.5 text-neutral" />
                <input
                  type="text"
                  name="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Subject"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${formik.touched.subject && formik.errors.subject
                    ? "border-red-300 bg-red-50"
                    : "border-neutral-light focus:border-primary"
                    }`}
                />
                {formik.touched.subject && formik.errors.subject && (
                  <p className="text-red-500 text-sm mt-1 ml-2">{formik.errors.subject}</p>
                )}
              </div>

              {/* Message Field */}
              <div className="relative">
                <textarea
                  name="message"
                  rows="5"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Your Message..."
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition resize-none ${formik.touched.message && formik.errors.message
                    ? "border-red-300 bg-red-50"
                    : "border-neutral-light focus:border-primary"
                    }`}
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="text-red-500 text-sm mt-1 ml-2">{formik.errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-primary text-white py-4 rounded-xl hover:bg-primary-dark transition disabled:opacity-50 flex items-center justify-center gap-2 text-lg font-medium group"
              >
                {formik.isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <FiSend className="group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact