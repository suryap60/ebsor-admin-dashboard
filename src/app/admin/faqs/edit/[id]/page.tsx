"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  getSectionById,
  updateSectionThunk,
} from "@/src/store/slices/SectionSlice";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export default function EditFAQPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const { singleSection, loading } = useAppSelector(
    (state) => state.sections
  );

  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch FAQ
  useEffect(() => {
    if (params.id) {
      dispatch(getSectionById(params.id as string));
    }
  }, [dispatch, params.id]);

  // Set data
  useEffect(() => {
    if (singleSection?.type === "faq") {
      if (singleSection.faqs?.length) {
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

  const handleFaqChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!singleSection?._id) return;

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      title: formData.get("title") as string,
      type: "faq", // 🔥 LOCKED
      isActive: formData.get("isActive") === "true",
      faqs: faqs.filter(
        (f) => f.question.trim() && f.answer.trim()
      ),
    };

    try {
      await dispatch(
        updateSectionThunk({
          id: singleSection._id,
          data: payload,
        })
      ).unwrap();

      toast.success("FAQ updated successfully!");
      router.push("/admin/faqs"); // 👈 important
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Update failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !singleSection) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 border rounded-xl"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-2xl font-bold">Edit FAQ</h1>
          <p className="text-sm text-zinc-500">
            Update FAQ #{params.id}
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-950 border rounded-2xl p-6 space-y-8"
      >
        {/* Title + Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            name="title"
            defaultValue={singleSection.title}
            required
            className="w-full border rounded-xl px-4 py-3"
          />

          <select
            name="isActive"
            defaultValue={singleSection.isActive ? "true" : "false"}
            className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-950 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
          >
            <option value="true">Active</option>
            <option value="false">Draft</option>
          </select>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium">FAQ Items</h3>
            <button
              type="button"
              onClick={handleAddFaq}
              className="flex gap-1 text-indigo-600"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {faqs.map((faq, index) => (
            <div key={index} className="p-4 border rounded-xl flex gap-4">
              <div className="flex-1 space-y-3">
                <input
                  value={faq.question}
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
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {faqs.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(index)}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button type="button" onClick={() => router.back()}>
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl flex gap-2"
          >
            <Save size={18} />
            {isSubmitting ? "Updating..." : "Update FAQ"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}