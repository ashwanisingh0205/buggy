import type { Metadata } from "next";
import "./globals.css";
import { PerformanceDebugger } from "@/Components/PerformanceDebugger";

export const metadata: Metadata = {
  title: "Bloocube",
  description: "A social media workspace powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <PerformanceDebugger />}
      </body>
    </html>
  );
}
