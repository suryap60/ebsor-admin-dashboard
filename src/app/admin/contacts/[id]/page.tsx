"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save, Mail, Phone, Calendar, User, CheckCircle } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getContactById } from "@/src/store/slices/ContactSlice";

export default function ContactDetailPage() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useAppDispatch();

    const id = params?.id as string;

    useEffect(() => {
        if (!id) return;
        dispatch(getContactById(id));
    }, [id, dispatch]);

    const { singleContact, loading, error } = useAppSelector(
        (state) => state.contacts
    );

    if (loading || !singleContact) {
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
                    <button onClick={() => router.back()} className="cursor-pointer p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-1">Contact Inquiry</h1>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm">Reviewing message #{params.id}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-1 md:col-span-2 space-y-6"
                >
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">{singleContact.name}</h2>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">Subject: <span className="font-medium text-zinc-950 dark:text-zinc-300">{singleContact.subject}</span></p>
                            </div>
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {singleContact.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                                <Mail size={16} /> {singleContact.email}
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                                <Phone size={16} /> {singleContact.phone}
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                                <Calendar size={16} /> Received on {new Date(singleContact.createdAt).toLocaleDateString("en-IN")}
                            </div>
                            {/* <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                                <User size={16} /> Company: Acme Corp
                            </div> */}
                        </div>

                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/50">
                            <h3 className="text-zinc-950 dark:text-white font-semibold mb-3">Message Content</h3>
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border border-zinc-200 dark:border-zinc-800">
                                <p>{singleContact.message}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
