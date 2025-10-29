// app/page.tsx - FINAL CODE FOR REDIRECT

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Jab bhi koi user root URL (/) par aayega, toh woh seedha /signup par chala jayega
  redirect('/signup');
}