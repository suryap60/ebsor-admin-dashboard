"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { addProduct } from "@/src/store/slices/ProductSlice";
import { toast } from "react-toastify";
import RichTextEditor from "@/src/components/RichTextEditor";

export default function CreateProductPage() {
  const router = useRouter();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.products);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);

    setImages(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previewUrls);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    formData.append("description", description);

    images.forEach((file) => {
      formData.append("images", file);
    });


    try {
      const res = await dispatch(addProduct(formData));

      if (addProduct.fulfilled.match(res)) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      } else {
        toast.error((res.payload as string) || "Failed to create product");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="cursor-pointer p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Create Product</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Add a new product to your inventory.</p>
        </div>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Product Name</label>
              <input type="text" name="name" required placeholder="e.g. Premium Dashboard UI" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Short Description</label>
              <input type="text" name="shortDescription" required placeholder="A short catchy phrase" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
              <input type="text" name="category" required placeholder="Mobile, Software, etc." className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Description
              </label>

              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Detailed product description..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Product Image</label>
            <label className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors h-[calc(100%-2rem)] cursor-pointer group block relative overflow-hidden">
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageChange} />
              <div className="mb-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                  <Upload size={24} className="text-zinc-500" />
                </div>
                <h4 className="text-sm font-medium text-zinc-950 dark:text-white mt-2">
                  Click to upload images
                </h4>
                <p className="text-xs text-zinc-500">
                  PNG, JPG, GIF (multiple allowed)
                </p>
              </div>

              {/* IMAGE PREVIEW GRID */}
              {imagePreview.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4 w-full">
                  {imagePreview.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-full h-24 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800"
                    >
                      <img
                        src={src}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />

                      {/* HOVER OVERLAY */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-xs transition">
                        Change
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </label>
          </div>
        </div>
        {/* 
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Product Description</label>
          <textarea rows={6} placeholder="Describe the product details..." className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all resize-none" />
        </div> */}

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <button type="button" onClick={() => router.back()} className="cursor-pointer px-6 py-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="cursor-pointer bg-[#3ABDE7] hover:bg-[#3ABDE7]/90 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-[#3ABDE7]/20 disabled:opacity-50">
            <Save size={18} />
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
