import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FiPackage } from "react-icons/fi";

const Orders = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("authToken");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/api/orders", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(data.orders);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "text-yellow-600";
            case "confirmed": return "text-blue-600";
            case "shipped": return "text-purple-600";
            case "delivered": return "text-green-600";
            case "cancelled": return "text-red-600";
            default: return "text-gray-600";
        }
    };

    if (loading) return <div className="text-center py-8">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-500">No orders yet.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Order #{order._id.slice(-6)}</span>
                                <span className={`font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                                Placed: {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span>{item.title} x {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 pt-2 border-t">
                                <span className="font-bold">Total</span>
                                <span className="font-bold">₹{order.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;