"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { addSection } from "@/src/store/slices/SectionSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function CreateFAQPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.sections);

  const [faqs, setFaqs] = useState([{ question: "", answer: "", category:"" }]);

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "", category: "", }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (
    index: number,
    field: "question" | "answer" | "category",
    value: string
  ) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const payload = {
      title: formData.get("title") as string,
      type: "faq",
      isActive: formData.get("isActive") === "true",
      faqs: faqs.filter(
        (f) =>
          f.category.trim() !== "" &&
          f.question.trim() !== "" &&
          f.answer.trim() !== ""
      ),
    };

    try {
      await dispatch(addSection(payload)).unwrap();
      toast.success("FAQ created successfully!");
      router.push("/admin/faqs"); 
    } catch (error: unknown) {
      console.error("Failed to create FAQ", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Failed to create FAQ");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white">
            Create FAQ
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Add frequently asked questions
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8 space-y-8"
      >
        {/* Title + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              FAQ Title
            </label>
            <input
              name="title"
              required
              placeholder="e.g. General Questions"
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              name="isActive"
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3"
            >
              <option value="true">Active</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/50 space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">FAQ Items</label>

            <button
              type="button"
              onClick={handleAddFaq}
              className="cursor-pointer flex items-center gap-1 text-sm text-indigo-600"
            >
              <Plus size={16} /> Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 bg-zinc-50 dark:bg-zinc-900 border rounded-xl flex gap-4"
              >
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={faq.category}
                    required
                    onChange={(e) =>
                      handleFaqChange(index, "category", e.target.value)
                    }
                    placeholder="Category (e.g. Billing & Payments)"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <input
                    type="text"
                    value={faq.question}
                    required
                    onChange={(e) =>
                      handleFaqChange(index, "question", e.target.value)
                    }
                    placeholder="Question"
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <textarea
                    value={faq.answer}
                    onChange={(e) =>
                      handleFaqChange(index, "answer", e.target.value)
                    }
                    placeholder="Answer"
                    required
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                  />

                </div>

                {faqs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(index)}
                    className="p-2 text-zinc-400 hover:text-rose-500"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 rounded-xl"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#3ABDE7] text-white px-6 py-2 rounded-xl flex gap-2 items-center"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save FAQ"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}