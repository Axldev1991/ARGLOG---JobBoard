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
        <div className="w-full transition-all duration-500 bg-card/60 backdrop-blur-[var(--glass-blur)] border-[var(--glass-border)] shadow-[0_8px_32px_0_rgba(var(--primary),0.1)] rounded-3xl p-8 dark:bg-card dark:backdrop-blur-none dark:border-border dark:shadow-none">
            <form onSubmit={handleSubmit} className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                    <Input
                        name="q"
                        placeholder="Buscar por puesto o palabra clave..."
                        className="pl-10 h-10 bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/50 dark:bg-background dark:border-input"
                        defaultValue={searchParams.get("q")?.toString()}
                    />
                </div>

                <select
                    name="category"
                    defaultValue={searchParams.get("category")?.toString()}
                    className="flex h-10 w-full md:w-auto items-center justify-between rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background dark:border-input"
                >
                    <option value="" className="text-muted-foreground">Todas las Categorías</option>
                    {JOB_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    name="modality"
                    defaultValue={searchParams.get("modality")?.toString()}
                    className="flex h-10 w-full md:w-auto items-center justify-between rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-background dark:border-input"
                >
                    <option value="" className="text-muted-foreground">Cualquier Modalidad</option>
                    {JOB_MODALITIES.map(mod => (
                        <option key={mod} value={mod}>{mod}</option>
                    ))}
                </select>

                <Button type="submit" className="px-8 font-black bg-gradient-to-b from-primary via-primary to-blue-800 text-primary-foreground shadow-[0_5px_0_0_#1e3a8a,0_10px_20px_-10px_rgba(var(--primary),0.5),inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-2px_0_0_rgba(0,0,0,0.2)] rounded-2xl transition-all active:translate-y-[2px] active:shadow-[0_2px_0_0_#1e3a8a] active:scale-[0.98] hover:shadow-[0_8px_0_0_#1e3a8a,0_15px_30px_-10px_rgba(var(--primary),0.6)] hover:-translate-y-[2px] ring-1 ring-primary/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:h-1/2 dark:bg-primary dark:from-primary dark:to-primary dark:shadow-none dark:border-none dark:before:hidden dark:active:translate-y-0 dark:hover:translate-y-0 dark:ring-0 dark:text-blue-900">
                    <span className="relative z-10 font-bold dark:font-semibold">Buscar</span>
                </Button>
            </form>

            {/* Sugerencias de Tags Pro (Multi-Select) */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground font-medium mr-2">Filtros rápidos:</span>
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