"use client";

import { Bell, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../ThemeToggle";

export default function AdminHeader() {
  const pathname = usePathname();
  
  // Create a nice title from the pathname
  const segments = pathname.split("/").filter(Boolean);
  const title = segments.length > 1 
    ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1)
    : "Dashboard";

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-zinc-950 dark:text-white">{title}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all w-64"
          />
        </div>
        
        <ThemeToggle />
        
        <button className="relative text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
        </button>
        
        <Link href="/admin/profile" className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-300 dark:border-zinc-700">
            <User size={16} className="text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="hidden md:block text-sm">
            <p className="text-zinc-800 dark:text-zinc-200 font-medium leading-none">Admin User</p>
            <p className="text-zinc-500 text-xs mt-1">Superadmin</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
