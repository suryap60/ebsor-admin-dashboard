"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { toast } from "react-toastify";
import Link from "next/link";
import { updateFaqCategory } from "@/src/services/FaqCategoryService";
import { getFaqCategoryById } from "@/src/store/slices/FaqCategorySlice";

export default function EditCareerPage() {
    const router = useRouter();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState("");

    const dispatch = useAppDispatch();
    const { singleCategory, loading } = useAppSelector((state) => state.faqCategories);

    useEffect(() => {
        if (params.id) {
            dispatch(getFaqCategoryById(params.id as string));
        }
    }, [dispatch, params.id]);

    useEffect(() => {
        if (singleCategory) {
            setName(singleCategory.name || "");
        }
    }, [singleCategory]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!singleCategory?._id) return;
    
            setIsSubmitting(true);
            
            const formData = new FormData(e.currentTarget);

            const payload = {
                name,
            };
    
            try {
                await updateFaqCategory(singleCategory._id, payload);
                toast.success("Category updated successfully");
                router.push("/admin/faq-categories");
            } catch (error: any) {
                console.error("Failed to update category:", error);
                toast.error(error.response?.data?.message || "Failed to update category");
            } finally {
                setIsSubmitting(false);
            }
        };

    if (loading || !singleCategory) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/faq-categories">
                    <button className="w-10 h-10 mt-1 cursor-pointer rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Edit Category</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Update details for Category #{params.id}.</p>
                </div>
            </div>

            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 md:col-span-2">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter a category name..."
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80  transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end cursor-pointer gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl cursor-pointer text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                        <Save size={18} />
                        {isSubmitting ? "Updating..." : "Update Category"}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
