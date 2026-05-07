"use client";

import { motion } from "framer-motion";
import { Search, Mail, CheckCircle, Clock, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from "@/src/components/Pagination";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getContacts, updateContactStatusThunk } from "@/src/store/slices/ContactSlice";
import { toast } from "react-toastify";


export default function ContactsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

   const { contacts, loading, pagination } = useAppSelector(
    (state) => state.contacts
  );

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(getContacts({ page, limit: 10, search }));
    }, 500);

    return () => clearTimeout(delay);
  }, [dispatch, page, search]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "resolved" : "pending";

    try {
      await dispatch(updateContactStatusThunk({ id, status: newStatus })).unwrap();
      toast.success(`Contact status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update contact status");
    }
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
              placeholder="Search Contact..."
              value={search}
              onChange={(e) => {
                setPage(1); // reset page
                setSearch(e.target.value);
              }}
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
              key={contact._id}
              onClick={() => router.push(`/admin/contacts/${contact._id}`)}
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
                        <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase
                        ${
                          contact.status === "pending"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}
                      >
                        {contact.status === "pending" ? "Pending" : "Resolved"}
                      </span>
                      </div>
                      <p className="text-xs text-zinc-500">{contact.email} • {new Date(contact.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                  </div>
                </div>
                
                {/* <div className="pl-13">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-1">{contact.subject}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{contact.message}</p>
                </div> */}
              </div>
              
              <div className="flex flex-col justify-center gap-2 shrink-0 md:w-44 ml-auto pt-2 md:pt-0">

                {/* VIEW BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/admin/contacts/${contact._id}`);
                  }}
                  className="cursor-pointer w-full px-4 py-2 text-sm rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  View Details
                </button>

                {/* STATUS BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus(contact._id, contact.status);
                  }}
                  className={`w-full px-4 py-2 text-sm rounded-lg border transition-all flex items-center justify-center gap-2
                    ${
                      contact.status === "pending"
                        ? "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                        : "border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                    }`}
                >
                  {contact.status === "pending" ? (
                    <>
                      <CheckCircle size={16} />
                      Mark as Resolved
                    </>
                  ) : (
                    <>
                      <Clock size={16} />
                      Mark as Pending
                    </>
                  )}
                </button>

              </div>
            </motion.div>
          ))}
        </div>
        <Pagination
          currentPage={page}
          totalPages={pagination?.total_pages || 1}
          hasNextPage={!!pagination?.next}
          hasPrevPage={!!pagination?.previous}
          onPageChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
