"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { signup } from "@/src/store/slices/authSlice";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await dispatch(
      signup({ name, email, password, role: "admin" })
    );

    if (signup.fulfilled.match(res)) {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#f8f9fa] dark:bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/80 dark:bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-zinc-950 dark:text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            A
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Create an Account</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Join to get access to the Admin CMS</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && <div className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-900">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-700 dark:text-zinc-300 mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-12 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-500 text-zinc-950 dark:text-white rounded-xl py-3 font-medium transition-colors mt-6 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
