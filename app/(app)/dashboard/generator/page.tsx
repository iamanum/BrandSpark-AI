"use client";

import { useState } from "react";
import { OpenAI } from "openai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert("Please enter a prompt!");
    setLoading(true);
    setResult("");

    try {
      // ✅ Create OpenAI client using your API key
      const client = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true, // allows use in client-side for testing
      });

      // ✅ Generate text from OpenAI
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional AI marketing assistant." },
          { role: "user", content: prompt },
        ],
      });

      setResult(response.choices[0].message?.content || "No output");
    } catch (error) {
      console.error(error);
      alert("Error generating content. Check your API key or model.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        AI Content Generator
      </h1>

      <p className="text-gray-500 mb-6 text-center">
        Create engaging marketing copy, visuals, or posts instantly with AI.
      </p>

      <div className="space-y-4">
        <Input
          placeholder="Enter a topic or campaign idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border-gray-300"
        />

        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {loading ? "Generating..." : "Generate Content"}
        </Button>

        {result && (
          <Textarea
            value={result}
            readOnly
            className="mt-4 h-60 border-gray-300 bg-gray-50"
          />
        )}
      </div>
    </div>
  );
}
