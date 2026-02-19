import { useState, useMemo } from "react";
import { Tag, Search, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type TagType = {
    id: number;
    name: string;
    type: string;
};

interface Props {
    availableTags: TagType[];
    initialSelectedIds?: number[];
    maxSelected?: number;
    onChange?: (selectedIds: number[]) => void;
    placeholder?: string;
}

export function TagSelector({
    availableTags,
    initialSelectedIds = [],
    maxSelected,
    onChange,
    placeholder = "Escribe para buscar habilidades..."
}: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleTag = (id: number) => {
        let newIds: number[];
        if (selectedIds.includes(id)) {
            newIds = selectedIds.filter(selectedId => selectedId !== id);
        } else {
            if (maxSelected && selectedIds.length >= maxSelected) return;
            newIds = [...selectedIds, id];
        }
        setSelectedIds(newIds);
        onChange?.(newIds);
    };

    const selectedTags = useMemo(() =>
        availableTags.filter(t => selectedIds.includes(t.id)),
        [availableTags, selectedIds]);

    const filteredTags = useMemo(() => {
        if (!searchTerm) return [];
        return availableTags
            .filter(t => !selectedIds.includes(t.id))
            .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .slice(0, 8); // Limit suggestions
    }, [availableTags, selectedIds, searchTerm]);

    const popularTags = useMemo(() => {
        return availableTags
            .filter(t => !selectedIds.includes(t.id))
            .slice(0, 5);
    }, [availableTags, selectedIds]);

    return (
        <div className="w-full space-y-4">
            {/* Input oculto para formularios tradicionales */}
            <input type="hidden" name="tags" value={JSON.stringify(selectedIds)} />

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    {selectedTags.map(tag => (
                        <span
                            key={tag.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm"
                        >
                            {tag.name}
                            <button
                                onClick={() => toggleTag(tag.id)}
                                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Search Input Area */}
            <div className="relative group">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                    size={16}
                />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-11 pl-10 pr-4 bg-background border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />

                {/* Dropdown Results */}
                {filteredTags.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2">
                            {filteredTags.map(tag => (
                                <button
                                    key={tag.id}
                                    onClick={() => {
                                        toggleTag(tag.id);
                                        setSearchTerm("");
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted text-sm rounded-lg text-left transition-colors font-medium"
                                >
                                    {tag.name}
                                    <Check size={14} className="text-primary opacity-0 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Popular/Recent Suggestions (Only show if not searching) */}
            {!searchTerm && popularTags.length > 0 && selectedIds.length < (maxSelected || 999) && (
                <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1">Sugerencias rápidas</p>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.map(tag => (
                            <button
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className="text-[11px] font-medium px-3 py-1 rounded-lg bg-muted/30 border hover:border-primary/50 hover:bg-primary/5 transition-all"
                            >
                                + {tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer / Count */}
            <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                <span className="flex items-center gap-1 italic">
                    <Tag size={10} />
                    {maxSelected ? `Máximo ${maxSelected} habilidades` : "Buscador inteligente activo"}
                </span>
                <span className={cn(
                    "font-bold px-2 py-0.5 rounded-full",
                    maxSelected && selectedIds.length >= maxSelected
                        ? "bg-primary text-primary-foreground animate-pulse"
                        : "bg-muted"
                )}>
                    {selectedIds.length} {maxSelected ? `/ ${maxSelected}` : ""} selecionadas
                </span>
            </div>
        </div>
    );
}