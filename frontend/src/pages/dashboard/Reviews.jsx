import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiStar } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const API = "http://localhost:3000/api";

const Reviews = () => {
    const { user } = useAuth();
    const token = localStorage.getItem("authToken");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!token || !user) return;
            if (user.role !== "tailor" && user.role !== "designer") {
                setLoading(false);
                return;
            }
            try {
                const { data } = await axios.get(`${API}/reviews/tailor`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(data.reviews || []);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token, user]);

    if (!user) return null;

    if (user.role !== "tailor" && user.role !== "designer") {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Reviews</h1>
                <p className="text-gray-600">This page is available for tailors and designers.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Reviews</h1>
            {reviews.length === 0 ? (
                <p className="text-gray-500">No data found.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <p className="font-semibold">{review.userId?.name || "Customer"}</p>
                                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={i < review.rating ? "fill-current" : ""}
                                                size={18}
                                            />
                                        ))}
                                        <span className="text-gray-600 text-sm ml-2">{review.rating}/5</span>
                                    </div>
                                    {review.comment ? (
                                        <p className="text-gray-700 mt-2">{review.comment}</p>
                                    ) : null}
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {review.createdAt
                                        ? new Date(review.createdAt).toLocaleDateString()
                                        : ""}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;
