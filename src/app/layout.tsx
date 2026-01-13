import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { DevTools } from "@/components/shared/dev-tools";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ArLog Jobs | El Hub del Talento Logístico",
  description: "Conectamos a las empresas líderes con los profesionales que mueven el mundo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${outfit.variable} font-sans antialiased bg-gray-50`}
      >
        <Navbar />
        {children}
        <DevTools />
      </body>
    </html>
  );
}
