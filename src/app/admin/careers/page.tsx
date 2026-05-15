"use client";

import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Briefcase, Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Pagination from "@/src/components/Pagination";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getCareers } from "@/src/store/slices/CareerSlice";
import { deleteJob } from "@/src/services/CareerService";
import ConfirmModal from "@/src/components/ConfirmModal";
import { toast } from "react-toastify";
import { useCareerSocket } from "@/src/hooks/useCareerSocket";




export default function CareersPage() {
  useCareerSocket();
  
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { jobs, loading, pagination } = useAppSelector(
    (state) => state.careers
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const delay = setTimeout(() => {
      dispatch(getCareers({ page, limit: 10, search }));
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch, page, search]);

  const handleDeleteClick = (id: string) => {
    setSelectedJobId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedJobId) return;
      try {
        await deleteJob(selectedJobId);
        dispatch(getCareers({ page, limit: 10, search }));
        toast.success("Job deleted successfully");
      } catch (error: any) {
        console.error("Failed to delete job", error);
        toast.error(error.response?.data?.message || "Failed to delete job");
      } finally {
      setDeleteModalOpen(false);
      setSelectedJobId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Careers</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage open job postings and recruitment pipelines.</p>
        </div>
        <Link href="/admin/careers/create">
          <button className="cursor-pointer bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-zinc-50 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
            <Plus size={18} />
            Create Job
          </button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search careers..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#3ABDE7]/80 text-zinc-950 dark:text-white transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.1 }}
            key={job._id}
            onClick={() => router.push(`/admin/careers/${job.slug}`)}
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
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-1 group-hover:text-[#3ABDE7]/80 transition-colors">{job.title}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{job.department} · {job.location}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-200 dark:border-zinc-800/50 mt-4">
              <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-md">{job.employmentType}</span>
              <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/careers/${job.slug}`);}} title="View Details" className={`p-2 cursor-pointer rounded-lg transition-colors ${job.isActive ? 'cursor-pointer text-zinc-600 cursor-pointer dark:text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10' : 'text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10'}`}>
                  <Eye size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/careers/edit/${job._id}`);} } title="Edit" className="cursor-pointer p-2 text-zinc-600 cursor-pointer dark:text-zinc-400 hover:text-[#3ABDE7]/80 hover:bg-[#3ABDE7]/10 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(job._id); } } title="Delete" className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Job"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
      />
      
      <Pagination
        currentPage={page}
        totalPages={pagination?.total_pages || 1}
        hasNextPage={!!pagination?.next}
        hasPrevPage={!!pagination?.previous}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
