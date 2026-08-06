import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UZEE TECH ScreenGuard Finder | Internal Compatibility Search",
  description:
    "Internal search tool for UZEE TECH employees to quickly look up phone models and find matching screen protector box numbers and compatible model groups.",
  icons: {
    icon: "/uzee_tech_official_logo.png",
    apple: "/uzee_tech_official_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-brand-700 selection:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
