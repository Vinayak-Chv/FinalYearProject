import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [changing, setChanging] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitChangePassword = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmNewPassword } = passwordForm;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChanging(true);
    try {
      await axios.put(
        "http://localhost:3000/api/users/change-password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChanging(false);
    }
  };

  const handleDeleteAccount = async () => {
    const first = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (!first) return;

    const second = window.confirm("Confirm again to permanently delete your account.");
    if (!second) return;

    setDeleting(true);
    try {
      await axios.delete("http://localhost:3000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Account deleted successfully");
      logout();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <form onSubmit={submitChangePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium mb-1">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="Enter old password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={changing}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
          >
            {changing ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {user?.role !== "tailor" && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
          <h2 className="text-xl font-semibold mb-2 text-red-700">Delete Account</h2>
          <p className="text-gray-600 mb-4">
            This action is irreversible. Your account will be permanently deleted.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;

