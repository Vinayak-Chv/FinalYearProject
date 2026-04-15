import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const API = "http://localhost:3000/api";

const emptyItem = (type) => {
    if (type === "image") return { type: "image", url: "", title: "", description: "" };
    if (type === "video") return { type: "video", url: "", title: "", description: "" };
    return { type: "link", url: "", title: "", description: "" };
};

const Portfolio = () => {
    const { user, setUserData } = useAuth();
    const token = localStorage.getItem("authToken");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    const profileKey = user?.role === "designer" ? "designerProfile" : "tailorProfile";

    useEffect(() => {
        const load = async () => {
            if (!token) return;
            try {
                const { data } = await axios.get(`${API}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const portfolio = data.user?.[profileKey]?.portfolio;
                setItems(Array.isArray(portfolio) ? [...portfolio] : []);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load portfolio");
            } finally {
                setLoading(false);
            }
        };
        if (user?.role === "tailor" || user?.role === "designer") {
            load();
        } else {
            setLoading(false);
        }
    }, [token, user?.role, profileKey]);

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
                    setItems((prev) => [...prev, { ...emptyItem("image"), url }]);
                    toast.success("Image added — save to apply");
                } else if (error) {
                    toast.error("Upload failed");
                }
                if (
                    error ||
                    (result && ["success", "close", "queues-end"].includes(result.event))
                ) {
                    setUploading(false);
                }
            }
        );
        widget.open();
    };

    const addVideo = () => {
        const url = videoUrl.trim();
        if (!url) {
            toast.error("Enter a video URL");
            return;
        }
        setItems((prev) => [...prev, { ...emptyItem("video"), url }]);
        setVideoUrl("");
        toast.success("Video added — save to apply");
    };

    const addLink = () => {
        const url = linkUrl.trim();
        if (!url) {
            toast.error("Enter a link URL");
            return;
        }
        setItems((prev) => [...prev, { ...emptyItem("link"), url }]);
        setLinkUrl("");
        toast.success("Link added — save to apply");
    };

    const removeAt = (index) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const save = async () => {
        setSaving(true);
        try {
            const payload =
                user.role === "designer"
                    ? { designerProfile: { portfolio: items } }
                    : { tailorProfile: { portfolio: items } };
            const { data } = await axios.put(`${API}/users/profile`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const authToken = localStorage.getItem("authToken");
            setUserData({ ...user, ...data.user, token: authToken });
            toast.success("Portfolio saved");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    if (user.role !== "tailor" && user.role !== "designer") {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Portfolio</h1>
                <p className="text-gray-600">This page is available for tailors and designers.</p>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Portfolio</h1>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h2 className="text-lg font-semibold">Add items</h2>
                <div className="flex flex-wrap gap-4 items-end">
                    <button
                        type="button"
                        onClick={openCloudinaryWidget}
                        disabled={uploading}
                        className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-dark disabled:opacity-50"
                    >
                        {uploading ? "Uploading..." : "Add image (Cloudinary)"}
                    </button>
                    <div>
                        <label className="block text-sm font-medium mb-1">Video URL</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://..."
                                className="border rounded-lg px-3 py-2 min-w-[220px] focus:outline-none focus:border-primary"
                            />
                            <button
                                type="button"
                                onClick={addVideo}
                                className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300"
                            >
                                Add video
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Link URL</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://..."
                                className="border rounded-lg px-3 py-2 min-w-[220px] focus:outline-none focus:border-primary"
                            />
                            <button
                                type="button"
                                onClick={addLink}
                                className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300"
                            >
                                Add link
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Your portfolio</h2>
                {items.length === 0 ? (
                    <p className="text-gray-500">No data found.</p>
                ) : (
                    <ul className="space-y-4">
                        {items.map((item, idx) => (
                            <li
                                key={`${item.type}-${item.url}-${idx}`}
                                className="flex flex-col md:flex-row gap-4 border rounded-lg p-4"
                            >
                                {item.type === "image" && item.url ? (
                                    <img
                                        src={item.url}
                                        alt=""
                                        className="w-full md:w-32 h-32 object-cover rounded"
                                    />
                                ) : null}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs uppercase text-gray-500 font-medium">{item.type}</p>
                                    {item.url ? (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary break-all text-sm hover:underline"
                                        >
                                            {item.url}
                                        </a>
                                    ) : (
                                        <p className="text-gray-500 text-sm">No URL</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeAt(idx)}
                                    className="text-red-600 text-sm self-start hover:underline"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    type="button"
                    onClick={save}
                    disabled={saving}
                    className="mt-6 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save portfolio"}
                </button>
            </div>
        </div>
    );
};

export default Portfolio;
