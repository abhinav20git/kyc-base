import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Edit } from "lucide-react";

export default function ProfilePage() {
  const [user] = useState({
    name: "Akshat Giri",
    email: "akshat@example.com",
    mobile: "+91 9876543210",
    status: "Verified",
    profileImage: null, // if null show default icon
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
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
          <button className="mt-3 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
            Change Photo
          </button>
        </div>

        {/* User Info in Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-center">
          <div className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-700">Name</h3>
            <p className="text-gray-600 break-words">{user.name}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-700">Email</h3>
            <p className="text-gray-600 break-words">{user.email}</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-gray-700">Mobile</h3>
            <p className="text-gray-600 break-words">{user.mobile}</p>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8">
          <h3 className="font-semibold text-gray-700 mb-2">KYC Status</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                user.status === "Verified"
                  ? "bg-green-500 w-full"
                  : user.status === "Under Review"
                  ? "bg-yellow-500 w-2/3"
                  : "bg-gray-400 w-1/3"
              }`}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{user.status}</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 sm:mt-8">
          {/* Personal Info */}
          <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold">Personal Information</h3>
              <button className="text-white hover:text-gray-200">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">Email:</span>
                <span className="break-words">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Mobile:</span>
                <span className="break-words">{user.mobile}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200 hover:shadow-2xl transition bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
              <h3 className="text-white font-semibold">Uploaded Documents</h3>
            </div>
            <div className="p-4 sm:p-6 space-y-3 text-sm text-gray-700">
              <div className="flex justify-between items-center border-b pb-2">
                <span>Aadhaar Card</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Verified
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>PAN Card</span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Profile Action */}
        <div className="p-4 sm:p-6 md:p-8 border-t border-gray-200 flex justify-center">
          <button className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg transition">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
