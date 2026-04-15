import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";

const API = "http://localhost:3000/api";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const Orders = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("authToken");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const isTailor = user?.role === "tailor";

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const url = isTailor ? `${API}/orders/tailor` : `${API}/orders`;
                const { data } = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(data.orders || []);
            } catch (error) {
                console.error("Failed to fetch orders", error);
                toast.error(error.response?.data?.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        if (token && user) {
            fetchOrders();
        }
    }, [token, user, isTailor]);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "text-yellow-600";
            case "confirmed":
                return "text-blue-600";
            case "shipped":
                return "text-purple-600";
            case "delivered":
                return "text-green-600";
            case "cancelled":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    const updateStatus = async (orderId, status) => {
        setUpdatingId(orderId);
        try {
            const { data } = await axios.put(
                `${API}/orders/${orderId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders((prev) =>
                prev.map((o) => (o._id === orderId ? data.order || { ...o, status } : o))
            );
            toast.success("Order status updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    const heading = isTailor ? "Orders" : "My Orders";

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">{heading}</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500">No data found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                <span className="font-semibold flex items-center gap-2">
                                    <FiPackage className="inline" />
                                    Order #{order._id.slice(-6)}
                                </span>
                                {!isTailor && (
                                    <span
                                        className={`font-semibold ${getStatusColor(order.status)}`}
                                    >
                                        {order.status.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            {isTailor && order.userId && (
                                <p className="text-sm text-gray-700 mb-2">
                                    Customer:{" "}
                                    <span className="font-medium">
                                        {typeof order.userId === "object"
                                            ? order.userId.name
                                            : "—"}
                                    </span>
                                    {typeof order.userId === "object" && order.userId.email ? (
                                        <span className="text-gray-600">
                                            {" "}
                                            ({order.userId.email})
                                        </span>
                                    ) : null}
                                </p>
                            )}
                            <div className="text-sm text-gray-600 mb-2">
                                Placed: {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span>
                                            {item.title} x {item.quantity}
                                        </span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 pt-2 border-t">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">₹{order.total}</span>
                            </div>
                            {isTailor && (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Status:
                                    </label>
                                    <select
                                        value={order.status}
                                        disabled={updatingId === order._id}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                        className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary"
                                    >
                                        {STATUS_OPTIONS.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    {updatingId === order._id ? (
                                        <span className="text-sm text-gray-500">Updating...</span>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
