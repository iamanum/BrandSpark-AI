"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * A wrapper for next-themes ThemeProvider
 * Fully typed using React.ComponentProps
 * Supports Tailwind CSS dark mode (class strategy)
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"      // Required for Tailwind dark mode (darkMode: "class")
      defaultTheme="light"    // Default theme when no preference is set
      enableSystem={true}     // Set true if you want to respect user's OS theme
      {...props}              // Spread any extra props you pass
    >
      {children}
    </NextThemesProvider>
  );
}
