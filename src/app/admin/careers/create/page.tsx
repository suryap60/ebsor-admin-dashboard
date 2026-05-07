"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/src/components/RichTextEditor";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { addJob } from "@/src/store/slices/CareerSlice";
import { toast } from "react-toastify";

export default function CreateCareerPage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.careers);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      title: formData.get("title") as string,
      department: formData.get("department") as string,
      location: formData.get("location") as string,
      employmentType: formData.get("employmentType") as string,
      salary: formData.get("salary") as string,
      isActive: formData.get("isActive") === "true",
      description: description,
    };

    try {
      const res = await dispatch(addJob(payload));

      if (addJob.fulfilled.match(res)) {
        toast.success("Job created successfully");
        router.push("/admin/careers");
      } else {
        toast.error((res.payload as string) || "Failed to create job");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create job");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="cursor-pointer p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Create Job Posting</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Add a new career opportunity.</p>
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
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Job Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Senior Frontend Developer"
                required
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Department</label>
              <input
                type="text"
                name="department"
                placeholder="Enter an department..."
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Employment Type</label>
              <select name="employmentType" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all">
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Remote, San Francisco"
                required
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Status</label>
              <select name="isActive" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Salary</label>
            <input
              type="text"
              name="salary"
              placeholder="e.g. 10000 - 20000"
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">Job Description & Requirements</label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Write the job requirements and responsibilities here..."
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <button onClick={() => router.back()} className="cursor-pointer px-6 py-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
            <Save size={18} />
            {isSubmitting ? "Posting..." : "Post Job"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
