import { Link } from "react-router-dom";
import { FiUser, FiScissors, FiPenTool } from "react-icons/fi";

const RoleSelection = () => {
    const roles = [
        {
            id: "customer",
            title: "Customer",
            description: "Browse designs, order custom outfits, and track your orders.",
            icon: <FiUser className="text-5xl text-primary" />,
            path: "/register/customer",
            bgColor: "bg-accent-light",
        },
        {
            id: "tailor",
            title: "Tailor",
            description: "Offer stitching services, manage orders, and grow your business.",
            icon: <FiScissors className="text-5xl text-primary" />,
            path: "/register/tailor",
            bgColor: "bg-secondary-light",
        },
        {
            id: "designer",
            title: "Fashion Designer",
            description: "Showcase your designs, get custom orders, and build your brand.",
            icon: <FiPenTool className="text-5xl text-primary" />,
            path: "/register/designer",
            bgColor: "bg-accent-light",
        },
    ];

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-text-primary mb-4">
                        Join as a...
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Choose your role to get started. Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:text-blue-500 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {roles.map((role) => (
                        <Link
                            key={role.id}
                            to={role.path}
                            className={`${role.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="mb-4">{role.icon}</div>
                                <h2 className="text-2xl font-bold text-text-primary mb-2">
                                    {role.title}
                                </h2>
                                <p className="text-text-secondary">{role.description}</p>
                                <div className="mt-6 text-primary font-semibold">
                                    Register Now →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-text-secondary">
                        By joining, you agree to our{" "}
                        <Link className="text-primary hover:text-blue-500 hover:underline">
                            Terms
                        </Link>{" "}
                        and{" "}
                        <Link className="text-primary hover:text-blue-500 hover:underline">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;