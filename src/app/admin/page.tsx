"use client";

import { motion } from "framer-motion";
import { Users, FileText, ShoppingBag, Briefcase, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getProducts } from "@/src/store/slices/ProductSlice";
import { getBlogs } from "@/src/store/slices/BlogSlice";
import { getCareers } from "@/src/store/slices/CareerSlice";
import { getApplications } from "@/src/store/slices/ApplicationSlice";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { pagination: productPagination } = useAppSelector(state => state.products);
  const { pagination: blogPagination } = useAppSelector(state => state.blogs);
  const { pagination: careerPagination } = useAppSelector(state => state.careers);
  const { applications, pagination: appPagination } = useAppSelector(state => state.applications);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
    if (!token) return;

    hasFetched.current = true;

    const delay = setTimeout(() => {
      dispatch(getProducts({ page: 1, limit: 1, search: "" }));
      dispatch(getBlogs({ page: 1, limit: 1, search: "", status: "" }));
      dispatch(getCareers({ page: 1, limit: 1, search: "" }));
      dispatch(getApplications({ page: 1, limit: 5, search: "" }));
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch]);

  const stats = [
    { name: "Total Products", value: productPagination?.total || 0, icon: ShoppingBag, isPositive: false },
    { name: "Active Blogs", value: blogPagination?.total || 0, icon: FileText, isPositive: true },
    { name: "Total Applicants", value: appPagination?.total || 0, icon: Users, isPositive: true },
    { name: "Job Listings", value: careerPagination?.total || 0, icon: Briefcase, isPositive: true },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-300 dark:border-zinc-700 transition-colors"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={100} className="text-zinc-950 dark:text-white" />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  <Icon size={24} className="text-zinc-600 dark:text-zinc-400" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-zinc-600 dark:text-zinc-400 text-sm font-medium">{stat.name}</h3>
                <p className="text-3xl font-semibold text-zinc-950 dark:text-white">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-zinc-950 dark:text-white">Recent Activity</h2>
          <Link href="/admin/applications" className="text-sm cursor-pointer text-[#3ABDE7] hover:text-[#3ABDE7]/80">View All</Link>
        </div>

        <div className="space-y-4">
          {applications && applications.length > 0 ? (
            applications.slice(0, 5).map((app, i) => (
              <div key={app._id || i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-200 dark:border-zinc-800 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3ABDE7]/10 flex items-center justify-center text-[#3ABDE7]">
                    <UserIcon />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{app.firstName} {app.lastName}</p>
                    <p className="text-xs text-zinc-500">Applied for {app.job?.title || 'Job'}</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-500">{new Date(app.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-zinc-500">No recent activity.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function UserIcon() {
  return <Users size={18} />;
}
