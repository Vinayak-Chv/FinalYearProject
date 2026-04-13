import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Consult = () => {
    const [professionals, setProfessionals] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/api/users/professionals", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfessionals(data.professionals);
                setFiltered(data.professionals);
            } catch (error) {
                console.error("Failed to fetch professionals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfessionals();
    }, [token]);

    useEffect(() => {
        if (activeFilter === "all") {
            setFiltered(professionals);
        } else {
            setFiltered(professionals.filter(p => p.role === activeFilter));
        }
    }, [activeFilter, professionals]);

    if (loading) return <div className="py-8 text-center">Loading professionals...</div>;

    return (
        <div className="flex gap-8 py-8">
            {/* Sidebar */}
            <div className="w-1/4 bg-white rounded-lg shadow-md p-4 h-fit sticky top-20">
                <h2 className="text-xl font-bold mb-4">Service Providers</h2>
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveFilter("all")}
                        className={`w-full text-left px-3 py-2 rounded transition ${activeFilter === "all" ? "bg-primary text-white" : "hover:bg-gray-100"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setActiveFilter("tailor")}
                        className={`w-full text-left px-3 py-2 rounded transition ${activeFilter === "tailor" ? "bg-primary text-white" : "hover:bg-gray-100"
                            }`}
                    >
                        Tailors
                    </button>
                    <button
                        onClick={() => setActiveFilter("designer")}
                        className={`w-full text-left px-3 py-2 rounded transition ${activeFilter === "designer" ? "bg-primary text-white" : "hover:bg-gray-100"
                            }`}
                    >
                        Fashion Designers
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="w-3/4">
                <h1 className="text-3xl font-bold text-text-primary mb-6">
                    {activeFilter === "all"
                        ? "All Professionals"
                        : activeFilter === "tailor"
                            ? "Tailors"
                            : "Fashion Designers"}
                </h1>
                {filtered.length === 0 ? (
                    <p className="text-gray-500">No professionals found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((prof) => (
                            <Link
                                key={prof._id}
                                to={`/consult/${prof._id}`}
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                            >
                                <img
                                    src={prof.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    alt={prof.name}
                                    className="w-20 h-20 rounded-full object-cover mx-auto"
                                />
                                <h2 className="text-xl font-semibold text-center mt-2">{prof.name}</h2>
                                <p className="text-center text-gray-500 capitalize">{prof.role}</p>
                                <p className="text-center text-sm text-gray-600 mt-1">
                                    {prof.role === "tailor"
                                        ? prof.tailorProfile?.specialization?.join(", ") || "Tailor"
                                        : prof.designerProfile?.specialization?.join(", ") || "Designer"}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Consult;