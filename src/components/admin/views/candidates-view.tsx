import Link from "next/link";
import { Users, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateActions } from "@/components/admin/candidate-actions";
import { AdminSearch } from "@/components/admin/admin-search";

interface Props {
    candidates: any[];
}

/**
 * View component for managing registered candidates.
 * Displays a table of candidates with resume access and delete actions.
 */
export function CandidatesView({ candidates }: Props) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Users size={20} className="text-primary" />
                    Listado de Candidatos
                </h2>
                <div className="w-full md:w-auto">
                    <AdminSearch />
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {candidates.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border shadow-sm">
                        No hay candidatos registrados aún.
                    </div>
                ) : (
                    candidates.map((candidate) => (
                        <div key={candidate.id} className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase flex-shrink-0">
                                    {candidate.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/admin/candidates/${candidate.id}`} className="block group">
                                        <div className="font-medium text-card-foreground group-hover:text-primary transition-colors text-lg truncate">
                                            {candidate.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground truncate">{candidate.email}</div>
                                    </Link>
                                    <div className="mt-1 text-sm text-muted-foreground">
                                        {candidate.headline || <span className="text-muted-foreground/50 italic">Sin titular</span>}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        📍 {candidate.city || "Sin ubicación"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                <div>
                                    {candidate.resumeUrl ? (
                                        <Link
                                            href={candidate.resumeUrl}
                                            target="_blank"
                                            className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium hover:bg-primary/20 border border-primary/10"
                                        >
                                            📄 Ver PDF
                                        </Link>
                                    ) : (
                                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">Sin CV</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/candidates/${candidate.id}/edit`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full">
                                            <Pencil size={16} />
                                        </Button>
                                    </Link>
                                    <CandidateActions
                                        candidateId={candidate.id}
                                        candidateName={candidate.name}
                                        resumeUrl={candidate.resumeUrl}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-semibold text-muted-foreground">Nombre</th>
                            <th className="p-4 font-semibold text-muted-foreground">Titular</th>
                            <th className="p-4 font-semibold text-muted-foreground">Ubicación</th>
                            <th className="p-4 font-semibold text-muted-foreground">CV</th>
                            <th className="p-4 font-semibold text-muted-foreground text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {candidates.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No hay candidatos registrados aún.
                                </td>
                            </tr>
                        ) : (
                            candidates.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4">
                                        <Link href={`/admin/candidates/${candidate.id}`} className="group flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                    {candidate.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{candidate.email}</div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-muted-foreground truncate max-w-[200px]">
                                        {candidate.headline || (
                                            <span className="text-muted-foreground/50 italic">Sin titular</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-muted-foreground">{candidate.city || "-"}</td>
                                    <td className="p-4">
                                        {candidate.resumeUrl ? (
                                            <Link
                                                href={candidate.resumeUrl}
                                                target="_blank"
                                                className="text-xs bg-muted text-foreground px-2 py-1 rounded hover:bg-muted/80"
                                            >
                                                Ver PDF
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">N/A</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Link href={`/admin/candidates/${candidate.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full" title="Editar Candidato">
                                                    <Pencil size={16} />
                                                </Button>
                                            </Link>
                                            <CandidateActions
                                                candidateId={candidate.id}
                                                candidateName={candidate.name}
                                                resumeUrl={candidate.resumeUrl}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
