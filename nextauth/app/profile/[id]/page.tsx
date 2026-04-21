
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      toast.success(response.data.message);
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      setData(res.data.data.username);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e5e7eb] flex items-center justify-center px-6">

      <div className="w-full max-w-md border border-white/10 rounded-xl p-8 bg-[#111217]">

        {/* Title */}
        <h1 className="text-xl font-semibold mb-2 text-center">
          Your Profile
        </h1>

        <p className="text-center text-sm text-white/40 mb-6">
          Account details
        </p>

        {/* User Info */}
        <div className="flex justify-center mb-8">
          {loading ? (
            <p className="text-sm text-white/40">Loading...</p>
          ) : data ? (
            <Link
              href={`/profile/${data}`}
              className="text-lg font-medium hover:underline"
            >
              @{data}
            </Link>
          ) : (
            <p className="text-sm text-white/40">User not found</p>
          )}
        </div>

        {/* Actions */}
        <button
          onClick={logout}
          className="w-full border border-white/20 py-2 rounded-md text-sm hover:border-white/40 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

