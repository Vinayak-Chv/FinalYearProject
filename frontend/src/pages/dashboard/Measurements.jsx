import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiInfo } from "react-icons/fi";

const Measurements = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("authToken");
    const measurementFields = ["chest", "waist", "hips", "shoulder", "sleeve", "length"];
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
    const [hasSavedMeasurements, setHasSavedMeasurements] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [tooltip, setTooltip] = useState({ field: null, visible: false, x: 0, y: 0 });

    const hasAnyMeasurementValue = (data) =>
        measurementFields.some((field) => data?.[field] !== "" && data?.[field] != null);

    useEffect(() => {
        const fetchMeasurements = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/api/users/measurements", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (data.measurements) {
                    const fetchedMeasurements = data.measurements;
                    setMeasurements(fetchedMeasurements);

                    const isSaved = hasAnyMeasurementValue(fetchedMeasurements);
                    setHasSavedMeasurements(isSaved);
                    setIsEditing(!isSaved);
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
            toast.success("Measurements saved successfully");
            setHasSavedMeasurements(true);
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to save measurements");
        } finally {
            setSaving(false);
        }
    };

    const showTooltip = (field, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltip({
            field,
            visible: true,
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 5,
        });
    };

    const hideTooltip = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    const getInstruction = (field) => {
        const instructions = {
            chest: "Measure around the fullest part of your chest, under the armpits, keeping the tape horizontal.",
            waist: "Measure around your natural waistline (the narrowest part of your torso).",
            hips: "Measure around the fullest part of your hips, keeping the tape horizontal.",
            shoulder: "Measure from the edge of one shoulder to the other across your back.",
            sleeve: "Measure from the shoulder point down to your wrist bone, arm slightly bent.",
            length: "Measure from the top of your shoulder down to the desired length (e.g., ankle).",
        };
        return instructions[field] || "No instruction available.";
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Body Measurements</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                {hasSavedMeasurements && !isEditing && (
                    <div className="mb-4 p-3 rounded bg-green-50 text-green-700 border border-green-200">
                        Measurements are saved.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {measurementFields.map((field) => (
                        <div key={field} className="relative">
                            <div className="flex items-center gap-2">
                                <label className="block text-sm font-medium capitalize mb-1">{field}</label>
                                <FiInfo
                                    className="text-gray-400 hover:text-primary cursor-help"
                                    onMouseEnter={(e) => showTooltip(field, e)}
                                    onMouseLeave={hideTooltip}
                                />
                            </div>
                            <input
                                type="number"
                                name={field}
                                value={measurements[field] || ""}
                                onChange={handleChange}
                                disabled={!isEditing || saving}
                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary ${!isEditing ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""}`}
                                placeholder={`Enter ${field} (cm)`}
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    {isEditing ? (
                        <button
                            onClick={saveMeasurements}
                            disabled={saving}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
                        >
                            {saving ? "Saving..." : hasSavedMeasurements ? "Update Measurements" : "Save Measurements"}
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Edit Measurements
                        </button>
                    )}
                </div>
            </div>

            {/* Tooltip Popup */}
            {tooltip.visible && (
                <div
                    className="fixed z-50 bg-gray-800 text-white text-sm rounded-lg p-3 max-w-xs shadow-lg"
                    style={{ top: tooltip.y, left: tooltip.x }}
                >
                    {getInstruction(tooltip.field)}
                </div>
            )}
        </div>
    );
};

export default Measurements;