"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getSingleProduct } from "@/src/store/slices/ProductSlice";

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { singleProduct, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (params.slug) {
      dispatch(getSingleProduct(params.slug as string));
    }
  }, [dispatch, params.slug]);

  if (loading || !singleProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="cursor-pointer p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Product Details</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Viewing details for {singleProduct.name}</p>
          </div>
        </div>
        <Link href={`/admin/products/edit/${singleProduct._id}`}>
          <button className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20">
            <Edit size={18} />
            Edit Product
          </button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="col-span-1">
            <div className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
              {singleProduct.images && singleProduct.images.length > 0 ? (
                <img 
                  src={singleProduct.images[0]} 
                  alt={singleProduct.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-white">{singleProduct.name}</h2>
              <div className="inline-block mt-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium border border-indigo-100 dark:border-indigo-500/20">
                {singleProduct.category || "Uncategorized"}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Short Description</h3>
              <p className="text-zinc-800 dark:text-zinc-200 text-lg">{singleProduct.shortDescription || "N/A"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Full Description</h3>
              <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed">{singleProduct.description || "N/A"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Slug</h3>
                <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{singleProduct.slug || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Product ID</h3>
                <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{singleProduct._id}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
