"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CompanyProfileForm from "@/components/CompanyProfileForm";
import ContentGenerator from "@/components/ContentGenerator";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = "Dashboard | BrandSpark AI";
  }, []);

  const handleLogout = async () => {
    if (!auth) {
      console.error("Auth service not initialized.");
      return;
    }
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-xl font-medium text-muted-foreground animate-pulse">
          Checking login status...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <h1 className="text-2xl font-semibold text-primary mb-4">
          You are not logged in
        </h1>
        <a
          href="/login"
          className="text-white bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-lg shadow-md transition-all"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-10">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            ✨ BrandSpark AI Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground text-base">
            Welcome back, <span className="font-semibold text-foreground">{user.email}</span>
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={handleLogout}
          className="shadow-md hover:scale-105 transition-transform"
        >
          Logout
        </Button>
      </div>

      {/* Dashboard Content */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
      >
        {/* Company Profile */}
        <Card className="shadow-md hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              🏢 Company Profile
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Fill in your company details to help the AI generate personalized marketing content.
            </p>
            <CompanyProfileForm userId={user.uid} />
          </CardContent>
        </Card>

        {/* Content Generator */}
        <Card className="shadow-md hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              🤖 AI Content Generator
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Instantly generate creative posts, taglines, and campaign ideas for your brand.
            </p>
            <ContentGenerator userId={user.uid} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
