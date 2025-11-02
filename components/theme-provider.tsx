"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * ThemeProvider wrapper for next-themes
 * ✅ Fully typed using React.ComponentProps
 * ✅ Supports Tailwind dark mode (class strategy)
 * ✅ Supports system theme preference
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"      // Tailwind CSS dark mode (darkMode: "class")
      defaultTheme="light"    // Default theme if user has no preference
      enableSystem={true}     // Use OS system theme if available
      {...props}              // Spread any extra props
    >
      {children}
    </NextThemesProvider>
  );
}
