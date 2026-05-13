"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { addBrand } from "@/src/store/slices/BrandSlice";



export default function CreateBrandPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { singleBrand, loading } = useAppSelector((state) => state.brands);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);

      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);



    if (logo) {
      formData.append(
        "logo",
        logo
      );
    }

    
    try {
      const res = await dispatch(addBrand(formData));
    
      if (addBrand.fulfilled.match(res)) {
        toast.success("Brand created successfully");
        router.push("/admin/brands");
      } else {
        toast.error((res.payload as string) || "Failed to create brand");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create brand");
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/brands">
            <button className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Create Brand</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Manage Brands.</p>
          </div>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Brand name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter a brand name..."
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80  transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Industry</label>
              <input
                type="text"
                name="industry"
                placeholder="Enter industry name..."
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80  transition-all"
              />
            </div>

          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">Logo</label>
          <label className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer group block relative overflow-hidden min-h-[240px]">
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            {imagePreview ? (
              <div className="absolute inset-0 w-full h-full">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-zinc-950/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                  <Upload size={24} className="text-white mb-2" />
                  <span className="text-sm font-medium text-white">Change Logo</span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors mx-auto">
                  <ImageIcon size={28} className="text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-zinc-500">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </>
            )}
          </label>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <button type="button" onClick={() => router.back()} className="cursor-pointer px-6 py-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
            <Save size={18} />
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
