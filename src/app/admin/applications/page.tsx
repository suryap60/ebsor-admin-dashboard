"use client";

import { motion } from "framer-motion";
import { Search, Download, Eye, Edit } from "lucide-react";
import ActionMenu from "@/src/components/ActionMenu";
import Pagination from "@/src/components/Pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getApplications } from "@/src/store/slices/ApplicationSlice";
import { useApplicationSocket } from "@/src/hooks/useApplicationSocket";



export default function ApplicationsPage() {
  useApplicationSocket();
  
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { applications, loading, pagination } = useAppSelector(
    (state) => state.applications
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(getApplications({ page, limit: 10, search }));
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch, page, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Job Applications</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Review candidate applications and download resumes.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={search}
              onChange={(e) => {
                setPage(1); // reset page
                setSearch(e.target.value);
              }}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:border-[#3ABDE7]/80 text-zinc-950 dark:text-white transition-colors"
            />
          </div>
          {/* <div className="flex items-center gap-2">
            <button className="bg-zinc-100 cursor-pointer dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors">
              <Filter size={14} />
              Filter
            </button>
          </div> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Applicant</th>
                <th className="px-6 py-4 font-medium">Applied Role</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
              {applications.map((app, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  key={app._id}
                  onClick={() => router.push(`/admin/applications/${app._id}`)}
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-950 dark:text-white">{app.firstName} {app.lastName}</span>
                      <span className="text-xs text-zinc-500">{app.email}</span>
                      <span className="text-xs text-zinc-500">{app.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{app.job?.title || "N/A"}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400"> {new Date(app.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "reviewed"
                          ? "bg-blue-100 text-blue-700"
                          : app.status === "selected"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <ActionMenu
                        actions={[
                          { label: "View Details", icon: <Eye size={16} />, onClick: () => router.push(`/admin/applications/${app._id}`) },
                          { label: "Download Resume", icon: <Download size={16} />, onClick: () => window.open(app.resume, "_blank") },
                          { label: "Edit Application", icon: <Edit size={16} />, onClick: () => router.push(`/admin/applications/edit/${app._id}`) },
                          // { label: "Delete", icon: <Trash2 size={16} />, onClick: () => handleDeleteClick(app._id), destructive: true },
                        ]}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={pagination?.total_pages || 1}
          hasNextPage={!!pagination?.next}
          hasPrevPage={!!pagination?.previous}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
