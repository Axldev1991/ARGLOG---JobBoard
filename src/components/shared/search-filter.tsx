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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        name="q"
                        placeholder="Buscar por puesto o palabra clave..."
                        className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-10"
                        defaultValue={searchParams.get("q")?.toString()}
                    />
                </div>

                <select
                    name="category"
                    defaultValue={searchParams.get("category")?.toString()}
                    className="bg-slate-800 border border-slate-600 text-white p-2 rounded-md text-sm h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                >
                    <option value="" className="text-slate-400">Todas las Categorías</option>
                    {JOB_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    name="modality"
                    defaultValue={searchParams.get("modality")?.toString()}
                    className="bg-slate-800 border border-slate-600 text-white p-2 rounded-md text-sm h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                >
                    <option value="" className="text-slate-400">Cualquier Modalidad</option>
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