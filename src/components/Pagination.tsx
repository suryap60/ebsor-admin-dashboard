"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-b-2xl">
      <span className="text-sm text-zinc-500 font-medium">
        {currentPage} of {Math.max(1, totalPages)}
      </span>

      <div className="flex items-center gap-1">
        <button
          disabled={!hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="cursor-pointer p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        
        <button className="cursor-pointer w-8 h-8 rounded-lg bg-indigo-500 text-white font-medium flex items-center justify-center text-sm shadow-md shadow-indigo-600/20">
          {currentPage}
        </button>
        
        <button
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="cursor-pointer p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
