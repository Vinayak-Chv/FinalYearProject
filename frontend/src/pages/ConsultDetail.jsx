import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FiVideo, FiSend, FiStar } from "react-icons/fi";
import { JitsiMeeting } from "@jitsi/react-sdk";
import toast from "react-hot-toast";

const ConsultDetail = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const token = localStorage.getItem("authToken");

    const [professional, setProfessional] = useState(null);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scheduling, setScheduling] = useState(false);
    const [consultation, setConsultation] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const [pollConsultation, setPollConsultation] = useState(false);

    const chatContainerRef = useRef(null);
    const shouldAutoScrollRef = useRef(true);
    const prevMessagesCountRef = useRef(0);

    // Fetch professional details
    useEffect(() => {
        const fetchProfessional = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:3000/api/users/professional/${id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProfessional(data.professional);
            } catch (error) {
                console.error("Failed to fetch professional", error);
            }
        };
        fetchProfessional();
    }, [id, token]);

    // Fetch existing consultation (if any) between user and professional
    const fetchConsultation = async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:3000/api/consultations/my`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const existing = data.consultations.find(
                (c) => c.professionalId._id === id || c.professionalId === id
            );
            if (existing) {
                setConsultation(existing);
                if (existing.meetingLink && existing.status === "scheduled") {
                    // Optionally auto-show video if meeting link exists
                }
            }
        } catch (error) {
            console.error("Failed to fetch consultation", error);
        }
    };

    // Initial fetch of consultation
    useEffect(() => {
        if (user && id) {
            fetchConsultation();
        }
    }, [user, id]);

    // Poll consultation status if pending
    useEffect(() => {
        if (!pollConsultation) return;
        const interval = setInterval(() => {
            fetchConsultation();
        }, 5000);
        return () => clearInterval(interval);
    }, [pollConsultation]);

    // Start polling when consultation is pending
    useEffect(() => {
        if (consultation && consultation.status === "pending") {
            setPollConsultation(true);
        } else {
            setPollConsultation(false);
        }
    }, [consultation]);

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
        if (!conversation?._id) return;
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:3000/api/messages/${conversation._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const incomingMessages = data.messages || [];
                const previousCount = prevMessagesCountRef.current;
                const hadMessagesBefore = previousCount > 0;
                const hasNewMessages = incomingMessages.length > previousCount;
                setMessages(incomingMessages);
                if (!hadMessagesBefore) {
                    setTimeout(() => scrollToBottom("auto"), 0);
                } else if (hasNewMessages && shouldAutoScrollRef.current) {
                    setTimeout(() => scrollToBottom("smooth"), 0);
                }
                prevMessagesCountRef.current = incomingMessages.length;
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
                const { data } = await axios.get(
                    `http://localhost:3000/api/users/professional/${id}/reviews`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setReviews(data.reviews || []);
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            }
        };
        fetchReviews();
    }, [id, token]);

    const scrollToBottom = (behavior = "smooth") => {
        const container = chatContainerRef.current;
        if (!container) return;
        container.scrollTo({
            top: container.scrollHeight,
            behavior,
        });
    };

    const handleChatScroll = () => {
        const container = chatContainerRef.current;
        if (!container) return;
        const threshold = 80;
        const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
        shouldAutoScrollRef.current = isNearBottom;
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
            shouldAutoScrollRef.current = true;
            setTimeout(() => scrollToBottom("smooth"), 0);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const handleScheduleConsultation = async () => {
        if (!conversation?._id) return;
        setScheduling(true);
        try {
            const { data } = await axios.post(
                "http://localhost:3000/api/consultations",
                {
                    professionalId: id,
                    notes: "Consultation requested",
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setConsultation(data.consultation);
            toast.success("Consultation request sent. Waiting for professional to respond.");
        } catch (error) {
            console.error("Failed to schedule consultation", error);
            toast.error(error.response?.data?.message || "Could not schedule consultation.");
        } finally {
            setScheduling(false);
        }
    };

    if (loading || authLoading || !professional || !user) {
        return <div className="py-8 text-center">Loading...</div>;
    }

    const isConsultationAccepted = consultation?.status === "scheduled" && consultation?.meetingLink;

    return (
        <div className="py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* LEFT COLUMN – Professional Info, Reviews, Consultation */}
                <div className="lg:w-2/3 space-y-6">
                    {/* Professional Info */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center gap-4">
                            <img
                                src={
                                    professional.avatar ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt={professional.name}
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <div>
                                <h1 className="text-2xl font-bold">{professional.name}</h1>
                                <p className="text-gray-500 capitalize">{professional.role}</p>
                                {professional.role === "tailor" && (
                                    <>
                                        <p className="text-gray-600">
                                            Business: {professional.tailorProfile?.businessName || "N/A"}
                                        </p>
                                        <p className="text-gray-600">
                                            Experience: {professional.tailorProfile?.experience ?? "N/A"} years
                                        </p>
                                        <p className="text-gray-600">
                                            Specialization:{" "}
                                            {professional.tailorProfile?.specialization?.join(", ") || "N/A"}
                                        </p>
                                    </>
                                )}
                                {professional.role === "designer" && (
                                    <>
                                        <p className="text-gray-600">
                                            Brand: {professional.designerProfile?.brandName || "N/A"}
                                        </p>
                                        <p className="text-gray-600">
                                            Specialization:{" "}
                                            {professional.designerProfile?.specialization?.join(", ") || "N/A"}
                                        </p>
                                        {professional.designerProfile?.education && (
                                            <p className="text-gray-600">
                                                Education: {professional.designerProfile.education}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        {reviews.length === 0 ? (
                            <p className="text-gray-500">No reviews yet.</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="border-b pb-3 mb-3 last:border-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">
                                            {review.userId?.name || "Anonymous"}
                                        </span>
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar
                                                    key={i}
                                                    className={i < review.rating ? "fill-current" : ""}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mt-1">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Consultation Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {!consultation ? (
                            <button
                                onClick={handleScheduleConsultation}
                                disabled={scheduling}
                                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
                            >
                                <FiVideo />
                                {scheduling ? "Requesting..." : "Request Consultation"}
                            </button>
                        ) : consultation.status === "pending" ? (
                            <div className="text-yellow-600">
                                <p>⏳ Consultation request pending. Waiting for professional to respond.</p>
                            </div>
                        ) : consultation.status === "scheduled" && consultation.meetingLink ? (
                            <div>
                                <button
                                    onClick={() => setShowVideo(!showVideo)}
                                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                                >
                                    <FiVideo />
                                    {showVideo ? "Hide Video Call" : "Join Consultation"}
                                </button>
                                {showVideo && (
                                    <div className="mt-4 relative">
                                        <div className="h-96">
                                            <JitsiMeeting
                                                roomName={consultation.meetingLink}
                                                configOverwrite={{
                                                    startWithAudioMuted: true,
                                                    startWithVideoMuted: false,
                                                    disableInviteFunctions: true,
                                                }}
                                                userInfo={{
                                                    displayName: user.name,
                                                    email: user.email,
                                                }}
                                                getIFrameRef={(iframeRef) => {
                                                    iframeRef.style.height = "100%";
                                                    iframeRef.style.width = "100%";
                                                    iframeRef.classList.add("jitsi-iframe");
                                                }}
                                                onApiReady={(externalApi) => {
                                                    console.log("Jitsi API ready");
                                                    externalApi.on("videoConferenceJoined", () => {
                                                        console.log("Joined meeting");
                                                    });
                                                }}
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                const iframe = document.querySelector(".jitsi-iframe");
                                                if (iframe && iframe.requestFullscreen) {
                                                    iframe.requestFullscreen();
                                                } else if (iframe && iframe.webkitRequestFullscreen) {
                                                    iframe.webkitRequestFullscreen();
                                                }
                                            }}
                                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-75 z-10"
                                        >
                                            ⛶ Fullscreen
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : consultation.status === "cancelled" ? (
                            <p className="text-red-600">❌ Consultation request was declined.</p>
                        ) : null}
                    </div>
                </div>

                {/* RIGHT COLUMN – Chat */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20 h-[calc(100vh-120px)] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Chat</h2>
                        <div
                            ref={chatContainerRef}
                            onScroll={handleChatScroll}
                            className="flex-1 overflow-y-auto space-y-3 mb-4"
                        >
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
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") sendMessage();
                                }}
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
        </div>
    );
};

export default ConsultDetail;