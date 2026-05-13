  "use client";

  import { useState } from "react";
  import { motion } from "framer-motion";
  import { ArrowLeft, Save } from "lucide-react";
  import { useRouter } from "next/navigation";
  import RichTextEditor from "@/src/components/RichTextEditor";
  import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
  import { toast } from "react-toastify";
  import Link from "next/link";
  import { addFaqCategory } from "@/src/store/slices/FaqCategorySlice";

  export default function CreateCareerPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);

      const payload = {
        name: formData.get("name") as string,
      };

      try {
        const res = await dispatch(addFaqCategory(payload));

        if (addFaqCategory.fulfilled.match(res)) {
          toast.success("Category created successfully");
          router.push("/admin/faq-categories");
        } else {
          toast.error((res.payload as string) || "Failed to create categories");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to create categories");
      }
    };

    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Link href="/admin/faq-categories">
              <button className="w-10 h-10 mt-1 cursor-pointer rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                  <ArrowLeft size={18} />
              </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Create Category</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Add a new Category.</p>
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
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Accounting"
                  required
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
            <button onClick={() => router.back()} className="cursor-pointer px-6 py-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
              <Save size={18} />
              {isSubmitting ? "Creating..." : "Create Category"}
            </button>
          </div>
        </motion.form>
      </div>
    );
  }
