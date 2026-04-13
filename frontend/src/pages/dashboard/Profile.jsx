import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, setUserData } = useAuth();
    const token = localStorage.getItem("authToken");
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        avatar: "",
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                avatar: user.avatar || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openCloudinaryWidget = () => {
        if (!window.cloudinary) {
            toast.error("Cloudinary widget not loaded");
            return;
        }

        setUploading(true);

        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
                multiple: false,
                sources: ["local", "url", "camera"],
            },
            (error, result) => {
                if (result && result.event === "success") {
                    const url = result.info.secure_url;
                    setFormData((prev) => ({ ...prev, avatar: url }));
                    toast.success("Avatar uploaded");
                } else if (error) {
                    toast.error("Upload failed");
                }

                if (
                    error ||
                    (result &&
                        ["success", "close", "queues-end"].includes(result.event))
                ) {
                    setUploading(false);
                }
            }
        );

        widget.open();
    };

    const saveProfile = async () => {
        try {
            const { data } = await axios.put(
                "http://localhost:3000/api/users/profile",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserData({ ...user, ...data.user, token });
            toast.success("Profile updated");
            setEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (!user) return null;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Avatar */}
                    <div className="flex flex-col items-center gap-2">
                        <img
                            src={formData.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                        {editing && (
                            <button
                                onClick={openCloudinaryWidget}
                                disabled={uploading}
                                className="text-primary hover:underline text-sm"
                            >
                                {uploading ? "Uploading..." : "Change Avatar"}
                            </button>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="flex-1">
                        {editing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full border rounded-lg px-3 py-2 bg-gray-100"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={saveProfile}
                                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p className="text-lg font-semibold">{user.name}</p>
                                <p className="text-gray-600">{user.email}</p>
                                <p className="text-gray-600">{user.phone}</p>
                                <p className="text-gray-500 capitalize mt-1">Role: {user.role}</p>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="mt-4 text-primary hover:underline"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;