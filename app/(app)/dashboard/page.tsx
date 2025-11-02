"use client";

// 🎨 15+ YR EXPERT IMPORTS:
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// 🎨 NAYE ICONS ADD KIYE HAIN
import { 
  Sun, Moon, Sparkles, LogOut, LayoutGrid, Wand2, Settings, 
  BarChart3, Users2, Plug 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// 🔥 CORE FUNCTIONALITY IMPORTS:
import CompanyProfileForm from "@/components/CompanyProfileForm";
import ContentGenerator from "@/components/ContentGenerator";

// 🎨 NAVIGATION ITEMS UPDATE KIYE HAIN
const navItems = [
  { name: "Overview", icon: LayoutGrid },
  { name: "AI Generator", icon: Wand2 },
  { name: "Analytics", icon: BarChart3 },
  { name: "Team", icon: Users2 },
  { name: "Integrations", icon: Plug },
  { name: "Settings", icon: Settings },
];

// 🎨 15+ YR EXPERT FIX: Ek reusable placeholder page banaya
const PlaceholderPage = ({ title }: { title: string }) => (
  <motion.div key={title} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
    <Card className="bg-white/70 dark:bg-black/5 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-saas animate-fade-in">
      <CardContent className="p-10 text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Feature Coming Soon!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          This ({title}) feature is currently under development. This demonstrates 
          the full navigation structure of the planned SaaS application.
        </p>
      </CardContent>
    </Card>
  </motion.div>
);


export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const { user, loading } = useAuth(); 
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState("Overview"); 

  const handleLogout = async () => {
    if (!auth) return; 
    await signOut(auth);
    router.push("/login");
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary">
        <p className="text-xl font-medium text-muted-foreground">Checking login status...</p> 
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary transition-all duration-700">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/5 backdrop-blur-xl p-6 flex flex-col justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight"
          >
            BrandSpark <span className="text-primary dark:text-primary-foreground/80">AI</span>
          </motion.h1>

          <nav className="space-y-3">
            {navItems.map(
              (item) => (
                <motion.button
                  whileHover={{ scale: 1.05, x: 4 }}
                  key={item.name}
                  onClick={() => setSelectedPage(item.name)} 
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3
                    ${selectedPage === item.name 
                      ? "bg-primary/90 text-primary-foreground" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-white/10"
                    } 
                    font-medium transition-all`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </motion.button>
              )
            )}
          </nav>
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-200 dark:hover:bg-white/10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleLogout}
            className="rounded-full hover:scale-105 transition-transform"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="ml-64 p-10">
        
        {/* ==== OVERVIEW PAGE ==== */}
        {selectedPage === "Overview" && (
          <>
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl relative overflow-hidden p-8 bg-gradient-to-r from-primary/10 via-blue-600/5 to-purple-600/5 dark:from-primary/10 dark:via-indigo-500/10 dark:to-purple-600/10 border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-saas animate-fade-in"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back,{" "}
                    <span className="text-primary dark:text-primary-foreground/80">
                      {user?.email?.split("@")[0]}
                    </span>
                    👋
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg">
                    Create, analyze, and manage your AI marketing content—all in one
                    stunning dashboard.
                  </p>
                </div>
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  className="mt-6 md:mt-0"
                >
                  <Sparkles className="text-primary dark:text-primary-foreground/80 w-16 h-16" />
                </motion.div>
              </div>
            </motion.div>

            {/* 🎨 CARDS AB CLICKABLE HAIN */}
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Analytics Insight", desc: "Track engagement, growth and keyword trends.", pageName: "Analytics" },
                { title: "Team Collaboration", desc: "Share your AI workspace with your team.", pageName: "Team" },
                { title: "Integrations", desc: "Connect Facebook, LinkedIn, and Google Ads.", pageName: "Integrations" },
              ].map((card, i) => (
                <motion.button
                  key={i}
                  onClick={() => setSelectedPage(card.pageName)} // <-- CLICK LOGIC
                  whileHover={{ scale: 1.04, translateY: -5 }}
                  transition={{ duration: 0.3 }}
                  className="animate-fade-in text-left"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <Card className="bg-white/70 dark:bg-black/5 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-saas hover:shadow-xl transition-all h-full">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {card.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {/* ==== AI GENERATOR PAGE ==== */}
        {selectedPage === "AI Generator" && (
          <motion.div 
            key="ai-generator"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">AI Generator</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">First, update your company profile. Then, generate content below.</p>
            <CompanyProfileForm userId={user.uid} />
            <ContentGenerator userId={user.uid} />
          </motion.div>
        )}

        {/* ==== SETTINGS PAGE ==== */}
        {selectedPage === "Settings" && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your company profile and billing information.</p>
            <CompanyProfileForm userId={user.uid} />
          </motion.div>
        )}
        
        {/* 🎨 YAHAN NAYE PLACEHOLDER PAGES HAIN */}
        {selectedPage === "Analytics" && <PlaceholderPage title="Analytics" />}
        {selectedPage === "Team" && <PlaceholderPage title="Team Collaboration" />}
        {selectedPage === "Integrations" && <PlaceholderPage title="Integrations" />}

      </main>
    </div>
  );
}

