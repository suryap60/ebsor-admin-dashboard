"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsThreeDotsVertical } from "react-icons/bs";
import { createPortal } from "react-dom";

type ActionItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
};

interface ActionMenuProps {
  actions: ActionItem[];
}

export default function ActionMenu({ actions }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleScroll() {
      if (isOpen) setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true); // true catches capture phase for scrollable containers
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.right - 192, // 192px is w-48
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className="cursor-pointer p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
      >
        <BsThreeDotsVertical size={16} />
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -5 }}
              transition={{ duration: 0.15 }}
              style={{ position: 'fixed', top: position.top, left: position.left }}
              className="w-48 origin-top-right rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800 ring-opacity-5 z-[9999] overflow-hidden"
            >
              <div className="py-1">
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      action.onClick();
                      setIsOpen(false);
                    }}
                    className={`w-full cursor-pointer text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${action.destructive
                      ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                      }`}
                  >
                    {action.icon && <span>{action.icon}</span>}
                    {action.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
