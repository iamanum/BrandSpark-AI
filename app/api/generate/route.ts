// app/api/generate/route.ts - FINAL MOCK VERSION

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// NOTE: Humne 'openai' import ko hata diya hai kyunki hum Mock data use kar rahe hain

// Yahan woh sample data hai jo user ko nazar aayega
const MOCK_AI_RESPONSE = (company: string, product: string, audience: string) => `
**🎉 Post 1: Fueling ${audience} with ${company}**

Need a study break or a professional start? ${company} knows ${audience} need premium fuel. Our coffee is waiting! Fuel your focus and grab a bakery item!

#${company.replace(/\s/g, '')} #StudentFuel #ProfessionalVibes

---

**☕ Post 2: Treat Yourself Today**

Exams ho ya deadlines, you deserve a delicious reward! Our artisan bakery items are baked fresh daily. Perfect pairing with your favorite ${product}
Tag a friend who needs this right now!

#ArtisanBake #CoffeeTime #SweetEscape

---

**🔥 Post 3: Location, Location, Location!**

Right near campus/office, we're your go-to spot. Fast WiFi, great music, and the best service. Skip the line, grab your ${product} and get going!

#LocalCoffeeShop #UniLife #WorkHardPlayHard
`;


export async function POST(request: Request) {
    try {
        const { userId, contentType } = await request.json();

        if (!userId || !contentType) {
            return new Response(JSON.stringify({ error: 'Missing user or content type' }), { status: 400 });
        }
        
        // 🚨 FINAL FIX: Check karein ke DB object available hai
        if (!db) {
            return new Response(JSON.stringify({ error: 'Database service is unavailable.' }), { status: 503 });
        }

        // 1. User ki Company Profile Firestore se fetch karein
        const profileDoc = await getDoc(doc(db, 'profiles', userId)); // <-- Ab yeh line theek hai!
        if (!profileDoc.exists()) {
            return new Response(JSON.stringify({ error: 'Company profile not found in database.' }), { status: 404 });
        }
        const profile = profileDoc.data();

        // 2. YAHAN HUM ASLI AI CALL KI BAJAYE MOCK RESPONSE BHEJ RAHE HAIN
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
        return new Response(JSON.stringify({ error: 'MOCK generation failed due to an internal error.' }), { status: 500 });
    }
}
