"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getSingleBlog } from "@/src/store/slices/BlogSlice";

export default function ViewBlogPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const { singleBlog, loading } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    if (params.slug) {
      dispatch(getSingleBlog(params.slug as string));
    }
  }, [dispatch, params.slug]);

  if (loading || !singleBlog) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">
              Blog Details
            </h1>
            <p className="text-zinc-500 text-sm">
              Viewing: {singleBlog.title}
            </p>
          </div>
        </div>

        <Link href={`/admin/blogs/edit/${singleBlog._id}`}>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Edit size={18} />
            Edit Blog
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
          {singleBlog.featuredImage && (
            <div className="w-full h-[300px] rounded-xl overflow-hidden">
              <img
                src={singleBlog.featuredImage}
                alt={singleBlog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl font-bold text-zinc-950 dark:text-white">
            {singleBlog.title}
          </h2>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
            <span>{singleBlog.author}</span>
            <span>
              {new Date(singleBlog.createdAt).toLocaleDateString()}
            </span>
            <span
              className={`px-2 py-1 rounded ${
                singleBlog.status === "published"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {singleBlog.status}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {singleBlog.tags?.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Excerpt */}
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            {singleBlog.excerpt}
          </p>

          {/* Content (IMPORTANT) */}
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: singleBlog.content }}
          />

          {/* Footer Info */}
          <div className="pt-6 border-t text-sm text-zinc-500">
            <p>Slug: {singleBlog.slug}</p>
            <p>ID: {singleBlog._id}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}