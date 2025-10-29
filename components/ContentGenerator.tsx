// components/ContentGenerator.tsx - FINAL VERSION

"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Select Component ke saare parts zaroori hain
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ContentGeneratorProps {
    userId: string;
}

export default function ContentGenerator({ userId }: ContentGeneratorProps) {
    const [contentType, setContentType] = useState('Instagram Post');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        setResult(null);

        // Optional: Check if profile is saved before generation
        // Hum assume kar rahe hain ke profile data is step tak save ho chuka hai.

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Backend ko data bhej rahe hain
                body: JSON.stringify({ userId, contentType }), 
            });

            const data = await response.json();

            if (!response.ok) {
                setResult(`Error: ${data.error || 'Could not connect to AI service.'}`);
            } else {
                setResult(data.content);
            }

        } catch (error) {
            setResult("A critical network error occurred. Check your network or server logs.");
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="text-xl">Generate Marketing Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Content Type Selector */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="contentType">Select Content Type</label>
                    <Select value={contentType} onValueChange={setContentType} disabled={loading}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Instagram Post">Instagram Post</SelectItem>
                            <SelectItem value="Twitter Post">Twitter Post (Tweet)</SelectItem>
                            <SelectItem value="Facebook Ad Copy">Facebook Ad Copy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                {/* Generate Button */}
                <Button onClick={handleGenerate} className="w-full" disabled={loading}>
                    {loading ? "Generating Magic..." : `Generate ${contentType}`}
                </Button>

                {/* Result Display */}
                {result && (
                    <div className="space-y-2">
                        <label>AI Generated Results</label>
                        <Textarea
                            readOnly
                            value={result}
                            rows={15}
                            className={`min-h-[300px] ${result.startsWith('Error') ? 'border-red-500' : 'border-green-500'}`}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}