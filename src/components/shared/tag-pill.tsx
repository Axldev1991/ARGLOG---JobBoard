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
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                }
            `}
        >
            {label}
        </button>
    )
}
