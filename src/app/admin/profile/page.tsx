"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Key, Save, Camera, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "@/src/store/slices/ProfileSlice";

import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

import { toast } from "react-toastify";

export default function ProfilePage() {
  const dispatch = useAppDispatch();

  const { profile, loading } = useAppSelector(
    (state) => state.profile
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await dispatch(
        updateProfile({
          name,
          email,
        })
      ).unwrap();

      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err);
    }
  };

  const handleChangePassword = async () => {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.error("All password fields are required");
        return;
      }

      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }


    try {
      await dispatch(
        changePassword({
          currentPassword,
          newPassword,
        })
      ).unwrap();

      toast.success("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">My Profile</h1>
          {/* <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage your account settings and preferences.</p> */}
        </div>
        <button onClick={handleSaveProfile} disabled={loading} className="cursor-pointer bg-[#3ABDE7] hover:bg-[#3ABDE7] text-zinc-50 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
          <Save size={18} />
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 h-fit"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
                <User size={40} className="text-zinc-500 group-hover:opacity-0 transition-opacity" />
              </div>
              <div className="absolute inset-0 bg-zinc-50 dark:bg-[#f8f9fa] dark:bg-black/50 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={20} className="text-zinc-950 dark:text-white mb-1" />
                <span className="text-[10px] uppercase font-bold text-zinc-950 dark:text-white tracking-wider">Change</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">{profile?.name}</h2>
            <p className="text-[#3ABDE7] text-sm font-medium mb-4">Super Administrator</p>
            <div className="w-full h-px bg-zinc-200 dark:bg-zinc-200 dark:bg-zinc-800 my-4" />
            <div className="w-full text-left space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail size={16} />
                {profile?.email}
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Shield size={16} />
                Full Access
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2 space-y-6"
        >
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-4">
              Security
            </h3>

            <div className="space-y-4">

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-12 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-12 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(!showNewPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  >
                    {showNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-12 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="cursor-pointer bg-[#3ABDE7] hover:bg-[#35afd5] text-white px-5 py-2.5 rounded-xl font-medium transition-all"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
