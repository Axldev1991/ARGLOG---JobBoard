import { protectAdminRoute } from "@/lib/auth-guard";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // 🛡️ SEGURIDAD: Verifica permiso de Admin antes de renderizar NADA.
    // Si falla, redirige dentro de la función.
    await protectAdminRoute();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Aquí podríamos poner un sidebar o header exclusivo de admin */}
            {children}
        </div>
    );
}
