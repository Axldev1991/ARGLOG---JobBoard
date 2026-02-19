"use client";

import { useState } from "react";
import { Check, ChevronDown, Rocket, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type TagType = {
    id: number;
    name: string;
    type: string;
};

interface Props {
    availableTags: TagType[];
    initialSelectedIds?: number[];
}

export function SkillSelectorSet({ availableTags, initialSelectedIds = [] }: Props) {
    const [s1, setS1] = useState<string>(initialSelectedIds[0]?.toString() || "");
    const [s2, setS2] = useState<string>(initialSelectedIds[1]?.toString() || "");
    const [s3, setS3] = useState<string>(initialSelectedIds[2]?.toString() || "");

    const selectedIds = [s1, s2, s3].filter(id => id !== "").map(Number);

    const renderSelect = (
        value: string,
        onChange: (val: string) => void,
        label: string,
        Icon: any,
        colorClass: string
    ) => {
        return (
            <div className="flex-1 space-y-2">
                <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2 ml-1">
                    <Icon size={12} className={colorClass} />
                    {label}
                </label>
                <div className="relative group">
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn(
                            "w-full h-12 pl-4 pr-10 bg-background border-2 rounded-xl text-sm appearance-none outline-none transition-all cursor-pointer",
                            value
                                ? "border-primary/30 bg-primary/5 text-foreground font-semibold"
                                : "border-muted group-hover:border-primary/20 text-muted-foreground"
                        )}
                    >
                        <option value="">Selecciona una habilidad...</option>
                        {availableTags.map((tag) => (
                            <option
                                key={tag.id}
                                value={tag.id}
                                disabled={tag.id.toString() !== value && (s1 === tag.id.toString() || s2 === tag.id.toString() || s3 === tag.id.toString())}
                            >
                                {tag.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:rotate-180 transition-transform"
                        size={18}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full space-y-6">
            <input type="hidden" name="tags" value={JSON.stringify(selectedIds)} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSelect(s1, setS1, "Habilidad Principal", Rocket, "text-orange-500")}
                {renderSelect(s2, setS2, "Habilidad Secundaria", Target, "text-blue-500")}
                {renderSelect(s3, setS3, "Habilidad Complementaria", Zap, "text-purple-500")}
            </div>

            {selectedIds.length < 3 && (
                <p className="text-[11px] text-amber-600 dark:text-amber-500 font-medium bg-amber-50 dark:bg-amber-500/10 p-2 rounded-lg border border-amber-200/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Te recomendamos completar las 3 habilidades para mejorar tu visibilidad ante empresas.
                </p>
            )}
        </div>
    );
}
