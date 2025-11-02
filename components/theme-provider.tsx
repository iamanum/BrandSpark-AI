// components/theme-provider.tsx
"use client";

import * as React from "react";
// 🎨 15+ YR EXPERT FIX: Hum props ko seedha 'next-themes' se import kar rahe hain
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class" // <-- Yeh Tailwind CSS (darkMode: "class") ke liye zaroori hai
      defaultTheme="light" // Default theme set kar rahe hain
      enableSystem={false} // Hum OS ki setting nahi, user ki setting istemal karenge
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

