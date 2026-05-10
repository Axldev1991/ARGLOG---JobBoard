import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "./lenis.css";
import { Navbar } from "@/components/shared/navbar";
import { DevTools } from "@/components/shared/dev-tools";
import { Toaster } from "sonner";
import { isMaintenanceMode } from "@/lib/system";
import MaintenanceScreen from "@/components/shared/maintenance-screen";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

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
  const session = await getSession();

  // Solo mostramos DevTools si el usuario existe y su rol real en DB es 'dev'
  // Esto permite que el martillo siga visible incluso si está impersonando a otro rol
  let isDev = false;
  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { role: true }
    });
    isDev = user?.role === 'dev';
  }

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
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          themes={["light"]}
          disableTransitionOnChange
        >
          <SmoothScroll>
            <Navbar />
            {children}
            {isDev && <DevTools />}
            <Toaster position="top-center" richColors />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
