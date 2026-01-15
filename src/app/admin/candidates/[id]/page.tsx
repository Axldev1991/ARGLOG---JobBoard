import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Mail, FileText, ExternalLink, Calendar, Briefcase } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CandidateDetailActions } from "@/components/admin/candidate-detail-actions";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CandidateDetailPage(props: PageProps) {
    const params = await props.params;
    const candidateId = parseInt(params.id);

    if (isNaN(candidateId)) return notFound();

    // Fetch Candidate Data
    const candidate = await prisma.user.findUnique({
        where: { id: candidateId },
        include: {
            applications: {
                orderBy: { createdAt: 'desc' },
                include: {
                    job: {
                        include: {
                            author: {
                                include: { companyProfile: true } // Para saber a qué empresa aplicó
                            }
                        }
                    }
                }
            }
        }
    });

    if (!candidate || candidate.role !== 'candidate') {
        return notFound();
    }

    return (
        <main className="p-10 bg-gray-50 min-h-screen font-sans">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/dashboard?view=candidates" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 mb-4 transition-colors">
                    <ArrowLeft size={16} /> Volver al listado
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{candidate.name}</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Candidato</span>
                            <span className="text-slate-400">ID: #{candidate.id}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-400">Registrado el {new Date(candidate.createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {candidate.resumeUrl && (
                            <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                                    <FileText size={16} className="mr-2" /> Ver CV Original
                                </Button>
                            </a>
                        )}
                        {/* <CandidateDetailActions candidateId={candidate.id} candidateName={candidate.name} /> */}
                        <CandidateDetailActions candidateId={candidate.id} candidateName={candidate.name} />
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Personal Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <User size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{candidate.headline || "Sin título"}</h3>
                                <div className="flex items-center text-slate-500 text-sm gap-1">
                                    <MapPin size={14} />
                                    {candidate.city || "Ubicación no especificada"}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                                <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline flex items-center gap-1 font-medium">
                                    <Mail size={14} /> {candidate.email}
                                </a>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">LinkedIn / Portfolio</label>
                                {candidate.linkedin ? (
                                    <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                        <ExternalLink size={14} /> {candidate.linkedin}
                                    </a>
                                ) : (<span className="text-slate-400 text-sm">No conectado</span>)}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Bio</label>
                                <p className="text-slate-600 text-sm leading-relaxed italic">
                                    {candidate.bio ? `"${candidate.bio}"` : "El candidato no ha escrito una biografía."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Applications History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <Briefcase size={20} className="text-slate-400" />
                                Historial de Postulaciones
                            </h2>
                            <span className="text-sm text-slate-500 font-mono bg-slate-200 px-2 py-1 rounded">
                                {candidate.applications.length} Total
                            </span>
                        </div>

                        <table className="w-full text-left text-sm">
                            <thead className="bg-white text-slate-500 border-b">
                                <tr>
                                    <th className="p-4 font-medium">Puesto Aplicado</th>
                                    <th className="p-4 font-medium">Empresa</th>
                                    <th className="p-4 font-medium">Fecha</th>
                                    <th className="p-4 font-medium text-right">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {candidate.applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400">
                                            Este candidato aún no se ha postulado a ninguna oferta.
                                        </td>
                                    </tr>
                                ) : (
                                    candidate.applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-semibold text-slate-900">{app.job.title}</div>
                                                <div className="text-xs text-slate-500">#{app.job.id} • {app.job.modality}</div>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {app.job.author.companyProfile?.legalName || app.job.author.name}
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'HIRED' ? 'bg-green-100 text-green-700' :
                                                    app.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {app.status === 'PENDING' ? 'Pendiente' : app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
