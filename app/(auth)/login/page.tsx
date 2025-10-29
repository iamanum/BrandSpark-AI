// app/(auth)/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Page redirect karne ke liye
import { auth } from "@/lib/firebase"; // Hamari Firebase config file
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase ka login function

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

    try {
      // -- YEH HAI ASLI FIREBASE LOGIC --
      // Koshish karo ke email aur password se sign in karo
      await signInWithEmailAndPassword(auth, email, password);

      // Agar successful, toh dashboard par bhej do
      router.push("/dashboard");

    } catch (error) { // <-- YAHAN HUM NE FIX KIYA HAI
      // Agar error aaye (e.g., ghalat password)
      setError("Invalid email or password. Please try again.");
      setLoading(false); // Loading khatam
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome Back!
          </CardTitle>
          <CardDescription className="text-center">
            Log in to your BrandSpark AI account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading} // Loading ke waqt disable
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading} // Loading ke waqt disable
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}