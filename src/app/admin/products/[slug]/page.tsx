"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getSingleProduct } from "@/src/store/slices/ProductSlice";
import { useSingleProductSocket } from "@/src/hooks/useSingleProductSocket";
import { param } from "framer-motion/client";

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();

  useSingleProductSocket(params.slug as string)
  const dispatch = useAppDispatch();

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const { singleProduct, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (params.slug) {
      dispatch(getSingleProduct(params.slug as string));
    }
  }, [dispatch, params.slug]);

  useEffect(() => {
    if (!singleProduct || !singleProduct.images || singleProduct.images.length === 0) {
      return;
    }

    const firstImg = singleProduct.images[0];

    const fullUrl = firstImg.startsWith("http")
      ? firstImg
      : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${firstImg}`;

    setActiveImage(fullUrl);
  }, [singleProduct]);

  const getImageUrl = (img: string) => {
    return img.startsWith("http") || img.startsWith("data:")
      ? img
      : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${img}`;
  };

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
          <Link href="/admin/products">
            <button className="cursor-pointer p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Product Details</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Viewing details for {singleProduct.name}</p>
          </div>
        </div>
        <Link href={`/admin/products/edit/${singleProduct._id}`}>
          <button className="cursor-pointer bg-[#3ABDE7] hover:bg-[#3ABDE7]/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20">
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
          <div className="col-span-1 space-y-4">
            {/* MAIN IMAGE */}
            <div className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={singleProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  No Image
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {singleProduct.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {singleProduct.images.map((img, i) => {
                  const url = getImageUrl(img);

                  return (
                    <div
                      key={i}
                      onClick={() => setActiveImage(url)}
                      className={`cursor-pointer border rounded-lg overflow-hidden h-16 
              ${activeImage === url ? "border-[#3ABDE7]/80" : "border-zinc-200 dark:border-zinc-800"}
            `}
                    >
                      <img
                        src={url}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-zinc-950 dark:text-white">{singleProduct.name}</h2>
              <div className="inline-block mt-2 px-3 py-1 bg-[#3ABDE7]/10 dark:bg-[#3ABDE7]/10 text-[#3ABDE7] dark:text-[#3ABDE7] rounded-lg text-sm font-medium border border-indigo-100 dark:border-indigo-500/20">
                {singleProduct.category || "Uncategorized"}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Short Description</h3>
              <p className="text-zinc-800 dark:text-zinc-200 text-lg">{singleProduct.shortDescription || "N/A"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Full Description</h3>
              <div
                className="
                  prose dark:prose-invert max-w-none
                  prose-headings:text-zinc-900 dark:prose-headings:text-white
                  prose-p:text-zinc-700 dark:prose-p:text-zinc-300
                  prose-strong:text-zinc-900 dark:prose-strong:text-white
                  prose-li:text-zinc-700 dark:prose-li:text-zinc-300
                  prose-a:text-[#3ABDE7]
                  prose-img:rounded-xl
                  prose-img:w-full
                  prose-img:max-w-full
                  prose-pre:bg-zinc-900
                  prose-code:text-pink-500
                  overflow-hidden
                  break-words
                "
                dangerouslySetInnerHTML={{
                  __html: singleProduct.description || "<p>N/A</p>",
                }}
              />  
            </div>

            {/* <div className="grid grid-cols-2 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Slug</h3>
                <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{singleProduct.slug || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">Product ID</h3>
                <p className="text-zinc-900 dark:text-zinc-100 font-mono text-sm">{singleProduct._id}</p>
              </div>
            </div> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
