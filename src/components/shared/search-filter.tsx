"use client"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { TagPill } from "./tag-pill";
import { JOB_CATEGORIES, JOB_MODALITIES, QUICK_FILTER_TAGS } from "@/lib/constants";
import { Search } from "lucide-react";

export function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = formData.get("q") as string;
        const category = formData.get("category") as string;
        const modality = formData.get("modality") as string;

        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        if (modality) params.set("modality", modality);

        router.push(`/?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                        name="q"
                        placeholder="Buscar por puesto o palabra clave..."
                        className="pl-10 h-10"
                        defaultValue={searchParams.get("q")?.toString()}
                    />
                </div>

                <select
                    name="category"
                    defaultValue={searchParams.get("category")?.toString()}
                    className="flex h-10 w-full md:w-auto items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" className="text-muted-foreground">Todas las Categorías</option>
                    {JOB_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    name="modality"
                    defaultValue={searchParams.get("modality")?.toString()}
                    className="flex h-10 w-full md:w-auto items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="" className="text-muted-foreground">Cualquier Modalidad</option>
                    {JOB_MODALITIES.map(mod => (
                        <option key={mod} value={mod}>{mod}</option>
                    ))}
                </select>

                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8">Buscar</Button>
            </form>

            {/* Sugerencias de Tags Pro (Multi-Select) */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-400 font-medium mr-2">Filtros rápidos:</span>
                {QUICK_FILTER_TAGS.map((tag) => {
                    const currentTagsParam = searchParams.get("tags");
                    const currentTags = currentTagsParam ? currentTagsParam.split(",") : [];
                    const isActive = currentTags.includes(tag);

                    return (
                        <TagPill
                            key={tag}
                            label={tag}
                            selected={isActive}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                let newTags = [...currentTags];

                                if (isActive) {
                                    newTags = newTags.filter(t => t !== tag);
                                } else {
                                    newTags.push(tag);
                                }

                                if (newTags.length > 0) {
                                    params.set("tags", newTags.join(","));
                                } else {
                                    params.delete("tags");
                                }
                                router.push(`/?${params.toString()}`, { scroll: false });
                            }}
                        />
                    );
                })}
            </div>
        </div>
    )
}