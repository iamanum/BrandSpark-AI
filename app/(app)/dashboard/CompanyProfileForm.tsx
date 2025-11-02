"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuthState } from "react-firebase-hooks/auth";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function CompanyProfileForm() {
  const [user] = useAuthState(auth);
  const [companyName, setCompanyName] = useState("");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing profile from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompanyName(data.companyName || "");
          setProduct(data.product || "");
          setAudience(data.audience || "");
        }
      } catch (error) {
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // 🔹 Save Profile Data to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in.");
      return;
    }

    setLoading(true);
    try {
      await setDoc(
        doc(db, "profiles", user.uid),
        {
          companyName,
          product,
          audience,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      toast.success("Profile saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-xl backdrop-blur-md border border-gray-200 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
            🏢 Company Profile
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter details about your brand so AI can create personalized content.
          </p>
        </CardHeader>

        <form onSubmit={handleSave}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g., BrewHeaven Coffee"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product/Service</Label>
              <Input
                id="product"
                placeholder="e.g., Organic coffee blends"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Young professionals, coffee lovers"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="font-semibold flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </motion.div>
  );
}
