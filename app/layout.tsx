import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider"; // ✅ Add this import

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Ensure title always renders */}
        <title>{metadata.title?.toString() ?? "BrandSpark AI"}</title>
        <meta
          name="description"
          content={metadata.description ?? "AI Marketing Content Generator"}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.className} bg-gradient-to-br from-background to-secondary min-h-screen`}
      >
        {/* ✅ Wrap everything in ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange
        >
          {/* ✅ AuthProvider remains inside */}
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
