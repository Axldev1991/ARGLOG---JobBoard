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
}

export function TagSelector({ availableTags }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
                                    ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:bg-blue-500"
                                    : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800"
                                }
                            `}
                        >
                            {tag.name}
                        </button>
                    );
                })}
            </div>

            {/* Mensaje de ayuda / contador */}
            <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
                <span>Selecciona todas las que apliquen</span>
                <span>{selectedIds.length} seleccionadas</span>
            </div>
        </div>
    );
}