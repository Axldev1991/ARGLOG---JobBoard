"use client"

interface TagPillProps {
    label: string;
    selected: boolean;
    onClick: () => void;
}

export function TagPill({ label, selected, onClick }: TagPillProps) {
    return (
        <button
            type="button" // Importante: para que no haga submit si está dentro de un form
            onClick={onClick}
            className={`
                text-xs px-3 py-1.5 rounded-full border transition-all font-medium
                ${selected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-500"
                }
            `}
        >
            {label}
        </button>
    )
}
