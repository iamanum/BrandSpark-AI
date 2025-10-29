// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // <- YAHAN IMPORT KAREIN

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BrandSpark AI",
  description: "AI Marketing Content Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* <- YAHAN WRAP KAREIN */}
          {children}
        </AuthProvider> {/* <- YAHAN WRAP KAREIN */}
      </body>
    </html>
  );
}