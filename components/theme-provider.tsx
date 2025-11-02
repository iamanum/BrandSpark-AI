// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// 🎨 15+ YR EXPERT FIX: 
// Humne import path ko 'next-themes/dist/types' se badal kar 'next-themes' kar diya hai.
// Yeh naya path zyada robust hai aur Vercel build server par aasani se mil jata hai.
import { type ThemeProviderProps } from "next-themes"; 

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

