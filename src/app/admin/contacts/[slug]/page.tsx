"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Save, Mail, Phone, Calendar, User, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-1">Contact Inquiry</h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Reviewing message #{params.slug}</p>
          </div>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20">
          <Save size={18} />
          Save Updates
        </button>
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
                  <h2 className="text-xl font-bold text-zinc-950 dark:text-white">Alex Johnson</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">Subject: <span className="font-medium text-zinc-950 dark:text-zinc-300">Enterprise Pricing Inquiry</span></p>
               </div>
               <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Pending
               </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                  <Mail size={16} /> alex.j@company.com
               </div>
               <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                  <Phone size={16} /> +1 (555) 987-6543
               </div>
               <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                  <Calendar size={16} /> Received on Oct 25, 2026
               </div>
               <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm">
                  <User size={16} /> Company: Acme Corp
               </div>
            </div>

            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800/50">
               <h3 className="text-zinc-950 dark:text-white font-semibold mb-3">Message Content</h3>
               <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border border-zinc-200 dark:border-zinc-800">
                  <p>Hello Admin Team,</p>
                  <p className="mt-3">We are interested in upgrading our current dashboard infrastructure and came across your Enterprise tier. Could you please provide more information regarding the custom API limits and SLA agreements?</p>
                  <p className="mt-3">Also, we'd like to schedule a demo if possible later next week.</p>
                  <p className="mt-3">Best,<br/>Alex</p>
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
            <h3 className="text-zinc-950 dark:text-white font-semibold mb-4">Inquiry Status</h3>
            <select defaultValue="pending" className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all mb-4">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <button className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2 font-medium">
               <CheckCircle size={18} className="text-emerald-500" />
               Mark as Resolved
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="text-zinc-950 dark:text-white font-semibold mb-4">Quick Reply</h3>
            <textarea 
               rows={4} 
               placeholder="Draft a response..." 
               className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all resize-none mb-3" 
            />
            <button className="w-full bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium py-2.5 rounded-xl transition-colors">
               Send Reply via Email
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
