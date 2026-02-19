"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Linkedin, Phone, Mail, FileUser } from "lucide-react";
import { searchCandidates } from "@/actions/company/search-candidates";
import { TagSelector } from "@/components/ui/tag-selector";

export function CandidateSearch({ allTags = [] }: { allTags: any[] }) {
    const [query, setQuery] = useState("");
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const performSearch = async () => {
        setLoading(true);
        try {
            const result = await searchCandidates({
                query,
                tagIds: selectedTagIds,
                page: 1,
                pageSize: 20
            });
            setCandidates(result.candidates);
            setTotal(result.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        performSearch();
    }, [selectedTagIds]);

    return (
        <div className="space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Filtrar Talentos</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Buscar por nombre, puesto o bio..."
                                className="pl-10 h-12"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && performSearch()}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={performSearch} className="font-bold">
                                Buscar Ahora
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-muted-foreground">Habilidades Requeridas</label>
                        <TagSelector
                            availableTags={allTags}
                            initialSelectedIds={selectedTagIds}
                            maxSelected={5}
                            onChange={(ids) => setSelectedTagIds(ids)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Resultados ({total})</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-card border rounded-xl p-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 w-1/3 bg-muted animate-pulse rounded" />
                                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                            <div className="h-10 w-full bg-muted animate-pulse rounded" />
                        </div>
                    ))
                ) : candidates.length > 0 ? (
                    candidates.map((candidate) => (
                        <div key={candidate.id} className="bg-card border rounded-xl p-6 group hover:border-primary/50 transition-all hover:shadow-md relative overflow-hidden">
                            <div className="flex gap-4 items-start relative z-10">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0 border-2 border-background shadow-sm">
                                    {(candidate.name?.charAt(0) || 'C')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{candidate.name}</h4>
                                    <p className="text-primary font-medium text-sm mb-1">{candidate.headline || "Candidato en Logística"}</p>
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <MapPin size={14} />
                                        <span>{candidate.city || "No especificada"}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-muted-foreground line-clamp-2 italic">
                                "{candidate.bio || "Sin descripción disponible."}"
                            </p>

                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {candidate.tags?.map((tag: any) => (
                                    <span key={tag.id} className="bg-secondary text-secondary-foreground text-[10px] font-medium px-2 py-0.5 rounded-full border border-border">
                                        {tag.name}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t flex flex-wrap gap-4 items-center justify-between">
                                <div className="flex gap-3">
                                    {candidate.linkedin && (
                                        <a href={candidate.linkedin} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                            <Linkedin size={18} />
                                        </a>
                                    )}
                                    <a href={`mailto:${candidate.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                                        <Mail size={18} />
                                    </a>
                                </div>

                                {candidate.resumeUrl ? (
                                    <Button variant="outline" size="sm" className="gap-2 h-8 text-xs border-primary/30 text-primary hover:bg-primary/10" asChild>
                                        <a href={candidate.resumeUrl} target="_blank">
                                            <FileUser size={14} />
                                            Ver CV
                                        </a>
                                    </Button>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground italic">CV no disponible</span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-card border rounded-xl border-dashed">
                        <p className="text-muted-foreground">No se encontraron candidatos con esos criterios.</p>
                        <Button variant="link" onClick={() => { setQuery(""); setSelectedTagIds([]); }} className="text-primary mt-2">
                            Limpiar filtros
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
