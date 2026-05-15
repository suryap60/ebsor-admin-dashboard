"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getBrandById } from "@/src/store/slices/BrandSlice";
import { useSingleBrandSocket } from "@/src/hooks/useSingleBrandSocket";

export default function ViewBrandPage() {
  const params = useParams();
  const dispatch = useAppDispatch();

  useSingleBrandSocket(params.id as string)

  const { singleBrand, loading } = useAppSelector((state) => state.brands);

  useEffect(() => {
    if (params.id) {
      dispatch(getBrandById(params.id as string));
    }
  }, [dispatch, params.id]);

  if (loading || !singleBrand) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl px-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/brands">
              <button className="w-10 h-10 mt-1 cursor-pointer rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                  <ArrowLeft size={18} />
              </button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">
              Brand Details
            </h1>
            <p className="text-zinc-500 text-sm">
              Viewing: {singleBrand.name}
            </p>
          </div>
        </div>

        <Link href={`/admin/brands/edit/${singleBrand._id}`}>
          <button className="bg-[#3ABDE7] hover:bg-[#3ABDE7] cursor-pointer text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Edit size={18} />
            Edit Brand
          </button>
        </Link>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8"
      >
        <div className="space-y-6">

          {/* Image */}
          {singleBrand?.logo && (
            <div className="w-full h-[300px] rounded-xl overflow-hidden">
              <img
                src={singleBrand.logo}
                alt={singleBrand.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl font-bold text-zinc-950 dark:text-white">
            {singleBrand.name}
          </h2>

          {/* Meta Info */}
          {/* <div className="flex flex-wrap  text-sm text-zinc-500">
            <span>{singleBrand.industry}</span>
          </div> */}

          {/* Excerpt */}
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            {singleBrand.industry}
          </p>

        </div>
      </motion.div>
    </div>
  );
}