"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ImageIcon, Save, Upload } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getTestimonialById, updateTestimonialThunk } from "@/src/store/slices/TestimonialSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import Link from "next/link";


export default function EditTestimonialPage() {
    const router = useRouter();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(5);
    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const [image, setImage] =
        useState<File | null>(null);

    const dispatch = useAppDispatch();
    const { singleTestimonial, loading } = useAppSelector((state) => state.testimonials);

    useEffect(() => {
        if (params.id) {
            dispatch(getTestimonialById(params.id as string));
        }
    }, [dispatch, params.id]);

    useEffect(() => {
        if (singleTestimonial?.image) {
            setImagePreview(singleTestimonial.image);
        }
    }, [singleTestimonial]);

    useEffect(() => {
        if (singleTestimonial) {
            setDescription(singleTestimonial.description || "");
            setRating(singleTestimonial.rating || 5);
        }
    }, [singleTestimonial]);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);

            setImagePreview(
                URL.createObjectURL(file)
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!singleTestimonial?._id) return;

        setIsSubmitting(true);
        const formData = new FormData();

        const form = e.currentTarget;

        formData.append(
            "name",
            (form.elements.namedItem("name") as HTMLInputElement).value
        );
        formData.append(
            "designation",
            (form.elements.namedItem("designation") as HTMLInputElement).value
        );
        formData.append("description", description);
        formData.append("rating", String(rating));

        if (image) {
        formData.append("image", image);
        }

        try {
            await dispatch(updateTestimonialThunk({
                id: singleTestimonial._id,
                data: formData
            })).unwrap();

            toast.success("Testimonial updated successfully");

            router.push("/admin/testimonials");
        } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message 

        toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !singleTestimonial) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/testimonials">
                    <button className="w-10 h-10 mt-1 cursor-pointer rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                    <ArrowLeft size={18} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Edit Testimonial</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Update details for Testimonial #{params.id}.</p>
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
                                defaultValue={singleTestimonial.name}
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
                                defaultValue={singleTestimonial.designation}
                                placeholder="e.g. CEO at Company"
                                required
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
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

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">Cover Image</label>
                    <label className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all cursor-pointer group block relative overflow-hidden min-h-[240px]">
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        {imagePreview ? (
                            <div className="absolute inset-0 w-full h-full">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-zinc-950/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                    <Upload size={24} className="text-white mb-2" />
                                    <span className="text-sm font-medium text-white">Change Image</span>
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

                <div className="flex items-center justify-end cursor-pointer gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl cursor-pointer text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                        <Save size={18} />
                        {isSubmitting ? "Updating..." : "Update Testimonial"}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
