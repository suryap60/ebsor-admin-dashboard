"use client";

import { motion } from "framer-motion";
import { Search, Mail, CheckCircle, Clock, Eye } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/src/components/Pagination";

const initialContacts = [
  { id: 1, name: "Jessica Taylor", email: "jessica@example.com", subject: "Enterprise Pricing Inquiry", message: "Hello, I am interested in...", date: "2 hours ago", status: "Pending" },
  { id: 2, name: "Robert Fox", email: "robert@example.com", subject: "Support Issue #142", message: "I'm having trouble logging in...", date: "Yesterday", status: "Resolved" },
  { id: 3, name: "Emily Davis", email: "emily@example.com", subject: "Partnership Opportunity", message: "We would love to discuss a partnership...", date: "Oct 25", status: "Pending" },
];

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState(initialContacts);
  const [page, setPage] = useState(1);

  const toggleStatus = (id: number) => {
    setContacts(contacts.map(contact => 
      contact.id === id 
        ? { ...contact, status: contact.status === "Pending" ? "Resolved" : "Pending" } 
        : contact
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Contact Messages</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">View and respond to inquiries from the contact form.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:border-[#3ABDE7]/80 text-zinc-950 dark:text-white transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 divide-y divide-zinc-200 dark:divide-zinc-800/50">
          {contacts.map((contact, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              key={contact.id}
              onClick={() => router.push(`/admin/contacts/${contact.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
              className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors flex flex-col md:flex-row gap-6 cursor-pointer"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0">
                      <Mail size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-0.5">
                        <h3 className="font-semibold text-zinc-950 dark:text-white">{contact.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase flex items-center gap-1 ${
                          contact.status === 'Pending' 
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}>
                          {contact.status === 'Pending' ? "Pending" : "Resolved"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">{contact.email} • {contact.date}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pl-13">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">{contact.subject}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{contact.message}</p>
                </div>
              </div>
              
              <div className="flex flex-col justify-center gap-2 shrink-0 md:w-44 ml-auto pt-2 md:pt-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); router.push(`/admin/contacts/${contact.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`); }}
                  className="cursor-pointer w-full px-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleStatus(contact.id); }}
                  className={`cursor-pointer w-full px-4 py-2 text-sm rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                    contact.status === 'Pending' 
                      ? 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10' 
                      : 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10'
                  }`}
                >
                  {contact.status === 'Pending' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  Mark as {contact.status === 'Pending' ? 'Resolved' : 'Pending'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <Pagination
          currentPage={page}
          totalPages={1}
          hasNextPage={false}
          hasPrevPage={false}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
