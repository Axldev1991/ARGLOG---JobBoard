import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RoleCardProps {
    title: string;
    icon: string;
    description: string;
    primaryAction: {
        label: string;
        onClick?: () => void; // Por si es acción
        href?: string;        // Por si es link
    };
    secondaryAction: {
        label: string;
        href: string;         // Asumimos que el secundario suele ser link
    };
    borderColor: "emerald" | "blue"; // Para personalizar el hover
}

export function RoleCard({
    title,
    icon,
    description,
    primaryAction,
    secondaryAction,
    borderColor
}: RoleCardProps) {

    // Mapeo de colores según la prop
    const colorClasses = borderColor === "blue"
        ? "hover:border-primary/50 group-hover:bg-primary bg-primary/90 hover:bg-primary"
        : "hover:border-emerald-500/50 group-hover:bg-emerald-500 bg-emerald-600 hover:bg-emerald-700";

    // Extraemos solo la parte del borde para el contenedor
    const borderClass = borderColor === "blue" ? "hover:border-primary/50" : "hover:border-emerald-500/50";
    // Extraemos solo la parte del bg para el icono
    const iconBgClass = borderColor === "blue" ? "group-hover:bg-primary" : "group-hover:bg-emerald-500";
    // Extraemos solo la parte del botón primario con efectos skeuomorficos, 3D y profundidad visual (Solo para luz)
    const btnClass = borderColor === "blue"
        ? "bg-gradient-to-b from-primary via-primary to-blue-800 shadow-[0_4px_0_0_#1e3a8a,0_10px_20px_-5px_rgba(var(--primary),0.4),inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-2px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_#1e3a8a,0_15px_30px_-5px_rgba(var(--primary),0.5)] active:shadow-[0_2px_0_0_#1e3a8a] ring-1 ring-primary/10 dark:bg-primary dark:from-primary dark:to-primary dark:shadow-none dark:ring-0 dark:text-blue-900"
        : "bg-gradient-to-b from-emerald-500 via-emerald-500 to-emerald-800 shadow-[0_4px_0_0_#047857,0_10px_20px_-5px_rgba(16,185,129,0.4),inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-2px_0_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_0_0_#047857,0_15px_30px_-5px_rgba(16,185,129,0.5)] active:shadow-[0_2px_0_0_#047857] ring-1 ring-emerald-500/10 dark:bg-emerald-600 dark:from-emerald-600 dark:to-emerald-600 dark:shadow-none dark:ring-0 dark:text-emerald-950";


    return (
        <div className={`bg-card/40 backdrop-blur-[var(--glass-blur)] border-[var(--glass-border)] p-8 rounded-3xl transition-all duration-300 group flex flex-col h-full ${borderClass} shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:bg-card dark:backdrop-blur-none dark:rounded-2xl dark:border-border`}>
            <div className={`w-12 h-12 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 transition-all duration-500 ${iconBgClass} group-hover:text-primary-foreground text-muted-foreground shadow-sm group-hover:scale-110 group-hover:rotate-3 dark:bg-muted`}>
                <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
            </div>

            <h3 className="text-xl font-black mb-3 text-foreground tracking-tight uppercase dark:font-bold">{title}</h3>
            <p className="text-muted-foreground text-sm mb-8 font-medium leading-relaxed">{description}</p>

            <div className="grid grid-cols-2 gap-4 mt-auto">
                {/* Botón Primario (puede ser Link o Botón normal) */}
                {primaryAction.href ? (
                    <Link href={primaryAction.href} className="w-full">
                        <Button className={`w-full font-black h-12 rounded-xl transition-all active:translate-y-[2px] active:scale-[0.98] hover:-translate-y-[2px] ${btnClass} text-white relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:h-1/2 dark:before:hidden dark:active:translate-y-0 dark:hover:translate-y-0 dark:font-bold`}>
                            <span className="relative z-10">{primaryAction.label}</span>
                        </Button>
                    </Link>
                ) : (
                    <Button className={`w-full font-black h-12 rounded-xl transition-all active:translate-y-[2px] active:scale-[0.98] hover:-translate-y-[2px] ${btnClass} text-white relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:h-1/2 dark:before:hidden dark:active:translate-y-0 dark:hover:translate-y-0 dark:font-bold`} onClick={primaryAction.onClick}>
                        <span className="relative z-10">{primaryAction.label}</span>
                    </Button>
                )}

                {/* Botón Secundario (Siempre Link Outline) */}
                <Link href={secondaryAction.href} className="w-full">
                    <Button variant="outline" className="w-full h-12 font-bold rounded-xl transition-all border-primary/20 hover:bg-primary/5 hover:text-primary active:scale-95 active:translate-y-[1px] dark:border-border dark:hover:bg-accent">
                        {secondaryAction.label}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
