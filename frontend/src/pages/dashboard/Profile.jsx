import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const API = "http://localhost:3000/api";

const Profile = () => {
    const { user, setUserData } = useAuth();
    const token = localStorage.getItem("authToken");
    const [editing, setEditing] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(() => user?.role === "tailor");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        avatar: "",
        businessName: "",
        specialization: "",
        experience: "",
        serviceAreas: "",
        bio: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        instagram: "",
        facebook: "",
        whatsapp: "",
        website: "",
        services: [],
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || "",
                phone: user.phone || "",
                avatar: user.avatar || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        const loadTailorProfile = async () => {
            if (!token || !user || user.role !== "tailor") {
                setLoadingProfile(false);
                return;
            }
            setLoadingProfile(true);
            try {
                const { data } = await axios.get(`${API}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const u = data.user;
                const tp = u.tailorProfile || {};
                const addr = Array.isArray(tp.address) && tp.address.length > 0 ? tp.address[0] : {};
                const sl = tp.socialLinks || {};
                setFormData((prev) => ({
                    ...prev,
                    name: u.name || "",
                    phone: u.phone || "",
                    avatar: u.avatar || "",
                    businessName: tp.businessName || "",
                    specialization: Array.isArray(tp.specialization)
                        ? tp.specialization.join(", ")
                        : tp.specialization || "",
                    experience: tp.experience != null ? String(tp.experience) : "",
                    serviceAreas: Array.isArray(tp.serviceAreas) ? tp.serviceAreas.join(", ") : "",
                    bio: tp.bio || "",
                    street: addr.street || "",
                    city: addr.city || "",
                    state: addr.state || "",
                    pincode: addr.pincode != null ? String(addr.pincode) : "",
                    instagram: sl.instagram || "",
                    facebook: sl.facebook || "",
                    whatsapp: sl.whatsapp || "",
                    website: sl.website || "",
                    services:
                        Array.isArray(tp.services) && tp.services.length > 0
                            ? tp.services.map((s) => ({
                                  name: s.name || "",
                                  price: s.price != null ? String(s.price) : "",
                              }))
                            : [],
                }));
            } catch {
                toast.error("Failed to load profile details");
            } finally {
                setLoadingProfile(false);
            }
        };
        loadTailorProfile();
    }, [token, user?.role]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleServiceChange = (index, field, value) => {
        setFormData((prev) => {
            const next = [...(prev.services || [])];
            next[index] = { ...next[index], [field]: value };
            return { ...prev, services: next };
        });
    };

    const addServiceRow = () => {
        setFormData((prev) => ({
            ...prev,
            services: [...(prev.services || []), { name: "", price: "" }],
        }));
    };

    const removeServiceRow = (index) => {
        setFormData((prev) => ({
            ...prev,
            services: (prev.services || []).filter((_, i) => i !== index),
        }));
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
            const authToken = localStorage.getItem("authToken");
            const baseBody = {
                name: formData.name,
                phone: formData.phone,
                avatar: formData.avatar,
            };

            if (user.role === "tailor") {
                const serviceAreas = formData.serviceAreas
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                const specialization = formData.specialization
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                const pinNum =
                    formData.pincode === "" ? 0 : Number(formData.pincode);
                const services = (formData.services || [])
                    .filter((s) => s.name && String(s.name).trim())
                    .map((s) => ({
                        name: String(s.name).trim(),
                        price: s.price === "" ? 0 : Number(s.price),
                    }));

                baseBody.tailorProfile = {
                    businessName: formData.businessName,
                    specialization,
                    experience:
                        formData.experience === ""
                            ? undefined
                            : Number(formData.experience),
                    serviceAreas,
                    bio: formData.bio,
                    address: [
                        {
                            street: formData.street,
                            city: formData.city,
                            state: formData.state,
                            pincode: Number.isNaN(pinNum) ? 0 : pinNum,
                            isdefault: true,
                        },
                    ],
                    socialLinks: {
                        instagram: formData.instagram,
                        facebook: formData.facebook,
                        whatsapp: formData.whatsapp,
                        website: formData.website,
                    },
                    services,
                };
            }

            const { data } = await axios.put(`${API}/users/profile`, baseBody, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData({ ...user, ...data.user, token: authToken });
            toast.success("Profile updated");
            setEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (!user) return null;

    const isTailor = user.role === "tailor";

    if (isTailor && loadingProfile) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Avatar */}
                    <div className="flex flex-col items-center gap-2">
                        <img
                            src={
                                formData.avatar ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
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

                                {isTailor && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Business name
                                            </label>
                                            <input
                                                type="text"
                                                name="businessName"
                                                value={formData.businessName}
                                                onChange={handleChange}
                                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Specialization (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                name="specialization"
                                                value={formData.specialization}
                                                onChange={handleChange}
                                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                placeholder="e.g. Formal wear, Alterations"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Experience (years)
                                            </label>
                                            <input
                                                type="number"
                                                name="experience"
                                                min="0"
                                                value={formData.experience}
                                                onChange={handleChange}
                                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Service areas (comma-separated)
                                            </label>
                                            <input
                                                type="text"
                                                name="serviceAreas"
                                                value={formData.serviceAreas}
                                                onChange={handleChange}
                                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                placeholder="City A, City B"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Street
                                                </label>
                                                <input
                                                    type="text"
                                                    name="street"
                                                    value={formData.street}
                                                    onChange={handleChange}
                                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Pincode
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold mb-2">Social links</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    name="instagram"
                                                    placeholder="Instagram"
                                                    value={formData.instagram}
                                                    onChange={handleChange}
                                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    name="facebook"
                                                    placeholder="Facebook"
                                                    value={formData.facebook}
                                                    onChange={handleChange}
                                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                                />
                                                <input
                                                    type="text"
                                                    name="whatsapp"
                                                    placeholder="WhatsApp"
                                                    value={formData.whatsapp}
                                                    onChange={handleChange}
                                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                                />
                                                <input
                                                    type="url"
                                                    name="website"
                                                    placeholder="Website"
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-sm font-semibold">Services &amp; pricing</h3>
                                                <button
                                                    type="button"
                                                    onClick={addServiceRow}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    Add service
                                                </button>
                                            </div>
                                            {(formData.services || []).length === 0 ? (
                                                <p className="text-gray-500 text-sm">No services yet.</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {(formData.services || []).map((row, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex flex-wrap gap-2 items-center"
                                                        >
                                                            <input
                                                                type="text"
                                                                placeholder="Service name"
                                                                value={row.name}
                                                                onChange={(e) =>
                                                                    handleServiceChange(
                                                                        idx,
                                                                        "name",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="flex-1 min-w-[140px] border rounded-lg px-3 py-2 text-sm"
                                                            />
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                placeholder="Price"
                                                                value={row.price}
                                                                onChange={(e) =>
                                                                    handleServiceChange(
                                                                        idx,
                                                                        "price",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-28 border rounded-lg px-3 py-2 text-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeServiceRow(idx)}
                                                                className="text-red-600 text-sm hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

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
                                {isTailor && (
                                    <div className="mt-3 space-y-1 text-gray-700 text-sm">
                                        {formData.businessName ? (
                                            <p>
                                                <span className="font-medium">Business: </span>
                                                {formData.businessName}
                                            </p>
                                        ) : null}
                                        {formData.specialization ? (
                                            <p>
                                                <span className="font-medium">Specialization: </span>
                                                {formData.specialization}
                                            </p>
                                        ) : null}
                                        {formData.bio ? <p className="text-gray-600">{formData.bio}</p> : null}
                                    </div>
                                )}
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
