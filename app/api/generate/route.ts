import { OpenAI } from 'openai';
import { db } from '@/lib/firebase'; // Firestore database
import { doc, getDoc } from 'firebase/firestore';

// OpenAI Client ko initialize karein (Key .env.local se uth jayegi)
// NOTE: Is code ko sirf server-side (API route) par chalana zaroori hai
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST request ko handle karein
export async function POST(request: Request) {
    try {
        const { userId, contentType } = await request.json();

        // Security and validation checks
        if (!userId || !contentType) {
            return new Response(JSON.stringify({ error: 'Missing user ID or content type.' }), { status: 400 });
        }
        
        // Final DB Null Check
        if (!db) {
            return new Response(JSON.stringify({ error: 'Database service is unavailable during build. Please check Vercel environment variables.' }), { status: 500 });
        }
        
        // 1. User ki Company Profile Firestore se fetch karein
        const profileDoc = await getDoc(doc(db, 'profiles', userId));
        if (!profileDoc.exists()) {
            return new Response(JSON.stringify({ error: 'Company profile not found in database. Please save your profile first.' }), { status: 404 });
        }
        const profile = profileDoc.data();

        // 2. Prompt Engineering (The Smart Prompt)
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
            model: 'gpt-3.5-turbo', // Cost-effective model for copywriting
            messages: [{ role: 'user', content: smartPrompt }],
            n: 1,
            max_tokens: 400,
            temperature: 0.7, // Creativity level
        });

        // 4. Result ko Frontend ko wapis bhej dein
        const content = response.choices[0].message.content;
        return new Response(JSON.stringify({ content }), { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        // Ensure the response is always JSON, even on failure
        return new Response(JSON.stringify({ error: 'AI generation failed due to an external service error (check OpenAI billing).' }), { status: 500 });
    }
}
