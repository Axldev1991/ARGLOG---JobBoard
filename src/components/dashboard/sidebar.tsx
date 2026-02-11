"use client"

import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
    User,
    Briefcase,
    Building2,
    Users,
    Tags,
    Search,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SidebarProps {
    role: string;
}

export function Sidebar({ role }: SidebarProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Sincronizamos el ancho del sidebar con el resto de la app vía CSS Variable
    useEffect(() => {
        const width = isCollapsed ? '80px' : '256px';
        document.documentElement.style.setProperty('--sidebar-width', width);
    }, [isCollapsed]);

    // Definición de ítems de navegación por rol
    const navigationByRole: Record<string, any[]> = {
        admin: [
            { label: "Empresas", icon: Building2, view: "companies", color: "text-blue-500" },
            { label: "Candidatos", icon: Users, view: "candidates", color: "text-purple-500" },
            { label: "Habilidades", icon: Tags, view: "tags", color: "text-green-500" },
            { label: "Ofertas", icon: Briefcase, view: "jobs", color: "text-orange-500" },
        ],
        candidate: [
            { label: "Mi Perfil", icon: User, tab: "profile", color: "text-blue-500" },
            { label: "Postulaciones", icon: Briefcase, tab: "applications", color: "text-emerald-500" },
        ],
        company: [
            { label: "Mis Ofertas", icon: Briefcase, tab: "jobs", color: "text-primary" },
            { label: "Perfil Empresa", icon: Building2, tab: "profile", color: "text-indigo-500" },
        ]
    };

    const items = navigationByRole[role] || [];
    const activeView = searchParams.get('view');
    const activeTab = searchParams.get('tab');

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 h-[calc(100vh-64px)] bg-card border-r transition-all duration-300 z-40 hidden md:block",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex flex-col h-full p-4 relative">

                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-4 bg-background border rounded-full p-1 shadow-sm hover:bg-accent transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <div className="space-y-2">
                    {items.map((item) => {
                        const isActive = item.view
                            ? activeView === item.view
                            : (activeTab === item.tab || (!activeTab && item.tab === navigationByRole[role][0].tab));

                        const href = role === 'admin'
                            ? `/admin/dashboard?view=${item.view}`
                            : `/dashboard?tab=${item.tab}`;

                        return (
                            <Link
                                key={item.label}
                                href={href}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-all group",
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold ring-1 ring-primary/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn(
                                    "shrink-0 transition-colors",
                                    isActive ? item.color : "group-hover:text-foreground"
                                )} size={20} />

                                {!isCollapsed && (
                                    <span className="animate-in slide-in-from-left-2 duration-300">
                                        {item.label}
                                    </span>
                                )}

                                {isActive && !isCollapsed && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
