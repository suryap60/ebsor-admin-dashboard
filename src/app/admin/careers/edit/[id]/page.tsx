"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/src/components/RichTextEditor";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getCareers, getJobById, updateJobThunk } from "@/src/store/slices/CareerSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function EditCareerPage() {
    const router = useRouter();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [description, setDescription] = useState("");

    const dispatch = useAppDispatch();
    const { singleJob, loading } = useAppSelector((state) => state.careers);

    useEffect(() => {
        if (params.id) {
            dispatch(getJobById(params.id as string));
        }
    }, [params.id]);

    useEffect(() => {
        if (singleJob?.description) {
            setDescription(singleJob.description);
        }
    }, [singleJob]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!singleJob?._id) return;

        setIsSubmitting(true);
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
            await dispatch(updateJobThunk({
                id: singleJob._id,
                data: payload
            })).unwrap();

            toast.success("Job updated successfully");

            router.push("/admin/careers");
        } catch (error: unknown) {
            console.error(error);

            if (error instanceof AxiosError) {
                const message =
                    error.response?.data?.message ||
                    "Something went wrong";

                if (error.response?.status === 403) {
                    toast.error("You are not authorized to perform this action 🚫");
                } else {
                    toast.error(message);
                }
            } else {
                toast.error("Unexpected error occurred");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || !singleJob) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="pcursor-pointer -2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Edit Job Posting</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">Update details for Job #{params.slug}.</p>
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
                                defaultValue={singleJob.title}
                                placeholder="Enter an engaging title..."
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80  transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Department</label>
                            <input
                                type="text"
                                name="department"
                                defaultValue={singleJob.department}
                                placeholder="Enter an department..."
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Employment Type</label>
                            <select name="employmentType" defaultValue={singleJob.employmentType} className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all">
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="internship">Internship</option>
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
                                defaultValue={singleJob.location}
                                placeholder="Enter an author..."
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Status</label>
                            <select name="isActive" defaultValue={singleJob.isActive ? "true" : "false"} className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all">
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                 <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Salary</label>
                    <input
                        type="text"
                        name="salary"
                        defaultValue={singleJob.salary}
                        placeholder="Enter your salary range..."
                        className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80  transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">Job Description & Requirements</label>
                    <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Write the job requirements and responsibilities here..."
                    />
                </div>

                <div className="flex items-center justify-end cursor-pointer gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl cursor-pointer text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                        <Save size={18} />
                        {isSubmitting ? "Updating..." : "Update Job"}
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
