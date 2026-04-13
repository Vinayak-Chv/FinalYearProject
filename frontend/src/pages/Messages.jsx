import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Messages = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("authToken");

    // Fetch all conversations
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/api/messages/conversations", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setConversations(data.conversations);
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, [token]);

    // Poll messages every 3 seconds when a conversation is selected
    useEffect(() => {
        if (!selectedConversation) return;
        const fetchMessages = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:3000/api/messages/${selectedConversation._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMessages(data.messages);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [selectedConversation, token]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post(
                "http://localhost:3000/api/messages/send",
                {
                    conversationId: selectedConversation._id,
                    receiverId: selectedConversation.participants.find(p => p._id !== user._id)._id,
                    text: newMessage,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    if (loading) return <div className="py-8 text-center">Loading conversations...</div>;

    return (
        <div className="flex h-[calc(100vh-120px)]">
            {/* Conversation List */}
            <div className="w-1/3 border-r overflow-y-auto">
                <h2 className="text-xl font-bold p-4 border-b">Messages</h2>
                {conversations.length === 0 && (
                    <p className="p-4 text-gray-500">No conversations yet.</p>
                )}
                {conversations.map((conv) => {
                    const otherUser = conv.participants.find(p => p._id !== user._id);
                    return (
                        <div
                            key={conv._id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedConversation?._id === conv._id ? "bg-gray-100" : ""
                                }`}
                        >
                            <p className="font-semibold">{otherUser?.name || "Unknown"}</p>
                            <p className="text-sm text-gray-500 truncate">{conv.lastMessage || "No messages yet"}</p>
                        </div>
                    );
                })}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b bg-gray-50">
                            <h3 className="font-semibold">
                                {selectedConversation.participants.find(p => p._id !== user._id)?.name}
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`flex ${msg.senderId === user._id ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === user._id
                                                ? "bg-primary text-white"
                                                : "bg-gray-200 text-gray-800"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t flex gap-2">
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
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;