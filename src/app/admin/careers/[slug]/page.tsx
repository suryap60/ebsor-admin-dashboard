"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getSingleJob } from "@/src/store/slices/CareerSlice";
import { useSingleJobSocket } from "@/src/hooks/useSingleJobSocket";

export default function ViewCareerPage() {
  const router = useRouter();
  const params = useParams();

  useSingleJobSocket(params.slug as string);
  
  const dispatch = useAppDispatch();

  const { singleJob, loading } = useAppSelector((state) => state.careers);

  useEffect(() => {
    if (params.slug) {
      dispatch(getSingleJob(params.slug as string));
    }
  }, [dispatch, params.slug]);

  if (loading || !singleJob) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/careers">
              <button className="w-10 h-10 mt-1 cursor-pointer rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                  <ArrowLeft size={18} />
              </button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">
              Job Details
            </h1>
            <p className="text-zinc-500 text-sm">
              Viewing details for {singleJob.title}
            </p>
          </div>
        </div>

        <Link href={`/admin/careers/edit/${singleJob._id}`}>
          <button className="bg-[#3ABDE7] hover:bg-[#3ABDE7] cursor-pointer text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20">
            <Edit size={18} />
            Edit Job
          </button>
        </Link>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 "
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-zinc-950 dark:text-white">
              {singleJob.title}
            </h2>
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="inline-block  px-3 py-1 bg-indigo-50 dark:bg-[#3ABDE7]/10 text-indigo-600 dark:text-[#3ABDE7] rounded-lg text-sm font-medium border border-indigo-100 dark:border-indigo-500/20 capitalize">
                {singleJob.department || "N/A"}
              </span>
              <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-800">
                {singleJob.location || "N/A"}
              </span>
              <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-800 capitalize">
                {singleJob.employmentType ? singleJob.employmentType.replace('-', ' ') : "N/A"}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                  singleJob.isActive
                    ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20"
                    : "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20"
                }`}
              >
                {singleJob.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Salary</h3>
            <p className="text-zinc-800 dark:text-zinc-200 text-lg">{singleJob.salary || "Not Specified"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Job Description & Requirements</h3>
            <div
              className="
                prose dark:prose-invert max-w-none
                prose-headings:text-zinc-900 dark:prose-headings:text-white
                prose-p:text-zinc-700 dark:prose-p:text-zinc-300
                prose-strong:text-zinc-900 dark:prose-strong:text-white
                prose-li:text-zinc-700 dark:prose-li:text-zinc-300
                prose-a:text-[#3ABDE7]
                prose-img:rounded-xl
                prose-img:w-full
                prose-img:max-w-full
                prose-pre:bg-zinc-900
                prose-code:text-pink-500
                overflow-hidden
                break-words
              "
              dangerouslySetInnerHTML={{ __html: singleJob.description }}
            />
          </div>

          {/* Footer Info */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Slug</h3>
              <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{singleJob.slug}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Job ID</h3>
              <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{singleJob._id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Created At</h3>
              <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">
                {singleJob.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
}
