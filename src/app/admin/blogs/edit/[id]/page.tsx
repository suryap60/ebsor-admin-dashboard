"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "@/src/components/RichTextEditor";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getBlogById } from "@/src/store/slices/BlogSlice";
import { BlogPayload } from "@/src/types/Blog";
import { toast } from "react-toastify";
import { updateBlog } from "@/src/services/BlogService";

export default function EditBlogPage() {
    const router = useRouter();
    const params = useParams();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [content, setContent] = useState("");
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);

    const dispatch = useAppDispatch();
    const { singleBlog, loading } = useAppSelector((state) => state.blogs);


    useEffect(() => {
        if (params.id) {
            dispatch(getBlogById(params.id as string));
        }
    }, [params.id]);

    useEffect(() => {
        if (singleBlog?.featuredImage) {
            setImagePreview(singleBlog.featuredImage);
        }
    }, [singleBlog]);

    useEffect(() => {
        if (singleBlog?.content) {
            setContent(singleBlog.content);
        }
    }, [singleBlog]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!singleBlog?._id) return;

        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        // const payload : BlogPayload = {
        //     title: formData.get("title") as string,
        //     excerpt: formData.get("excerpt") as string,
        //     author: formData.get("author") as string,
        //     status: formData.get("status") as "draft" | "published",
        //     content: content,
        //     tags: singleBlog.tags?.length > 0 ? singleBlog.tags : ["blog"],
        // };

        // if (imagePreview) {
        //     payload.featuredImage = imagePreview;
        // }

        formData.append("content", content);

        const tags =
            (formData.get("tags") as string)
            ?.split(",")
            .map((t) => t.trim()) || [];

        tags.forEach((tag) => {
            formData.append("tags[]", tag);
        });

        // upload new image only if selected
        if (featuredImage) {
            formData.append(
            "featuredImage",
            featuredImage
            );
        } 

        try {
            await updateBlog(singleBlog._id, formData);
            toast.success("Blog updated successfully");
            router.push("/admin/blogs");
        } catch (error: any) {
            console.error("Failed to update blog:", error);
            toast.error(error.response?.data?.message || "Failed to update blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImage(file);

            setImagePreview(
            URL.createObjectURL(file)
            );
        }
    };

    if (loading || !singleBlog) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-start gap-4">
                    <Link href="/admin/blogs">
                        <button className="w-10 h-10 mt-1 cursor-pointer rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Edit Blog Post</h1>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Update your blog article #{params.slug}.</p>
                    </div>
                </div>
            </div>

            <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                onSubmit={handleSubmit}
            >
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Blog Title</label>
                            <input
                                type="text"
                                name="title"
                                defaultValue={singleBlog.title}
                                placeholder="Enter an engaging title..."
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Status</label>
                                <select name="status" defaultValue={singleBlog.status} className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-[#3ABDE7]/80 transition-all">
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Author</label>
                                <input
                                    type="text"
                                    name="author"
                                    defaultValue={singleBlog.author}
                                    placeholder="Enter an author..."
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Tags</label>
                                <input
                                    type="text"
                                    name="tags"
                                    defaultValue={singleBlog.tags?.join(", ")}
                                    placeholder="Comma separated tags..."
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">excerpt</label>
                                <input
                                    type="text"
                                    name="excerpt"
                                    defaultValue={singleBlog.excerpt}
                                    placeholder="Enter excerpt..."
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                                />
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

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">Blog Content</label>
                    <RichTextEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Write your amazing article here..."
                    />
                </div>

                <div className="flex items-center justify-end cursor-pointer gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl cursor-pointer text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                        <Save size={18} />
                        {isSubmitting ? "Updating..." : "Update Blog"}
                    </button>
                </div>
            </motion.form >
        </div>
    );
}
