"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getProductById } from "@/src/store/slices/ProductSlice";
import { toast } from "react-toastify";
import RichTextEditor from "@/src/components/RichTextEditor";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");

  const dispatch = useAppDispatch();
  const { singleProduct, loading } = useAppSelector((state) => state.products);


  useEffect(() => {
    if (params.id) {
      dispatch(getProductById(params.id as string));
    }
  }, [params.id]);

  useEffect(() => {
    if (singleProduct?.description) {
      setDescription(singleProduct.description);
    }
  }, [singleProduct]);



  useEffect(() => {
    if (singleProduct?.images) {
      setExistingImages(singleProduct.images);

      const fullUrls = singleProduct.images.map((img) =>
        img.startsWith("http")
          ? img
          : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${img}`
      );

      setImagePreview(fullUrls);
    }
  }, [singleProduct]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!singleProduct?._id) return;
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    formData.append("description", description);

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    formData.append("existingImages", JSON.stringify(existingImages));



    // const payload = {
    //   name: formData.get("name") as string,
    //   description: formData.get("description") as string,
    //   shortDescription: formData.get("shortDescription") as string,
    //   category: formData.get("category") as string,
    //   images: singleProduct.images || [],
    // };

    try {
      const { updateProduct } = await import("@/src/services/ProductSevices");

      await updateProduct(singleProduct._id, formData);
      
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Failed to update product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);

    setNewImages((prev) => [...prev, ...files]);

    const previewUrls = files.map((file) => URL.createObjectURL(file));

    setImagePreview((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index: number) => {
    const updatedPreview = [...imagePreview];
    updatedPreview.splice(index, 1);
    setImagePreview(updatedPreview);

    // if removing existing image
    if (index < existingImages.length) {
      const updatedExisting = [...existingImages];
      updatedExisting.splice(index, 1);
      setExistingImages(updatedExisting);
    } else {
      // removing new image
      const newIndex = index - existingImages.length;
      const updatedNew = [...newImages];
      updatedNew.splice(newIndex, 1);
      setNewImages(updatedNew);
    }
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
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <button className="cursor-pointer p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
            <ArrowLeft size={18} />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Edit Product</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Update product details in your inventory.</p>
        </div>
      </div>

      <motion.form
        key={singleProduct._id}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Product Name</label>
              <input type="text" name="name" defaultValue={singleProduct.name} required placeholder="e.g. Premium Dashboard UI" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Short Description</label>
              <input type="text" name="shortDescription" defaultValue={singleProduct.shortDescription} required placeholder="A short catchy phrase" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
              <input type="text" name="category" defaultValue={singleProduct.category} required placeholder="Mobile, Software, etc." className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all" />
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
              <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />

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

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <button type="button" onClick={() => router.back()} className="cursor-pointer px-6 py-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="cursor-pointer bg-[#3ABDE7] hover:bg-[#3ABDE7]/90 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-[#3ABDE7]/20 disabled:opacity-50">
            <Save size={18} />
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
