"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save, Download, Mail, Phone, Calendar, User, FileText } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getApplicationById, updateApplicationStatusThunk } from "@/src/store/slices/ApplicationSlice";
import { toast } from "react-toastify";
import { IoLocation } from "react-icons/io5";

export default function ApplicationDetailPage() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useAppDispatch();
    const [status, setStatus] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const id = params?.id as string;


    useEffect(() => {
        if (!id) return;
        dispatch(getApplicationById(id));
    }, [id, dispatch]);



    const { singleApplication, loading, error } = useAppSelector(
        (state) => state.applications
    );

    useEffect(() => {
        if (singleApplication?.status) {
            setStatus(singleApplication.status);
        }
    }, [singleApplication]);

    if (!singleApplication?._id) return;

    const handleUpdate = async () => {
        if (!singleApplication?._id) return;

        try {
            await dispatch(
                updateApplicationStatusThunk({
                    id: singleApplication._id,
                    status,
                })
            ).unwrap();

            toast.success("Status updated successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to update status");
        }
    };

    if (loading || !singleApplication) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 bg-white cursor-pointer dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-1">Application Details</h1>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Reviewing application #{params.id}</p>
                    </div>
                </div>
                <button
                    onClick={handleUpdate}
                    className="bg-[#3ABDE7] cursor-pointer hover:bg-[#3ABDE7] text-white px-6 py-2.5 rounded-xl flex items-center gap-2"
                >
                    <Save size={18} />
                    Update Status
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-1 md:col-span-2 space-y-6"
                >
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-[#3ABDE7]/10 text-indigo-600 dark:text-[#3ABDE7] rounded-2xl flex items-center justify-center font-bold text-2xl">
                                DC
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">{singleApplication.firstName}{singleApplication.lastName}</h2>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">Applying for <span className="font-medium text-zinc-950 dark:text-zinc-300">{singleApplication?.job?.title}</span></p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                                <Mail size={16} /> {singleApplication.email}
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                                <Phone size={16} /> {singleApplication.phone}
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                                <Calendar size={16} /> Applied on {new Date(singleApplication.createdAt).toLocaleDateString("en-IN")}
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                                <Calendar size={16} />
                                Experience: {singleApplication.experience || 0} years
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                                <IoLocation size={16} />
                                {singleApplication.place}, {singleApplication.state},{" "}
                                {singleApplication.country}
                            </div>
                            
                        </div>

                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/50">
                            <h3 className="text-zinc-950 dark:text-white font-semibold mb-3">
                                Additional Information
                            </h3>

                            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border border-zinc-200 dark:border-zinc-800">
                                <p>
                                    {singleApplication.additionalInfo || "No additional information"}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-zinc-950 dark:text-white font-semibold mb-4">Application Status</h3>
                        <select
                            value={status}
                            onChange={(e) => {
                                console.log("CHANGED TO:", e.target.value);
                                setStatus(e.target.value);
                            }}
                            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#3ABDE7]/80 transition-all"
                        >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-zinc-950 dark:text-white font-semibold mb-4">
                            Resume Attachment
                        </h3>

                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-[#3ABDE7]/10 text-indigo-600 dark:text-[#3ABDE7] rounded-lg">
                                    <FileText size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-zinc-950 dark:text-white">
                                        Resume File
                                    </p>

                                    <p className="text-xs text-zinc-500">
                                        Click download to open resume
                                    </p>
                                </div>
                            </div>

                            <a
                                href={singleApplication.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-indigo-600 dark:hover:text-[#3ABDE7]/80 transition-colors p-2"
                            >
                                <Download size={18} />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
