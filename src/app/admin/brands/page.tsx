"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, ImageIcon } from "lucide-react";
import ActionMenu from "@/src/components/ActionMenu";
import { toast } from "react-toastify";
import ConfirmModal from "@/src/components/ConfirmModal";
import Pagination from "@/src/components/Pagination";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getBrands } from "@/src/store/slices/BrandSlice";
import { deleteBrand } from "@/src/services/BrandService";
import { useBrandSocket } from "@/src/hooks/useBrandSocket";



export default function BrandsPage() {
  useBrandSocket();
  
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
//   const [selectedBrandName, setSelectedBrandName] = useState("");
  const dispatch = useAppDispatch();
  
    const { brands, pagination, loading, singleBrand } = useAppSelector(
      (state) => state.brands
    );
  
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
  
    const hasFetched = useRef(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            dispatch(getBrands({ page, limit: 10, search }));
        },500)
      
        return () => clearTimeout(delay);
    }, [dispatch, page, search]);
  
    const handleDeleteClick = (id: string, name: string) => {
      setSelectedBrandId(id);
    //   setSelectedBrandName(name);
      setDeleteModalOpen(true);
    };
  
    const confirmDelete = async () => {
      if (!selectedBrandId) return;
      try {
        await deleteBrand(selectedBrandId);
        dispatch(getBrands({ page, limit: 10, search }));
        toast.success("Brand deleted successfully");
      } catch (error: any) {
        console.error("Failed to delete brand", error);
        toast.error(error.response?.data?.message || "Failed to delete brand");
      } finally {
        setDeleteModalOpen(false);
        setSelectedBrandId(null);
      }
    };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Brands</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage your brands.</p>
        </div>
        <Link href="/admin/brands/create">
          <button className="bg-[#3ABDE7] hover:bg-[#3ABDE7] cursor-pointer text-zinc-50 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
            <Plus size={18} />
            Create Brand
          </button>
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => {
                setPage(1); // reset page
                setSearch(e.target.value);
              }}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:border-[#3ABDE7]/80 text-zinc-950 dark:text-white transition-colors"
            />
          </div>
          {/* <div className="flex gap-2">
            <select 
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1); // reset pagination
            }}
              className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 outline-none"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div> */}
        </div>

        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Brand Name</th>
              <th className="px-6 py-4 font-medium">Industry</th>
              {/* <th className="px-6 py-4 font-medium">Date</th> */}
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {brands.map((brand, i) => (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={brand._id}
                onClick={() => router.push(`/admin/brands/${brand._id}`)}
                className="hover:bg-zinc-100 dark:hover:bg-zinc-900/30 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                      {brand.logo  ? (
                        <img 
                          src={brand.logo}
                          alt={brand.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <ImageIcon size={16} className="text-zinc-500" />
                      )}
                    </div>
                    <div className="font-medium text-zinc-950 dark:text-white">{brand.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{brand.industry}</td>
                {/* <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${blog.status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                    {blog.status}
                  </span>
                </td> */}
                {/* <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{new Date(blog.createdAt).toLocaleDateString("en-IN")}</td> */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <ActionMenu
                      actions={[
                        {
                          label: "View Details",
                          icon: <Eye size={16} />,
                          onClick: () => router.push(`/admin/brands/${brand._id}`),
                        },
                        {
                          label: "Edit",
                          icon: <Edit size={16} />,
                          onClick: () => router.push(`/admin/brands/edit/${brand._id}`),
                        },
                        {
                          label: "Delete",
                          icon: <Trash2 size={16} />,
                          onClick: () => handleDeleteClick(brand._id, brand.name),
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
        title={`Delete Brand`}
        message="Are you sure you want to delete this brands? It will be removed permanently."
      />
    </div>
  );
}
