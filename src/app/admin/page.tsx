"use client";

import { motion } from "framer-motion";
import { Users, FileText, ShoppingBag, Briefcase, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  { name: "Total Users", value: "2,543", icon: Users,  isPositive: true },
  { name: "Active Blogs", value: "142", icon: FileText, isPositive: true },
  { name: "Total Products", value: "85", icon: ShoppingBag, isPositive: false },
  { name: "Job Listings", value: "12", icon: Briefcase, isPositive: true },
];

export default function AdminDashboard() {
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
          <button className="text-sm cursor-pointer text-indigo-400 hover:text-indigo-300">View All</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-200 dark:border-zinc-800 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <UserIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">New user registration</p>
                  <p className="text-xs text-zinc-500">Alex joined the platform</p>
                </div>
              </div>
              <span className="text-xs text-zinc-500">2 hours ago</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function UserIcon() {
  return <Users size={18} />;
}
