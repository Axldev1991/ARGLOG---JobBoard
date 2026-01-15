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
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Users size={20} className="text-purple-600" />
                    Listado de Candidatos
                </h2>
                <div className="w-full md:w-auto">
                    <AdminSearch />
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Nombre</th>
                            <th className="p-4 font-semibold text-slate-600">Titular</th>
                            <th className="p-4 font-semibold text-slate-600">Ubicación</th>
                            <th className="p-4 font-semibold text-slate-600">CV</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {candidates.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    No hay candidatos registrados aún.
                                </td>
                            </tr>
                        ) : (
                            candidates.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <Link href={`/admin/candidates/${candidate.id}`} className="group flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs uppercase">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                                                    {candidate.name}
                                                </div>
                                                <div className="text-xs text-slate-500">{candidate.email}</div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-slate-600 truncate max-w-[200px]">
                                        {candidate.headline || (
                                            <span className="text-slate-300 italic">Sin titular</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-400">{candidate.city || "-"}</td>
                                    <td className="p-4">
                                        {candidate.resumeUrl ? (
                                            <Link
                                                href={candidate.resumeUrl}
                                                target="_blank"
                                                className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded hover:bg-slate-200"
                                            >
                                                Ver PDF
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-slate-300">N/A</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Link href={`/admin/candidates/${candidate.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full" title="Editar Candidato">
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
