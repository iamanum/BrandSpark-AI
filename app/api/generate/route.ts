// app/api/generate/route.ts

import { OpenAI } from 'openai';
import { db } from '@/lib/firebase'; // Firestore database
import { doc, getDoc } from 'firebase/firestore';

// OpenAI Client ko initialize karein (Key .env.local se uth jayegi)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST request ko handle karein
export async function POST(request: Request) {
    try {
        // 🚨 FINAL FIX: Check karein ke db object mojood hai ya nahi
        if (!db) {
            return new Response(JSON.stringify({ error: 'Database service is unavailable during build. Please check Vercel environment variables.' }), { status: 500 });
        }

        const { userId, contentType } = await request.json();

        if (!userId || !contentType) {
            return new Response(JSON.stringify({ error: 'Missing user or content type' }), { status: 400 });
        }

        // 1. User ki Company Profile Firestore se fetch karein
        const profileDoc = await getDoc(doc(db, 'profiles', userId));
        if (!profileDoc.exists()) {
            return new Response(JSON.stringify({ error: 'Company profile not found in database.' }), { status: 404 });
        }
        const profile = profileDoc.data();

        // 2. Prompt Engineering (Aap ka Smart Prompt)
        const smartPrompt = `
            You are an expert marketing copywriter for small businesses. Your task is to generate ${contentType} content.
            The company name is "${profile.companyName}".
            They sell the following product/service: "${profile.product}".
            Their target audience is: "${profile.audience}".
            
            Based on this profile, generate 3 unique, engaging, and ready-to-use marketing posts.
            
            Tone: Fun, energetic, and professional.
            Output Format: For each post, provide a compelling caption followed by 3 relevant, popular hashtags. Number the posts clearly (1., 2., 3.).
        `;

        // 3. OpenAI ko call karein
        const response = await openai.chat.completions.create({
            // 🚀 UPGRADE: Humne model ko gpt-4o-mini se badal diya hai
            model: 'gpt-4o-mini', 
            messages: [{ role: 'user', content: smartPrompt }],
            n: 1,
            max_tokens: 400, // Aap isay 500-600 bhi kar sakti hain agar content lamba chahiye
            temperature: 0.7, 
        });

        // 4. Result ko Frontend ko wapis bhej dein
        const content = response.choices[0].message.content;
        return new Response(JSON.stringify({ content }), { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'AI generation failed due to an internal error.' }), { status: 500 });
    }
}

