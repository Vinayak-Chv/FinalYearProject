import { FiUser, FiScissors, FiPenTool } from "react-icons/fi";

const RoleSelection = ({ setRole, onNext }) => {
    const roles = [
        {
            id: "customer",
            title: "Customer",
            description: "Browse designs, order custom outfits, and track your orders.",
            icon: <FiUser className="text-5xl text-primary" />,
            bgColor: "bg-accent-light",
        },
        {
            id: "tailor",
            title: "Tailor",
            description: "Offer stitching services, manage orders, and grow your business.",
            icon: <FiScissors className="text-5xl text-primary" />,
            bgColor: "bg-secondary-light",
        },
        {
            id: "designer",
            title: "Fashion Designer",
            description: "Showcase your designs, get custom orders, and build your brand.",
            icon: <FiPenTool className="text-5xl text-primary" />,
            bgColor: "bg-accent-light",
        },
    ];

    const handleSelect = (selectedRole) => {
        setRole(selectedRole);
        onNext();
    };

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-text-primary mb-4">Join as a...</h1>
                <p className="text-text-secondary text-lg">Choose your role to get started.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {roles.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => handleSelect(role.id)}
                        className={`${role.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full aspect-square flex flex-col items-center justify-center p-4`}
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-2">{role.icon}</div>
                            <h2 className="text-xl font-bold text-text-primary mb-1">{role.title}</h2>
                            <p className="text-text-secondary text-sm">{role.description}</p>
                            <div className="mt-4 text-primary font-semibold">Register Now →</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="text-center mt-12">
                <p className="text-text-secondary">
                    Already have an account?{" "}
                    <button
                        onClick={() => (window.location.href = "/login")}
                        className="text-primary hover:text-blue-500 cursor-pointer hover:underline"
                    >
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RoleSelection;