"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import ActionMenu from "@/src/components/ActionMenu";
import ConfirmModal from "@/src/components/ConfirmModal";
import Pagination from "@/src/components/Pagination";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mockBlogs = [
  { id: 1, title: "The Future of AI in Workplace", author: "Jane Doe", status: "Published", date: "Oct 24, 2026" },
  { id: 2, title: "10 Tips for Better Productivity", author: "John Smith", status: "Draft", date: "Oct 22, 2026" },
  { id: 3, title: "Why Web Design Matters in 2026", author: "Alice Johnson", status: "Published", date: "Oct 20, 2026" },
];

export default function BlogsPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const handleDeleteClick = (id: number) => {
    setSelectedBlogId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Confirmed delete for blog", selectedBlogId);
    setDeleteModalOpen(false);
    setSelectedBlogId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Blogs</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage your blog posts, drafts, and categories.</p>
        </div>
        <Link href="/admin/blogs/create">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-zinc-50 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
            <Plus size={18} />
            Create Blog
          </button>
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:border-indigo-500 text-zinc-950 dark:text-white transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 outline-none">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {mockBlogs.map((blog, i) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={blog.id}
                onClick={() => router.push(`/admin/blogs/${blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
                className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-950 dark:text-white">{blog.title}</div>
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{blog.author}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${blog.status === 'Published'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{blog.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <ActionMenu
                      actions={[
                        { label: "View Blog", icon: <Eye size={16} />, onClick: () => router.push(`/admin/blogs/${blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`) },
                        { label: "Edit Blog", icon: <Edit size={16} />, onClick: () => router.push(`/admin/blogs/${blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`) },
                        { label: "Delete", icon: <Trash2 size={16} />, onClick: () => handleDeleteClick(blog.id), destructive: true },
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
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? It will be removed permanently."
      />
    </div>
  );
}
