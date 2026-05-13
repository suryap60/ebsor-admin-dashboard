"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import ActionMenu from "@/src/components/ActionMenu";
import { toast } from "react-toastify";
import ConfirmModal from "@/src/components/ConfirmModal";
import Pagination from "@/src/components/Pagination";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getFaqCategories } from "@/src/store/slices/FaqCategorySlice";
import { deleteFaqCategory } from "@/src/services/FaqCategoryService";



export default function FaqcategoriesPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFaqCategoryId, setSelectedFaqCategoryId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  
    const { categories, pagination, loading } = useAppSelector(
      (state) => state.faqCategories
    );
  
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
  

    useEffect(() => {
      const delay = setTimeout(() => {
        dispatch(getFaqCategories({ page, limit: 10, search }));
      },500)

      return () => clearTimeout(delay);
    }, [dispatch, page, search]);
  
    const handleDeleteClick = (id: string) => {
      setSelectedFaqCategoryId(id);
      setDeleteModalOpen(true);
    };
  
    const confirmDelete = async () => {
      if (!selectedFaqCategoryId) return;
      try {
        await deleteFaqCategory(selectedFaqCategoryId);
        dispatch(getFaqCategories({ page, limit: 10, search }));
        toast.success("Faq Category deleted successfully");
      } catch (error: any) {
        console.error("Failed to delete category", error);
        toast.error(error.response?.data?.message || "Failed to delete category");
      } finally {
        setDeleteModalOpen(false);
        setSelectedFaqCategoryId(null);
      }
    };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Faq Categoried</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage your Faq categories.</p>
        </div>
        <Link href="/admin/faq-categories/create">
          <button className="bg-[#3ABDE7] hover:bg-[#3ABDE7] cursor-pointer text-zinc-50 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
            <Plus size={18} />
            Create Faq Category
          </button>
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search category..."
              value={search}
              onChange={(e) => {
                setPage(1); // reset page
                setSearch(e.target.value);
              }}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:border-[#3ABDE7]/80 text-zinc-950 dark:text-white transition-colors"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {categories.map((category, i) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={category._id}
                onClick={() => router.push(`/admin/faq-categories/edit/${category._id}`)}
                className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-950 dark:text-white">{category.name}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <ActionMenu
                      actions={[
                        // {
                        //   label: "View Details",
                        //   icon: <Eye size={16} />,
                        //   onClick: () => router.push(`/admin/faq-categories/${category._id}`),
                        // },
                        {
                          label: "Edit",
                          icon: <Edit size={16} />,
                          onClick: () => router.push(`/admin/faq-categories/edit/${category._id}`),
                        },
                        {
                          label: "Delete",
                          icon: <Trash2 size={16} />,
                          onClick: () => handleDeleteClick(category._id),
                          destructive: true,
                        },
                      ]}
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={page}
          totalPages={pagination?.total_pages || 1}
          hasNextPage={!!pagination?.next}
          hasPrevPage={!!pagination?.previous}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete category"
        message="Are you sure you want to delete this category post? It will be removed permanently."
      />
    </div>
  );
}
