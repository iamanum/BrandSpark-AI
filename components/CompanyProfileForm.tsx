"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase'; // Firestore database import kiya
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanyProfileFormProps {
    userId: string;
}

export default function CompanyProfileForm({ userId }: CompanyProfileFormProps) {
    const [companyName, setCompanyName] = useState('');
    const [product, setProduct] = useState('');
    const [audience, setAudience] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // 1. Data Fetch Karna (Jab page load ho)
    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId || !db) return; // 🚨 FIX: db null check (pehle hi laga hua hai)
            setLoading(true);
            try {
                // Yahan db ko use karne se pehle check zaroori hai
                const docRef = doc(db, "profiles", userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCompanyName(data.companyName || '');
                    setProduct(data.product || '');
                    setAudience(data.audience || '');
                    setIsSaved(true);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [userId]);

    // 2. Data Save Karna (Form Submit)
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!db) { // 🚨 FIX: db null check (pehle hi laga hua hai)
             console.error("Database not initialized.");
             setLoading(false);
             return;
        }

        try {
            // Yahan db ko use karne se pehle check zaroori hai
            const docRef = doc(db, "profiles", userId);
            await setDoc(docRef, {
                companyName,
                product,
                audience,
                updatedAt: new Date().toISOString(),
            }, { merge: true });

            setIsSaved(true);
        } catch (error) {
            console.error("Error saving profile:", error);
        }
        setLoading(false);
    };

    if (loading && !isSaved) {
        return <p className="text-center mt-8">Loading profile...</p>;
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-xl">Your Business Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                    {/* Company Name */}
                    <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            placeholder="e.g., Star Coffee"
                            value={companyName}
                            // 🚨 FIX: Explicit type for input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Product/Service */}
                    <div className="space-y-2">
                        <Label htmlFor="product">Product/Service</Label>
                        <Textarea 
                            id="product"
                            placeholder="e.g., Freshly brewed coffee and artisan bakery items."
                            value={product}
                            // 🚨 FIX: Explicit type for textarea
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProduct(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                        <Label htmlFor="audience">Target Audience</Label>
                        <Input
                            id="audience"
                            placeholder="e.g., University students and young professionals"
                            value={audience}
                            // 🚨 FIX: Explicit type for input
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAudience(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : isSaved ? "Profile Saved" : "Save Profile"}
                    </Button>
                    
                    {isSaved && (
                        <p className="text-sm text-center text-green-600">
                            ✅ Profile saved successfully!
                        </p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
