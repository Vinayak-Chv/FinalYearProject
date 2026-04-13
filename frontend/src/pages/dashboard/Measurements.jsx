import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Measurements = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("authToken");
    const [measurements, setMeasurements] = useState({
        chest: "",
        waist: "",
        hips: "",
        shoulder: "",
        sleeve: "",
        length: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchMeasurements = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/api/users/measurements", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (data.measurements) {
                    setMeasurements(data.measurements);
                }
            } catch (error) {
                console.error("Failed to fetch measurements", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeasurements();
    }, [token]);

    const handleChange = (e) => {
        setMeasurements({ ...measurements, [e.target.name]: e.target.value });
    };

    const saveMeasurements = async () => {
        setSaving(true);
        try {
            await axios.put(
                "http://localhost:3000/api/users/measurements",
                measurements,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Measurements saved");
        } catch (error) {
            toast.error("Failed to save measurements");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Body Measurements</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["chest", "waist", "hips", "shoulder", "sleeve", "length"].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium capitalize mb-1">{field}</label>
                            <input
                                type="number"
                                name={field}
                                value={measurements[field] || ""}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                placeholder={`Enter ${field} (cm)`}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <button
                        onClick={saveMeasurements}
                        disabled={saving}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Measurements"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Measurements;