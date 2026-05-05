"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  Briefcase,
  Files,
  MessageSquare,
  Star,
  ShieldCheck,
  Settings,
  LogOut
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Careers", href: "/admin/careers", icon: Briefcase },
    { name: "Applications", href: "/admin/applications", icon: Files },
    { name: "Contacts", href: "/admin/contacts", icon: MessageSquare },
    { name: "Testimonials", href: "/admin/testimonials", icon: Star },
    { name: "Policies & FAQs", href: "/admin/sections", icon: ShieldCheck },
  ];

  const bottomItems = [
    { name: "Profile", href: "/admin/profile", icon: Settings },
    { name: "Logout", href: "/login", icon: LogOut },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 pointer-events-auto">
      <div className="flex h-16 items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/admin" className="flex items-center gap-2">
          <Image 
            src="/assets/logo/dark-logo.png" 
            alt="Logo" 
            width={120} 
            height={32} 
            className="block dark:hidden h-8 w-auto object-contain" 
          />
          <Image 
            src="/assets/logo/white-logo.png" 
            alt="Logo" 
            width={120} 
            height={32} 
            className="hidden dark:block h-8 w-auto object-contain" 
          />
          <span className="text-xl font-bold bg-transparent">
            Admin CMS
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800/50"
                }`}
            >
              <Icon size={20} className={isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-300 transition-colors"} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (item.name === "Logout") {
                  e.preventDefault();
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("user");
                  router.push("/login");
                }
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-white"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800/50"
                }`}
            >
              <Icon size={20} className="text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-300 transition-colors" />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
