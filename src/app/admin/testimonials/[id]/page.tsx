"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getTestimonialById } from "@/src/store/slices/TestimonialSlice";

export default function ViewTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const { singleTestimonial, loading } = useAppSelector((state) => state.testimonials);

  useEffect(() => {
    if (params.id) {
      dispatch(getTestimonialById(params.id as string));
    }
  }, [dispatch, params.id]);

  if (loading || !singleTestimonial) {
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
            className="p-2 bg-white dark:bg-zinc-950 cursor-pointer border border-zinc-200 dark:border-zinc-800 rounded-xl hover:text-zinc-950 dark:hover:text-white text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">
              Testimonial Details
            </h1>
            <p className="text-zinc-500 text-sm">
              Viewing details for {singleTestimonial.name}
            </p>
          </div>
        </div>

        <Link href={`/admin/testimonials/edit/${singleTestimonial._id}`}>
          <button className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20">
            <Edit size={18} />
            Edit Testimonial
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
          <div>
            <h2 className="text-3xl font-bold text-zinc-950 dark:text-white">
              {singleTestimonial.name}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg mt-1">{singleTestimonial.designation}</p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm font-medium border border-yellow-100 dark:border-yellow-500/20">
                {singleTestimonial.rating} Star{singleTestimonial.rating !== 1 && 's'}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Review Content</h3>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl">
              <p className="text-zinc-700 dark:text-zinc-300 italic text-lg leading-relaxed">
                "{singleTestimonial.description}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
