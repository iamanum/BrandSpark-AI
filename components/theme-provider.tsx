"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class" // Tailwind CSS (darkMode: "class") ke liye zaroori
      defaultTheme="light" // Default theme
      enableSystem={false} // OS ki setting nahi, user ki setting
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
