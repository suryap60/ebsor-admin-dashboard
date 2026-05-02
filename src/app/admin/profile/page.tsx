"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Key, Save, Camera, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">My Profile</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage your account settings and preferences.</p>
        </div>
        <button className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-zinc-50 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
          <Save size={18} />
          Save Changes
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
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white">Admin User</h2>
            <p className="text-indigo-400 text-sm font-medium mb-4">Super Administrator</p>
            <div className="w-full h-px bg-zinc-200 dark:bg-zinc-200 dark:bg-zinc-800 my-4" />
            <div className="w-full text-left space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <Mail size={16} />
                admin@example.com
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
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue="Admin"
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue="User"
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="admin@example.com"
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-4">Security</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-12 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New password"
                      className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-12 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-12 py-2.5 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
