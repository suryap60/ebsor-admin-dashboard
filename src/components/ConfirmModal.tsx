"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden m-4"
          >
            <div className="p-6">
              <button
                onClick={onClose}
                className="cursor-pointer absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-500">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1 mt-1">
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800/50 pt-6">
                <button
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="cursor-pointer px-4 py-2 rounded-lg text-sm font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/20 transition-all active:scale-95"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
