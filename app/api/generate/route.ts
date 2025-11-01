// app/api/generate/route.ts - FINAL VERSION

import { db } from '@/lib/firebase'; // Firestore database
import { doc, getDoc } from 'firebase/firestore';

// NOTE: Humne 'openai' import ko yahan hata diya hai kyunke hum mock data use kar rahe hain.
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Commented out for Mock

// Yahan woh sample data hai jo user ko nazar aayega
const MOCK_AI_RESPONSE = (company: string, product: string, audience: string) => `
**🎉 Post 1: Energy Boost for ${audience}!**

Need a study break or a professional start? ${company} has the perfect freshly brewed coffee waiting. Fuel your focus and grab a bakery item!

#${company.replace(/\s/g, '')} #StudentFuel #ProfessionalVibes

---

**☕ Post 2: Treat Yourself Today**

Exams ho ya deadlines, you deserve a delicious reward! Our artisan bakery items are baked fresh daily. Perfect pairing with your favorite ${product}.
Tag a friend who needs this right now!

#ArtisanBake #CoffeeTime #SweetEscape

---

**🔥 Post 3: Location, Location, Location!**

Right near campus/office, we're your go-to spot. Fast WiFi, great music, and the best service. Skip the line, grab your ${product} and get going! This content is specially tailored for ${audience}.

#LocalCoffeeShop #UniLife #WorkHardPlayHard
`;


export async function POST(request: Request) {
    // 🚨 FINAL FIX: Db check for API route
    if (!db) {
        return new Response(JSON.stringify({ 
            error: 'Database service is unavailable during build. Please check Vercel environment variables.' 
        }), { status: 500 });
    }

    try {
        const { userId, contentType } = await request.json();

        if (!userId || !contentType) {
            return new Response(JSON.stringify({ error: 'Missing user or content type' }), { status: 400 });
        }

        // 1. User ki Company Profile Firestore se fetch karein
        // NOTE: db! use nahi kiya kyunke humne shuru mein if (!db) check laga diya hai
        const profileDoc = await getDoc(doc(db, 'profiles', userId)); 
        if (!profileDoc.exists()) {
            return new Response(JSON.stringify({ error: 'Company profile not found in database.' }), { status: 404 });
        }
        const profile = profileDoc.data();

        // 2. Mock Prompt Engineering (The Smart Prompt)
        const mockContent = MOCK_AI_RESPONSE(
            profile.companyName, 
            profile.product, 
            profile.audience
        );

        // Chota sa delay (5 seconds) taake asli AI ki feeling aaye
        await new Promise(resolve => setTimeout(resolve, 5000)); 


        // 3. Result ko Frontend ko wapis bhej dein
        return new Response(JSON.stringify({ content: mockContent }), { status: 200 });
    } catch (error) {
        console.error('MOCK API Error:', error);
        return new Response(JSON.stringify({ error: 'AI generation failed due to an internal error. Check Firestore rules.' }), { status: 500 });
    }
}
