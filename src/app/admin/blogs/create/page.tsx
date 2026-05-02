"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/src/components/RichTextEditor";

export default function CreateBlogPage() {
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs">
            <button className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">Create Blog Post</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Write and publish a new blog article.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-zinc-100 cursor-pointer dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
            Save Draft
          </button>
          <button className="px-4 py-2 rounded-lg cursor-pointer bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-zinc-950 dark:text-white font-medium flex items-center gap-2 transition-colors">
            <Save size={18} />
            Publish
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Blog Title</label>
              <input
                type="text"
                placeholder="Enter an engaging title..."
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
                <select className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-indigo-500 transition-all">
                  <option>Technology</option>
                  <option>Design</option>
                  <option>Business</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="Comma separated tags..."
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
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
      </motion.div>
    </div>
  );
}
