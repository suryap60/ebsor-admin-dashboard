"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { getSectionById, updateSectionThunk } from "@/src/store/slices/SectionSlice";
import RichTextEditor from "@/src/components/RichTextEditor";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function EditSectionPage() {
  const router = useRouter();
  const params = useParams();
  
  const [type, setType] = useState<"terms" | "faq" | "privacy">("terms");
  const [content, setContent] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { singleSection, loading } = useAppSelector((state) => state.sections);

  useEffect(() => {
    if (params.id) {
      dispatch(getSectionById(params.id as string));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (singleSection) {
      setType(singleSection.type);
      setContent(singleSection.content || "");
      if (singleSection.faqs && singleSection.faqs.length > 0) {
          setFaqs(singleSection.faqs);
      }
    }
  }, [singleSection]);

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!singleSection?._id) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload: any = {
      title: formData.get("title") as string,
      type: type,
      isActive: formData.get("isActive") === "true",
    };

    if (type === "faq") {
      payload.faqs = faqs.filter(f => f.question.trim() !== "" && f.answer.trim() !== "");
    } else {
      payload.content = content;
    }

    try {
      await dispatch(updateSectionThunk({
        id: singleSection._id,
        data: payload
      })).unwrap();

      toast.success("Section updated successfully!");
      router.push("/admin/sections");
    } catch (error: unknown) {
      console.error("Failed to update section", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to update section");
      } else {
        toast.error("Failed to update section. An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !singleSection) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="cursor-pointer p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">Edit Policy/FAQ</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Update document section #{params.id}.</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Section Title</label>
            <input
              type="text"
              name="title"
              defaultValue={singleSection.title}
              placeholder="e.g. Terms and Conditions"
              required
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Status</label>
            <select name="isActive" defaultValue={singleSection.isActive ? "true" : "false"} className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all">
              <option value="true">Active</option>
              <option value="false">Draft (Inactive)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as any)} 
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
            >
              <option value="terms">Terms</option>
              <option value="privacy">Privacy</option>
              <option value="faq">FAQ</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <AnimatePresence mode="wait">
            {type === "faq" ? (
              <motion.div
                key="faq"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">FAQ Items</label>
                  <button type="button" onClick={handleAddFaq} className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                    <Plus size={16} /> Add FAQ
                  </button>
                </div>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                          placeholder="Question (e.g. What is the refund policy?)"
                          className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                        />
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                          placeholder="Answer..."
                          rows={2}
                          className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all resize-y"
                        />
                      </div>
                      {faqs.length > 1 && (
                        <button type="button" onClick={() => handleRemoveFaq(index)} className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">Content</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder={`Write the ${type} content here...`}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
          <button type="button" onClick={() => router.back()} className="cursor-pointer px-6 py-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50">
            <Save size={18} />
            {isSubmitting ? "Updating..." : "Update Section"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
