"use client";

import { motion } from "framer-motion";
import { Plus, Edit, Trash2, ShieldCheck, Eye, Search, HelpCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import Pagination from "@/src/components/Pagination";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getSections, removeSection } from "@/src/store/slices/SectionSlice";
import ConfirmModal from "@/src/components/ConfirmModal";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function SectionsPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { sections, loading, pagination } = useAppSelector(
    (state) => state.sections
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const delay = setTimeout(() => {
      dispatch(getSections({ page, limit: 10, search }));
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch, page, search]);

  const policies = sections.filter((s) => s.type !== "faq");

  const handleDeleteClick = (id: string) => {
    setSelectedSectionId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSectionId) return;
    try {
      await dispatch(removeSection(selectedSectionId)).unwrap();
      dispatch(getSections({ page, limit: 10, search }));
      toast.success("Section deleted successfully!");
    } catch (error: unknown) {
      console.error("Failed to delete section", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to delete section");
      } else {
        toast.error("Failed to delete section. An unexpected error occurred.");
      }
    } finally {
      setDeleteModalOpen(false);
      setSelectedSectionId(null);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'faq': return <HelpCircle size={20} className="text-zinc-600 dark:text-zinc-400" />;
      case 'privacy': return <ShieldCheck size={20} className="text-zinc-600 dark:text-zinc-400" />;
      default: return <FileText size={20} className="text-zinc-600 dark:text-zinc-400" />;
    }
  };

  const formatType = (type: string) => {
    switch (type) {
      case 'faq': return 'FAQ';
      case 'privacy': return 'Privacy Policy';
      default: return 'Terms & Conditions';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Policies</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage Terms and Privacy Policies.</p>
        </div>
        <Link href="/admin/policies/create">
          <button className="cursor-pointer bg-[#3ABDE7] hover:bg-[#3ABDE7] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
            <Plus size={18} />
            Create Policies
          </button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search sections..."
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
        {policies.map((section, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.1 }}
            key={section._id}
            onClick={() => router.push(`/admin/sections/${section._id}`)}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 group hover:border-zinc-300 dark:border-zinc-700 transition-all flex flex-col h-full cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                {getIconForType(section.type)}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-medium px-2 py-1 bg-indigo-50 dark:bg-[#3ABDE7]/10 text-indigo-600 dark:text-[#3ABDE7] rounded-md">
                  {formatType(section.type)}
                </span>
              </div>
            </div>

            <div className="flex-1 mt-2">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-1 group-hover:text-[#3ABDE7]/80 transition-colors">{section.title}</h3>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
              <span className="text-xs text-zinc-500">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${section.isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700'
                  }`}>
                  {section.isActive ? "Active" : "Draft"}
                </span>
              </span>
              <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/policies/${section._id}`); }} title="View Details" className="p-2 cursor-pointer rounded-lg transition-colors text-zinc-600 dark:text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10">
                  <Eye size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/policies/edit/${section._id}`); }} title="Edit" className="cursor-pointer p-2 text-zinc-600 dark:text-zinc-400 hover:text-[#3ABDE7]/80 hover:bg-[#3ABDE7]/10 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(section._id); }} title="Delete" className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer rounded-lg transition-colors">
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
        title="Delete Section"
        message="Are you sure you want to delete this section? This action cannot be undone."
      />

      {pagination && (
        <Pagination
          currentPage={page}
          totalPages={pagination.total_pages || 1}
          hasNextPage={!!pagination.next}
          hasPrevPage={!!pagination.previous}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  );
}
