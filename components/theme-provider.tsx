"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Use React.ComponentProps to infer the props instead of importing ThemeProviderProps
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"  // Tailwind CSS dark mode
      defaultTheme="light"
      enableSystem={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
