"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Login page par link karne ke liye
import { auth } from "@/lib/firebase"; // Hamari Firebase config file
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase ka SIGN UP function

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

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
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
      // -- YEH HAI ASLI FIREBASE SIGN UP LOGIC --
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Successful, toh dashboard par bhej do
      router.push("/dashboard");

    } catch (error) { 
      // Agar error aaye (e.g., email pehle se use mein hai)
      setError("Failed to create account. Email may already be in use.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-center text-primary-foreground">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Start using **BrandSpark AI**
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive text-center p-2 border border-destructive rounded-md bg-destructive/10">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full h-10 font-bold" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium underline text-primary hover:text-primary/80">
                Log In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
