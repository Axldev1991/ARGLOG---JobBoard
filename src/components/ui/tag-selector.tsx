"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

type TagType = {
    id: number;
    name: string;
    type: string;
};

interface Props {
    availableTags: TagType[];
    initialSelectedIds?: number[];
}

export function TagSelector({ availableTags, initialSelectedIds = [] }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);

    const toggleTag = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <div className="w-full">
            {/* Input oculto para enviar los datos al servidor */}
            <input type="hidden" name="tags" value={JSON.stringify(selectedIds)} />

            <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                    const isSelected = selectedIds.includes(tag.id);
                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`
                                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                                ${isSelected
                                    ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] hover:bg-primary/90"
                                    : "bg-input/10 border-input text-muted-foreground hover:border-foreground/50 hover:text-foreground hover:bg-input/20"
                                }
                            `}
                        >
                            {tag.name}
                        </button>
                    );
                })}
            </div>

            {/* Mensaje de ayuda / contador */}
            <div className="mt-3 text-xs text-muted-foreground flex items-center justify-between">
                <span>Selecciona todas las que apliquen</span>
                <span>{selectedIds.length} seleccionadas</span>
            </div>
        </div>
    );
}