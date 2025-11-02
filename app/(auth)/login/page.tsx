"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/40 to-blue-400/40 rounded-full blur-[160px] top-[-100px] left-[-150px]" />
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-pink-500/30 to-purple-400/30 rounded-full blur-[140px] bottom-[-80px] right-[-120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl">
          <CardHeader className="text-center space-y-2">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sign in to continue with{" "}
              <span className="font-semibold text-indigo-600">BrandSpark AI</span>
            </p>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6 px-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2 text-center"
                >
                  {error}
                </motion.p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all"
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don’t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-indigo-600 font-medium hover:underline hover:text-indigo-700"
                >
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
