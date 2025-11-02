"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Page redirect karne ke liye
import { auth } from "@/lib/firebase"; // Hamari Firebase config file
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase ka login function
import Link from "next/link"; // Sign Up page par link karne ke liye

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state add ki hai
  const router = useRouter(); // Router hook ko initialize kiya

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Login shuru, loading = true

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }
    
    // 🚨 FINAL FIX: Check karein ke auth object mojood hai ya nahi
    if (!auth) {
        setError("Firebase connection failed. Please try again. (Check Vercel envs)");
        setLoading(false);
        return;
    }

    try {
      // -- YEH HAI ASLI FIREBASE LOGIC --
      await signInWithEmailAndPassword(auth, email, password);

      // Agar successful, toh dashboard par bhej do
      router.push("/dashboard");

    } catch (error) { 
      // Agar error aaye (e.g., ghalat password)
      setError("Invalid email or password. Please try again.");
      setLoading(false); // Loading khatam
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-primary-foreground">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Log in to your **BrandSpark AI** account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} // Explicit Type
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} // Explicit Type
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center p-2 border border-destructive rounded-md bg-destructive/10">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full h-10 font-bold" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium underline text-primary hover:text-primary/80">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
