"use client";

import { motion } from "framer-motion";
import { Plus, Edit, Trash2, MessageSquare, Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import Pagination from "@/src/components/Pagination";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getTestimonials, removeTestimonial } from "@/src/store/slices/TestimonialSlice";
import ConfirmModal from "@/src/components/ConfirmModal";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function TestimonialsPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { testimonials, loading, pagination } = useAppSelector(
    (state) => state.testimonials
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const delay = setTimeout(() => {
      dispatch(getTestimonials({ page, limit: 10, search }));
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch, page, search]);

  const handleDeleteClick = (id: string) => {
    setSelectedTestimonialId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTestimonialId) return;
    try {
      await dispatch(removeTestimonial(selectedTestimonialId)).unwrap();
      dispatch(getTestimonials({ page, limit: 10, search }));
      toast.success("Testimonial deleted successfully!");
    } catch (error: unknown) {
      console.error("Failed to delete testimonial", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to delete testimonial");
      } else {
        toast.error("Failed to delete testimonial. An unexpected error occurred.");
      }
    } finally {
      setDeleteModalOpen(false);
      setSelectedTestimonialId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Testimonials</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage customer reviews and testimonials.</p>
        </div>
        <Link href="/admin/testimonials/create">
          <button className="cursor-pointer bg-[#3ABDE7] hover:bg-[#3ABDE7] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
            <Plus size={18} />
            Add Testimonial
          </button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search testimonials..."
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
        {testimonials.map((testimonial, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.1 }}
            key={testimonial._id}
            onClick={() => router.push(`/admin/testimonials/${testimonial._id}`)}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 group hover:border-zinc-300 dark:border-zinc-700 transition-all flex flex-col h-full cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                <MessageSquare size={20} className="text-zinc-600 dark:text-zinc-400" />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 ${index < testimonial.rating ? 'text-yellow-400' : 'text-zinc-300 dark:text-zinc-700'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="flex-1 mt-2">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white mb-1 group-hover:text-[#3ABDE7]/80 transition-colors">{testimonial.name}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{testimonial.designation}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3 italic">"{testimonial.description}"</p>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-4">
              <div className="flex gap-1">
                <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/testimonials/${testimonial._id}`);}} title="View Details" className="p-2 cursor-pointer rounded-lg transition-colors text-zinc-600 dark:text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10">
                  <Eye size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); router.push(`/admin/testimonials/edit/${testimonial._id}`);} } title="Edit" className="cursor-pointer p-2 text-zinc-600 dark:text-zinc-400 hover:text-[#3ABDE7]/80 hover:bg-[#3ABDE7]/10 rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(testimonial._id); } } title="Delete" className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer rounded-lg transition-colors">
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
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
