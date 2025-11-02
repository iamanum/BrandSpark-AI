"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  Sparkles,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Company Profile", href: "/dashboard/company", icon: UserCircle },
    { name: "AI Generator", href: "/dashboard/generator", icon: Sparkles },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-6 text-center border-b border-slate-200 dark:border-slate-800">
            <Link
              href="/dashboard"
              className="text-2xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent tracking-tight"
            >
              BrandSpark AI
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="mt-6 space-y-2 px-3">
            {navLinks.map(({ name, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {name}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            onClick={logout}
            className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-medium py-2 rounded-xl flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {pathname === "/dashboard"
                ? "Dashboard Overview"
                : pathname.includes("company")
                ? "Company Profile"
                : pathname.includes("generator")
                ? "AI Content Generator"
                : "Settings"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome, {user?.email?.split("@")[0] ?? "Guest"} 👋
            </p>
          </div>
        </header>

        {/* Content from child pages */}
        <div className="animate-fadeIn">{children}</div>
      </main>
    </div>
  );
}
</html>