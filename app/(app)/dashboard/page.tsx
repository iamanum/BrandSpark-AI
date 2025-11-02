"use client";

import { useAuth } from "@/context/AuthContext"; // Auth context import karein
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CompanyProfileForm from "@/components/CompanyProfileForm"; // Profile Form
import ContentGenerator from "@/components/ContentGenerator";   // AI Generator

export default function DashboardPage() {
  const { user, loading } = useAuth(); // User data aur loading state haasil karein
  const router = useRouter();

  const handleLogout = async () => {
    // Check agar auth object mojood hai
    if (!auth) {
        console.error("Auth service not initialized.");
        return;
    }
    
    try {
      await signOut(auth); // Firebase se logout karein
      router.push("/login"); // Login page par bhej dein
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // 1. Jab tak Firebase check kar raha hai, loading dikhayen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl font-medium text-muted-foreground">Checking login status...</p> 
      </div>
    );
  }

  // 2. Agar loading khatam ho gayi aur user nahi hai, toh login par bhej dein
  if (!user) {
    // User ko login page ka link de dein
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <p className="text-lg text-muted-foreground">You are not logged in. <a href="/login" className="text-primary hover:underline">Go to Login</a></p>
        </div>
    );
  }

  // 3. Agar user logged-in hai (SUCCESS!)
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto bg-white dark:bg-gray-800 min-h-screen shadow-lg">
      
      {/* Dashboard Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground">
          ✨ BrandSpark AI Dashboard
        </h1>
        <Button variant="destructive" onClick={handleLogout} className="shadow-md">
          Logout
        </Button>
      </div>

      {/* User Info */}
      <p className="mt-4 text-lg text-muted-foreground mb-8">
        Logged in as: <strong className="text-primary-foreground">{user.email}</strong>
      </p>
      
      {/* CORE FUNCTIONALITY COMPONENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: Company Profile Form */}
          <div>
            <CompanyProfileForm userId={user.uid} /> 
          </div>

          {/* Column 2: AI Content Generator */}
          <div>
            <ContentGenerator userId={user.uid} /> 
          </div>
      </div>
      
    </div>
  );
}
