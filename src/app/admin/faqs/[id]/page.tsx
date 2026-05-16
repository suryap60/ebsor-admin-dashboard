"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getSectionById } from "@/src/store/slices/SectionSlice";
import { useSingleSectionSocket } from "@/src/hooks/useSingleSectionSocket";

export default function ViewSectionPage() {
  const router = useRouter();
  const params = useParams();

  const dispatch = useAppDispatch();

  const { singleSection, loading } = useAppSelector((state) => state.sections);

  useSingleSectionSocket(params.id as string, singleSection?.type)
  
  useEffect(() => {
    if (params.id) {
      dispatch(getSectionById(params.id as string));
    }
  }, [dispatch, params.id]);

  if (loading || !singleSection) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const formatType = (type: string) => {
    switch (type) {
      case 'faq': return 'FAQ';
      case 'privacy': return 'Privacy Policy';
      default: return 'Terms & Conditions';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/faqs">
            <button className="w-10 h-10 mt-1 cursor-pointer rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-1">
              Document Details
            </h1>
            <p className="text-zinc-500 text-sm">
              Viewing details for {singleSection.title}
            </p>
          </div>
        </div>

        <Link href={`/admin/faqs/edit/${singleSection._id}`}>
          <button className="bg-[#3ABDE7] hover:bg-[#3ABDE7] cursor-pointer text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20">
            <Edit size={18} />
            Edit Document
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
              {singleSection.title}
            </h2>

            <div className="flex flex-wrap gap-4 mt-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 dark:bg-[#3ABDE7]/10 text-indigo-600 dark:text-[#3ABDE7] rounded-lg text-sm font-medium border border-indigo-100 dark:border-indigo-500/20">
                {formatType(singleSection.type)}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium border ${singleSection.isActive
                  ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                  }`}
              >
                {singleSection.isActive ? "Active" : "Draft"}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">Content</h3>
            {singleSection.type === "faq" ? (
              <div className="space-y-8">
                {singleSection.faqs && singleSection.faqs.length > 0 ? (
                  Object.entries(
                    singleSection.faqs.reduce((acc: any, faq: any) => {
                      // No categories
                      if (!faq.categories || faq.categories.length === 0) {
                        if (!acc["General"]) {
                          acc["General"] = [];
                        }

                        acc["General"].push(faq);

                        return acc;
                      }

                      // Multiple categories
                      faq.categories.forEach((cat: any) => {
                        const categoryName =
                          typeof cat === "object" ? cat.name : cat;

                        if (!acc[categoryName]) {
                          acc[categoryName] = [];
                        }

                        acc[categoryName].push(faq);
                      });

                      return acc;
                    }, {})
                  ).map(([category, faqs]: any) => (
                    <div key={category} className="space-y-4">

                      {/* Category Title */}
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />

                        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#3ABDE7] whitespace-nowrap">
                          {category}
                        </h3>

                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                      </div>

                      {/* FAQ Items */}
                      <div className="space-y-4">
                        {faqs.map((faq: any, index: number) => (
                          <div
                            key={`${category}-${index}`}
                            className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl"
                          >
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                              {faq.question}
                            </h4>

                            <p className="text-zinc-600 dark:text-zinc-400 text-sm whitespace-pre-wrap">
                              {faq.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm italic">
                    No FAQs available.
                  </p>
                )}
              </div>
            ) : (
              <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl">
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
                  dangerouslySetInnerHTML={{ __html: singleSection.content || "<p>No content provided.</p>" }}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
