import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
