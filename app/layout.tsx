import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Mindset Forum",
  description: "A modern serverless forum built with Next.js and AWS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}