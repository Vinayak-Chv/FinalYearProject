import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiVideo, FiSend, FiStar } from "react-icons/fi";

const ConsultDetail = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const token = localStorage.getItem("authToken");
    const [professional, setProfessional] = useState(null);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [reviews, setReviews] = useState([]);
    const [showVideo, setShowVideo] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Fetch professional details
    useEffect(() => {
        const fetchProfessional = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/users/professional/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfessional(data.professional);
            } catch (error) {
                console.error("Failed to fetch professional", error);
            }
        };
        fetchProfessional();
    }, [id, token]);

    // Get or create conversation
    useEffect(() => {
        if (!professional) return;
        const initConversation = async () => {
            try {
                const { data } = await axios.post(
                    "http://localhost:3000/api/messages/conversation",
                    { otherUserId: id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setConversation(data.conversation);
            } catch (error) {
                console.error("Failed to get conversation", error);
            } finally {
                setLoading(false);
            }
        };
        initConversation();
    }, [professional, id, token]);

    // Poll messages
    useEffect(() => {
        if (!conversation) return;
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:3000/api/messages/${conversation._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMessages(data.messages);
                scrollToBottom();
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [conversation, token]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/users/professional/${id}/reviews`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReviews(data.reviews);
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            }
        };
        fetchReviews();
    }, [id, token]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !conversation?._id || !user?._id) return;
        try {
            await axios.post(
                "http://localhost:3000/api/messages/send",
                {
                    conversationId: conversation._id,
                    receiverId: id,
                    text: newMessage,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const roomName = user?._id ? [user._id, id].sort().join("-") : "";

    if (loading || authLoading || !professional || !user) {
        return <div className="py-8 text-center">Loading...</div>;
    }

    return (
        <div className="py-8 space-y-6">
            {/* Professional Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4">
                    <img
                        src={professional.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt={professional.name}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{professional.name}</h1>
                        <p className="text-gray-500 capitalize">{professional.role}</p>
                        {professional.role === "tailor" && (
                            <>
                                <p className="text-gray-600">Business: {professional.tailorProfile?.businessName}</p>
                                <p className="text-gray-600">Experience: {professional.tailorProfile?.experience} years</p>
                                <p className="text-gray-600">Specialization: {professional.tailorProfile?.specialization?.join(", ")}</p>
                            </>
                        )}
                        {professional.role === "designer" && (
                            <>
                                <p className="text-gray-600">Brand: {professional.designerProfile?.brandName}</p>
                                <p className="text-gray-600">Specialization: {professional.designerProfile?.specialization?.join(", ")}</p>
                                {professional.designerProfile?.education && <p className="text-gray-600">Education: {professional.designerProfile.education}</p>}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="border-b pb-3 mb-3 last:border-0">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">{review.userId?.name || "Anonymous"}</span>
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <FiStar key={i} className={i < review.rating ? "fill-current" : ""} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600 mt-1">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Video Call Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                    <FiVideo /> {showVideo ? "Hide Video Call" : "Schedule Consultation"}
                </button>
                {showVideo && (
                    <div className="mt-4 h-96">
                        <iframe
                            src={`https://meet.jit.si/${roomName}`}
                            allow="camera; microphone; fullscreen"
                            className="w-full h-full"
                            title="Jitsi Meeting"
                        />
                    </div>
                )}
            </div>

            {/* Chat Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Chat</h2>
                <div className="flex flex-col h-96">
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === user?._id
                                        ? "bg-primary text-white"
                                        : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                        >
                            <FiSend />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultDetail;