import { protectAdminRoute } from "@/lib/auth-guard";
import { Sidebar } from "@/components/dashboard/sidebar";
import { getSession } from "@/lib/session";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // 🛡️ SEGURIDAD: Verifica permiso de Admin antes de renderizar NADA.
    await protectAdminRoute();
    const session = await getSession();

    return (
        <div className="flex min-h-[calc(100vh-64px)] relative">
            <Sidebar role={session?.role || 'admin'} />
            <main className="flex-1 md:ml-[var(--sidebar-width,256px)] p-4 md:p-8 bg-slate-50/50 dark:bg-transparent transition-all duration-300 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
