"use client";

import { motion } from "framer-motion";
import { Search, Download, Eye, Filter, Edit, Trash2 } from "lucide-react";
import ActionMenu from "@/src/components/ActionMenu";
import ConfirmModal from "@/src/components/ConfirmModal";
import Pagination from "@/src/components/Pagination";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mockApplications = [
  { id: 1, name: "David Chen", role: "Senior Frontend Developer", email: "david.c@example.com", appliedAt: "Oct 24, 2026", status: "New" },
  { id: 2, name: "Sarah Williams", role: "Product Designer", email: "sarah.w@example.com", appliedAt: "Oct 23, 2026", status: "Reviewed" },
  { id: 3, name: "Michael Chang", role: "Marketing Manager", email: "m.chang@example.com", appliedAt: "Oct 21, 2026", status: "Shortlisted" },
];

export default function ApplicationsPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const handleDeleteClick = (id: number) => {
    setSelectedAppId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Confirmed delete for application", selectedAppId);
    setDeleteModalOpen(false);
    setSelectedAppId(null);
  };

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
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:border-indigo-500 text-zinc-950 dark:text-white transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors">
              <Filter size={14} />
              Filter
            </button>
          </div>
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
              {mockApplications.map((app, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  key={app.id} 
                  onClick={() => router.push(`/admin/applications/${app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-950 dark:text-white">{app.name}</span>
                      <span className="text-xs text-zinc-500">{app.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{app.role}</td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{app.appliedAt}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      app.status === 'New' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      app.status === 'Reviewed' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end">
                      <ActionMenu
                        actions={[
                          { label: "View Details", icon: <Eye size={16} />, onClick: () => router.push(`/admin/applications/${app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`) },
                          { label: "Download Resume", icon: <Download size={16} />, onClick: () => console.log("Download", app.id) },
                          { label: "Edit Application", icon: <Edit size={16} />, onClick: () => router.push(`/admin/applications/${app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`) },
                          { label: "Delete", icon: <Trash2 size={16} />, onClick: () => handleDeleteClick(app.id), destructive: true },
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
          totalPages={1}
          hasNextPage={false}
          hasPrevPage={false}
          onPageChange={setPage}
        />
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Job Application"
        message="Are you sure you want to delete this job application? All applicant info and resume attachments will be erased."
      />
    </div>
  );
}
