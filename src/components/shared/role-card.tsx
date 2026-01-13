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
        ? "hover:border-blue-500/50 group-hover:bg-blue-500 bg-blue-600 hover:bg-blue-700"
        : "hover:border-emerald-500/50 group-hover:bg-emerald-500 bg-emerald-600 hover:bg-emerald-700";

    // Extraemos solo la parte del borde para el contenedor
    const borderClass = borderColor === "blue" ? "hover:border-blue-500/50" : "hover:border-emerald-500/50";
    // Extraemos solo la parte del bg para el icono
    const iconBgClass = borderColor === "blue" ? "group-hover:bg-blue-500" : "group-hover:bg-emerald-500";
    // Extraemos solo la parte del botón
    const btnClass = borderColor === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700";


    return (
        <div className={`bg-slate-800/50 p-8 rounded-2xl border border-slate-700 transition-colors group flex flex-col h-full ${borderClass}`}>
            <div className={`w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mb-4 text-white transition-colors ${iconBgClass}`}>
                {icon}
            </div>

            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-slate-400 text-sm mb-6">{description}</p>

            <div className="grid grid-cols-2 gap-4 mt-auto">
                {/* Botón Primario (puede ser Link o Botón normal) */}
                {primaryAction.href ? (
                    <Link href={primaryAction.href} className="w-full">
                        <Button className={`w-full font-bold h-12 text-white ${btnClass}`}>
                            {primaryAction.label}
                        </Button>
                    </Link>
                ) : (
                    <Button className={`w-full font-bold h-12 text-white ${btnClass}`} onClick={primaryAction.onClick}>
                        {primaryAction.label}
                    </Button>
                )}

                {/* Botón Secundario (Siempre Link Outline) */}
                <Link href={secondaryAction.href} className="w-full">
                    <Button variant="outline" className="w-full h-12 border-slate-600 bg-white text-slate-900 hover:bg-slate-100 font-bold">
                        {secondaryAction.label}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
