"use client";

import { useState } from "react";

type Tag = {
    id: number;
    name: string;
    type: string;
};

interface Props {
    availableTags: Tag[];
}

export function TagSelector({ availableTags }: Props) {


    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const toggleTag = (id: number) => {
        if (selectedIds.includes(id)) {
            // Si ya está, lo filtramos (lo quitamos)
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            // Si no está, lo agregamos al array existente
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <div className="border p-4 rounded-lg bg-gray-50 mt-4">
            <label className="block text-sm font-medium mb-3">🏷️ Selecciona Skills Requeridos:</label>

            <input type="hidden" name="tags" value={JSON.stringify(selectedIds)} />

            <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                    const isSelected = selectedIds.includes(tag.id);
                    return (
                        <button
                            onClick={() => toggleTag(tag.id)}
                            key={tag.id}
                            type="button"
                            className={`border px-3 py-1 rounded-full text-sm transition-all ${isSelected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                                }`}
                        >
                            {tag.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}