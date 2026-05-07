"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save, Download, Mail, Phone, Calendar, User, FileText, Edit } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getApplicationById } from "@/src/store/slices/ApplicationSlice";

export default function ApplicationDetailPage() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useAppDispatch();
    // const { singleApplication, loading } = useAppSelector((state) => state.applications);

    const id = params?.id as string;

    useEffect(() => {
        if (!id) return;
        dispatch(getApplicationById(id));
    }, [id, dispatch]);

    const { singleApplication, loading, error } = useAppSelector(
        (state) => state.applications
    );

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
                    <button onClick={() => router.back()} className="p-2 bg-white dark:bg-zinc-950 cursor-pointer border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-1">Application Details</h1>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Reviewing application #{params.id}</p>
                    </div>
                </div>
                <button 
                    onClick={() => router.push(`/admin/applications/edit/${params.id}`)}
                    className="bg-[#3ABDE7] hover:bg-[#3ABDE7] cursor-pointer text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Edit size={18} />
                    Edit Application
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
                                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">{singleApplication.name}</h2>
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
                            {/* <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                  <User size={16} /> Portfolio: github.com/davidc
               </div> */}
                        </div>

                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/50">
                            <h3 className="text-zinc-950 dark:text-white font-semibold mb-3">Cover Letter</h3>
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border border-zinc-200 dark:border-zinc-800">
                                <p>{singleApplication.coverLetter}</p>
                                {/* <p className="mt-2">I am writing to express my strong interest in the Senior Frontend Developer position at your company. With over 5 years of dedicated experience building scalable React applications and a deep understanding of Next.js, I am confident in my ability to immediately contribute to your team.</p>
                  <p className="mt-2">I have attached my resume for your consideration. Thank you for your time.</p> */}
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
                        <div className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-[#3ABDE7]/80 transition-all">
                            <p>{singleApplication.status}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-zinc-950 dark:text-white font-semibold mb-4">Resume Attachment</h3>
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between group hover:border-[#3ABDE7]/80 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 dark:bg-[#3ABDE7]/10 text-indigo-600 dark:text-[#3ABDE7] rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-950 dark:text-white">david_chen_resume.pdf</p>
                                    <p className="text-xs text-zinc-500">2.4 MB</p>
                                </div>
                            </div>
                            <button className="text-zinc-400 cursor-pointer hover:text-indigo-600 dark:hover:text-[#3ABDE7]/80 transition-colors p-2">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
