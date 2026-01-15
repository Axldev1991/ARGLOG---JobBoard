import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";
import { DevTools } from "@/components/shared/dev-tools";
import { Toaster } from "sonner";
import { isMaintenanceMode } from "@/lib/system";
import MaintenanceScreen from "@/components/shared/maintenance-screen";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "ArLog Jobs | El Hub del Talento Logístico",
  description: "Conectamos a las empresas líderes con los profesionales que mueven el mundo.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMaintenance = await isMaintenanceMode();

  if (isMaintenance) {
    return (
      <html lang="es" suppressHydrationWarning>
        <body className={outfit.className}>
          <MaintenanceScreen />
        </body>
      </html>
    );
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-gray-50`}
      >
        <Navbar />
        {children}
        <DevTools />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
