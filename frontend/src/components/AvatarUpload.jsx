import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const AvatarUpload = ({ onUpload, currentAvatar }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentAvatar || "");

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        setUploading(true);
        try {
            const { data } = await axios.post("http://localhost:3000/api/upload/public-avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (data.success) {
                setPreview(data.url);
                onUpload(data.url);
                toast.success("Avatar uploaded");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
    });

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                {...getRootProps()}
                className="w-24 h-24 rounded-full border-2 border-dashed border-primary cursor-pointer overflow-hidden bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
            >
                <input {...getInputProps()} />
                {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <FaRegUserCircle className="text-5xl text-gray-400" />
                )}
            </div>
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            <p className="text-xs text-gray-400">Click or drag image (max 2MB)</p>
        </div>
    );
};

export default AvatarUpload;