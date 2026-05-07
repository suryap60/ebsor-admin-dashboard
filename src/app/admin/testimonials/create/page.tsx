"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { addTestimonial } from "@/src/store/slices/TestimonialSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function CreateTestimonialPage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.testimonials);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      designation: formData.get("designation") as string,
      rating: Number(rating),
      description: description,
    };

    try {
      const res = await dispatch(addTestimonial(payload)).unwrap();
      toast.success("Testimonial created successfully!");
      router.push("/admin/testimonials");
    } catch (error: unknown) {
      console.error("Failed to create testimonial", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to create testimonial");
      } else {
        toast.error("Failed to create testimonial. An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="cursor-pointer p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Create Testimonial</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Add a new client review.</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Client Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. John Doe"
                required
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Designation</label>
              <input
                type="text"
                name="designation"
                placeholder="e.g. CEO at Company"
                required
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Rating</label>
              <div className="flex items-center gap-2 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 cursor-pointer transition-colors ${rating >= star ? 'text-yellow-400' : 'text-zinc-300 dark:text-zinc-700'}`}
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">Testimonial Content</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Write the review content here..."
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all resize-y"
          ></textarea>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <button type="button" onClick={() => router.back()} className="cursor-pointer px-6 py-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
            <Save size={18} />
            {loading ? "Saving..." : "Save Testimonial"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
