"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ContentGenerator() {
  const { user } = useAuth();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleGenerate = async () => {
    if (!content.trim()) return alert("Please enter your post idea or topic.");
    if (!user) return alert("You must be logged in to generate content.");

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, uid: user.uid }),
      });

      if (!res.ok) throw new Error("Failed to generate content");

      const data = await res.json();
      setResult(data.text);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-white/90 to-gray-50 dark:from-slate-900/90 dark:to-slate-800/90 shadow-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.6)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          <Sparkles className="h-6 w-6 text-sky-500" />
          AI Content Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Generate creative marketing content using your company profile.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe your product, campaign, or topic (e.g. 'Instagram post for our new cold brew coffee')"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="resize-none border-2 border-slate-200 focus:border-sky-400 dark:border-slate-700 dark:focus:border-sky-500 transition-all"
          rows={4}
        />

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg rounded-xl transition-transform duration-200 hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" /> Generate AI Content
            </>
          )}
        </Button>

        {result && (
          <div className="mt-6 p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-inner animate-fadeIn">
            <h3 className="font-semibold mb-2 text-slate-800 dark:text-slate-100">
              ✨ Generated Content:
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {result}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
