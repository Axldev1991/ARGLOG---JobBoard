
import { getSession } from "@/lib/session";
import { Sidebar } from "@/components/dashboard/sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) redirect("/login");

    return (
        <div className="flex min-h-[calc(100vh-64px)] relative">
            <Sidebar role={session.role} />
            <main className="flex-1 md:ml-[var(--sidebar-width,256px)] p-4 md:p-8 bg-slate-50/50 dark:bg-transparent transition-all duration-300 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
