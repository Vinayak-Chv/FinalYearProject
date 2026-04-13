import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FiUser, FiShoppingBag, FiCalendar, FiStar, FiSettings,
    FiBriefcase, FiScissors, FiPenTool, FiUsers, FiLogOut
} from "react-icons/fi";

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Define sidebar navigation based on user role
    const getNavItems = () => {
        const commonItems = [
            { path: "profile", label: "Profile", icon: <FiUser /> },
            { path: "orders", label: "Orders", icon: <FiShoppingBag /> },
            { path: "consultations", label: "Consultations", icon: <FiCalendar /> },
            { path: "reviews", label: "Reviews", icon: <FiStar /> },
            { path: "settings", label: "Settings", icon: <FiSettings /> },
        ];

        if (user?.role === "tailor") {
            return [
                { path: "profile", label: "Profile", icon: <FiUser /> },
                { path: "portfolio", label: "Portfolio", icon: <FiScissors /> },
                { path: "orders", label: "Orders", icon: <FiShoppingBag /> },
                { path: "consultations", label: "Consultations", icon: <FiCalendar /> },
                { path: "reviews", label: "Reviews", icon: <FiStar /> },
                { path: "settings", label: "Settings", icon: <FiSettings /> },
            ];
        }

        if (user?.role === "designer") {
            return [
                { path: "profile", label: "Profile", icon: <FiUser /> },
                { path: "portfolio", label: "Portfolio", icon: <FiPenTool /> },
                { path: "orders", label: "Orders", icon: <FiShoppingBag /> },
                { path: "consultations", label: "Consultations", icon: <FiCalendar /> },
                { path: "reviews", label: "Reviews", icon: <FiStar /> },
                { path: "settings", label: "Settings", icon: <FiSettings /> },
            ];
        }

        if (user?.role === "admin") {
            return [
                { path: "users", label: "Users", icon: <FiUsers /> },
                { path: "orders", label: "Orders", icon: <FiShoppingBag /> },
                { path: "consultations", label: "Consultations", icon: <FiCalendar /> },
                { path: "complaints", label: "Complaints", icon: <FiStar /> },
                { path: "statistics", label: "Statistics", icon: <FiBriefcase /> },
            ];
        }

        // Default customer
        return commonItems;
    };

    const navItems = getNavItems();
    const dashboardTitle = `${user?.role?.charAt(0).toUpperCase()}${user?.role?.slice(1)} Dashboard`;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold text-primary">{dashboardTitle}</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "profile"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;