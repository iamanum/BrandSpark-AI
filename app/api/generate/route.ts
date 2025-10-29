// app/api/generate/route.ts - MOCK VERSION (Bina Billing Ke)

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
// NOTE: Humne 'openai' import ko hata diya hai

// Yahan woh sample data hai jo user ko nazar aayega
const MOCK_AI_RESPONSE = (company: string, product: string, audience: string) => `
**🎉 Post 1: Energy Boost!**

Need a study break or a professional start? ${company} has the perfect freshly brewed coffee waiting. Fuel your focus and grab a bakery item!

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

        // 1. User ki Company Profile Firestore se fetch karein
        const profileDoc = await getDoc(doc(db, 'profiles', userId));
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