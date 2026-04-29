"use client";

import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Power, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Pagination from "@/src/components/Pagination";

const mockJobs = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "Remote", type: "Full-time", isActive: true },
  { id: 2, title: "Product Designer", department: "Design", location: "New York, NY", type: "Full-time", isActive: true },
  { id: 3, title: "Marketing Manager", department: "Marketing", location: "London, UK", type: "Contract", isActive: false },
];

export default function CareersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Careers</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage open job postings and recruitment pipelines.</p>
        </div>
        <Link href="/admin/careers/create">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-zinc-50 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
            <Plus size={18} />
            Create Job
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockJobs.map((job, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.1 }}
            key={job.id}
            onClick={() => router.push(`/admin/careers/${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 group hover:border-zinc-300 dark:border-zinc-700 transition-all flex flex-col h-full cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                <Briefcase size={20} className="text-zinc-600 dark:text-zinc-400" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-zinc-200 dark:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700'
                }`}>
                {job.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex-1 mt-2">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-1 group-hover:text-indigo-400 transition-colors">{job.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{job.department} · {job.location}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-200 dark:border-zinc-800/50 mt-4">
              <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md">{job.type}</span>
              <div className="flex gap-1">
                <button onClick={(e) => e.stopPropagation()} title={job.isActive ? "Deactivate" : "Activate"} className={`p-2 rounded-lg transition-colors ${job.isActive ? 'text-zinc-600 dark:text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10' : 'text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10'}`}>
                  <Power size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/careers/${job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`); }} title="Edit" className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => e.stopPropagation()} title="Delete" className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden mt-6">
        <Pagination
          currentPage={page}
          totalPages={1}
          hasNextPage={false}
          hasPrevPage={false}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
