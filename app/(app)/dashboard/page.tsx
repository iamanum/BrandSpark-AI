// app/(app)/dashboard/page.tsx - FINAL DASHBOARD

"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CompanyProfileForm from "@/components/CompanyProfileForm";
import ContentGenerator from "@/components/ContentGenerator"; // <-- YEH ZAROORI IMPORT

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking login status...</p> 
      </div>
    );
  }

  if (!user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>You are not logged in. <a href="/login" className="text-blue-500 underline">Go to Login</a></p>
        </div>
    );
  }

  // Agar user logged-in hai (return statement)
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          ✨ BrandSpark AI Dashboard
        </h1>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <p className="mt-4 text-lg text-gray-700 mb-8">
        Logged in as: <strong>{user.email}</strong>
      </p>
      
      <CompanyProfileForm userId={user.uid} /> 
      
      {/* -- YAHAN NAYA GENERATOR COMPONENT KO CALL KIYA GAYA HAI -- */}
      <ContentGenerator userId={user.uid} /> 
      
    </div>
  );
}