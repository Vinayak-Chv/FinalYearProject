import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API = "http://localhost:3000/api";

const Consultations = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("authToken");
    const [tab, setTab] = useState("pending");
    const [pending, setPending] = useState([]);
    const [past, setPast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState(null);

    const userId = user?._id;

    const loadPending = useCallback(async () => {
        const { data } = await axios.get(`${API}/consultations/pending`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setPending(data.requests || []);
    }, [token]);

    const loadPast = useCallback(async () => {
        const { data } = await axios.get(`${API}/consultations/my`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const list = data.consultations || [];
        const uid = userId?.toString?.();
        const filtered = list.filter((c) => {
            const prof = c.professionalId?._id || c.professionalId;
            const pid = prof?.toString?.() ?? String(prof);
            return pid === uid && c.status !== "pending";
        });
        setPast(filtered);
    }, [token, userId]);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([loadPending(), loadPast()]);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load consultations");
        } finally {
            setLoading(false);
        }
    }, [loadPending, loadPast]);

    useEffect(() => {
        if (!token || !userId) return;
        refresh();
    }, [token, userId, refresh]);

    const respond = async (id, action) => {
        setActingId(id);
        try {
            await axios.put(
                `${API}/consultations/${id}/respond`,
                { action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(action === "accept" ? "Consultation accepted" : "Consultation rejected");
            await refresh();
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        } finally {
            setActingId(null);
        }
    };

    if (!user) return null;
    if (user.role !== "tailor" && user.role !== "designer") {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Consultations</h1>
                <p className="text-gray-600">This page is available for tailors and designers.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    const tabClass = (active) =>
        `px-4 py-2 rounded-lg text-sm font-medium transition ${
            active ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Consultations</h1>

            <div className="flex gap-2">
                <button type="button" className={tabClass(tab === "pending")} onClick={() => setTab("pending")}>
                    Pending
                </button>
                <button type="button" className={tabClass(tab === "past")} onClick={() => setTab("past")}>
                    Past
                </button>
            </div>

            {tab === "pending" && (
                <div className="space-y-4">
                    {pending.length === 0 ? (
                        <p className="text-gray-500">No data found.</p>
                    ) : (
                        pending.map((c) => (
                            <div key={c._id} className="bg-white rounded-lg shadow-md p-4">
                                <p className="font-semibold">
                                    {c.customerId?.name || "Customer"}{" "}
                                    <span className="text-sm font-normal text-gray-600">
                                        — requested {new Date(c.createdAt).toLocaleString()}
                                    </span>
                                </p>
                                {c.notes ? <p className="text-gray-700 mt-2 text-sm">{c.notes}</p> : null}
                                <div className="mt-4 flex gap-2">
                                    <button
                                        type="button"
                                        disabled={actingId === c._id}
                                        onClick={() => respond(c._id, "accept")}
                                        className="bg-primary text-white px-3 py-1.5 rounded text-sm hover:bg-primary-dark disabled:opacity-50"
                                    >
                                        {actingId === c._id ? "..." : "Accept"}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={actingId === c._id}
                                        onClick={() => respond(c._id, "reject")}
                                        className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {tab === "past" && (
                <div className="space-y-4">
                    {past.length === 0 ? (
                        <p className="text-gray-500">No data found.</p>
                    ) : (
                        past.map((c) => (
                            <div key={c._id} className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className="font-semibold">{c.customerId?.name || "Customer"}</p>
                                        <p className="text-sm text-gray-600 capitalize">Status: {c.status}</p>
                                        {c.notes ? (
                                            <p className="text-gray-700 mt-2 text-sm">{c.notes}</p>
                                        ) : null}
                                    </div>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(c.updatedAt || c.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Consultations;
