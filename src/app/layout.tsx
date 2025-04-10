import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PapaParseScript from "../components/PapaParseScript";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Process Mining Dashboard",
  description: "Interactive dashboard for process mining analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PapaParseScript />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  );
}
