import { OpenAI } from 'openai';
import { db } from '@/lib/firebase'; // Firestore database
import { doc, getDoc } from 'firebase/firestore';

// OpenAI Client ko initialize karein (Key .env.local se uth jayegi)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Yeh function POST request ko handle karega (jab user button dabayega)
export async function POST(request: Request) {
    try {
        const { userId, contentType } = await request.json();

        // 🚨 FINAL FIX 1: Db check for Vercel deployment
        if (!db) {
            return new Response(JSON.stringify({ error: 'Database service is unavailable. Check Vercel environment variables.' }), { status: 500 });
        }

        if (!userId || !contentType) {
            return new Response(JSON.stringify({ error: 'Missing user or content type' }), { status: 400 });
        }

        // 1. User ki Company Profile Firestore se fetch karein
        const profileDoc = await getDoc(doc(db, 'profiles', userId));
        if (!profileDoc.exists()) {
            return new Response(JSON.stringify({ error: 'Company profile not found in database.' }), { status: 404 });
        }
        const profile = profileDoc.data();

        // 2. Prompt Engineering (The Smart Prompt)
        const smartPrompt = `
            You are an expert marketing copywriter for small businesses. Your task is to generate 3 unique and engaging ${contentType} posts.
            The company name is "${profile.companyName}".
            They sell the following product/service: "${profile.product}".
            Their target audience is: "${profile.audience}".
            
            Tone: Fun, energetic, and highly professional. Ensure the content is tailored specifically to ${profile.audience}.
            Output Format: For each post, provide a compelling caption followed by 3 relevant, popular hashtags. Number the posts clearly (1., 2., 3.).
        `;

        // 3. OpenAI ko call karein (Real API)
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo', // Stable aur affordable model
            messages: [{ role: 'user', content: smartPrompt }],
            n: 1,
            max_tokens: 400,
            temperature: 0.7, // Thora creative response ke liye
        });

        // 4. Result ko Frontend ko wapis bhej dein
        const content = response.choices[0].message.content;
        return new Response(JSON.stringify({ content }), { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        // Is error ko generic rakhenge taake production keys leak na hon
        return new Response(JSON.stringify({ error: 'AI generation failed due to an external service error.' }), { status: 500 });
    }
}
