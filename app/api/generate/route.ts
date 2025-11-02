// ✅ app/api/generate/route.ts

import OpenAI from "openai";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Initialize OpenAI with the API key from .env.local
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    // Parse the JSON body
    const { userId, contentType } = await req.json();

    if (!userId || !contentType) {
      return new Response(
        JSON.stringify({ error: "Missing userId or contentType" }),
        { status: 400 }
      );
    }

    // ✅ Ensure Firestore is available
    if (!db) {
      return new Response(
        JSON.stringify({
          error:
            "Database not initialized. Check your Firebase configuration or Vercel environment variables.",
        }),
        { status: 500 }
      );
    }

    // 1️⃣ Fetch company profile from Firestore
    const profileRef = doc(db, "profiles", userId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      return new Response(
        JSON.stringify({
          error: "Company profile not found in Firestore for this user.",
        }),
        { status: 404 }
      );
    }

    const profile = profileSnap.data();

    // 2️⃣ Smart prompt engineering
    const smartPrompt = `
You are BrandSpark AI — an elite AI marketing assistant that creates high-converting content for small businesses.

Client Profile:
- Company Name: "${profile.companyName}"
- Product/Service: "${profile.product}"
- Target Audience: "${profile.audience}"

Task:
Generate ${contentType} content that feels fresh, engaging, and ready for social media.

Deliver exactly 3 posts in this format:
1. Caption (1-2 sentences)
   Hashtags: #hashtag1 #hashtag2 #hashtag3
2. Caption
   Hashtags: ...
3. Caption
   Hashtags: ...

Tone: Smart, creative, and exciting (think: top-tier digital marketing agency vibes).
    `;

    // 3️⃣ Send request to OpenAI
    const completion = await openai.chat.completions.create({
     model: "gpt-4o-mini", // ✅ Updated model
      messages: [{ role: "user", content: smartPrompt }],
      temperature: 0.8,
      max_tokens: 600,
    });

    const aiContent = completion.choices[0]?.message?.content || "No content generated.";

    // 4️⃣ Return to frontend
    return new Response(JSON.stringify({ content: aiContent }), { status: 200 });
  } catch (error: any) {
    console.error("🔥 AI Generation Error:", error);
    return new Response(
      JSON.stringify({
        error:
          error.message ||
          "AI generation failed due to a server or API issue. Please try again.",
      }),
      { status: 500 }
    );
  }
}
