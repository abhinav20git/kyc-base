import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Edit } from "lucide-react";
import axios from "axios";
import { API_BASE } from "@/utils/constants";
import { Toaster } from "react-hot-toast";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fileUploading, setFileUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/profile`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched user:", res.data);
        setUser(res.data.data);
        setFormData({
          name: res.data.data.name || "",
          email: res.data.data.email || "",
          phone: res.data.data.phone || "",
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setFileUploading(true);
      const res = await axios.post(
        `${API_BASE}/users/upload-profile-image`,
        formData,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser((prev: any) => ({
        ...prev,
        profileImage: res.data.data.profileImage,
      }));
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setFileUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`${API_BASE}/users/${user.id}`, formData, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profile updated successfully!");
      setUser(res.data.data); // Update UI with new user info
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <Toaster position="top-right" />
      <div className="bg-white shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-3xl">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-500"
            />
          ) : (
            <FaUserCircle className="text-gray-400 w-24 h-24 sm:w-32 sm:h-32" />
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={fileUploading}
            className="mt-3 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {fileUploading ? "Uploading..." : "Upload / Change Photo"}
          </button>

          {/* hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* User Info (editable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-center">
          {editing ? (
            <>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Name</h3>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-1 text-sm"
                />
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Email</h3>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-1 text-sm"
                />
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Mobile</h3>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded p-1 text-sm"
                />
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Name</h3>
                <p className="text-gray-600 break-words">{user.name}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Email</h3>
                <p className="text-gray-600 break-words">{user.email}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="font-semibold text-gray-700">Mobile</h3>
                <p className="text-gray-600 break-words">
                  {user.phone || "+91 9876543210"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* KYC Status */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-700 mb-2">KYC Status</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="h-3 rounded-full bg-green-500 w-full"></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {user.KYCSessions?.[0]?.session_status || "Not Verified"}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 sm:mt-8">
          {/* Personal Info */}
          <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold">Personal Information</h3>
              <button
                onClick={() => setEditing(!editing)}
                className="text-white hover:text-gray-200"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3 text-sm text-gray-700">
              {editing ? (
                <>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Name:</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border rounded p-1 text-sm"
                    />
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Email:</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border rounded p-1 text-sm"
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Mobile:</span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border rounded p-1 text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Name:</span>
                    <span>{user.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Mobile:</span>
                    <span>{user.phone || "+91 9876543210"}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Documents (Dynamic) */}
          <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
              <h3 className="text-white font-semibold">Uploaded Documents</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 text-sm text-gray-700">
              {user.KYCSessions && user.KYCSessions.length > 0 ? (
  user.KYCSessions
    .filter(
      (session: any) =>
        session.session_status === "verified" ||
        session.session_status === "pending"
    )
    .map((session: any, index: number) => (
      <div
        key={session.id || index}
        className="flex justify-between items-center border-b pb-2"
      >
        <span>{session.EPIC1?.predicted || "Unknown Document"}</span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            session.session_status === "verified"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {session.session_status}
        </span>
      </div>
    ))
) : (
  <p className="text-gray-500">No documents uploaded yet.</p>
)}
            </div>
          </div>
        </div>

        {/* Update Profile Action */}
        <div className="p-4 sm:p-6 md:p-8 border-t border-gray-200 flex justify-center gap-4">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-400 hover:bg-gray-500 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg transition"
            >
              Update Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
