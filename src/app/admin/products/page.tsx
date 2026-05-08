"use client";

import { motion } from "framer-motion";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Image as ImageIcon, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import ActionMenu from "@/src/components/ActionMenu";
import ConfirmModal from "@/src/components/ConfirmModal";
import Pagination from "@/src/components/Pagination";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getProducts } from "@/src/store/slices/ProductSlice";
import { deleteProduct } from "@/src/services/ProductSevices";


export default function ProductsPage() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { products, pagination, loading } = useAppSelector(
    (state) => state.products
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
 
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(getProducts({ page, limit: 10, search }));
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch, page, search]);

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProductId) return;
    try {
      await deleteProduct(selectedProductId);
      dispatch(getProducts({ page, limit: 10, search }));
      toast.success("Product deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete product", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleteModalOpen(false);
      setSelectedProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Products</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage your products.</p>
        </div>
        <Link href="/admin/products/create">
          <button className="cursor-pointer bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7]/90 text-zinc-50 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
            <Plus size={18} />
            Add Product
          </button>
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search products..."
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
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {products.map((product, i) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={product._id}
                onClick={() => router.push(`/admin/products/${product.slug}`)}
                className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]}
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <ImageIcon size={16} className="text-zinc-500" />
                      )}
                    </div>
                    <div className="font-medium text-zinc-950 dark:text-white">{product.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate" title={product.description}>
                  {product.description}
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{product.category}</td>
                {/* <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                    {product.status}
                  </span>
                </td> */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <ActionMenu
                      actions={[
                        {
                          label: "View Details",
                          icon: <Eye size={16} />,
                          onClick: () => router.push(`/admin/products/${product.slug}`),
                        },
                        {
                          label: "Edit",
                          icon: <Edit size={16} />,
                          onClick: () => router.push(`/admin/products/edit/${product._id}`),
                        },
                        {
                          label: "Delete",
                          icon: <Trash2 size={16} />,
                          onClick: () => handleDeleteClick(product._id),
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
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone and will remove all associated data."
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
