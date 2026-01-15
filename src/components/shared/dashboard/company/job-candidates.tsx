
import Link from "next/link";
import { ArrowLeft, User, FileText, Linkedin, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationStatusControls } from "./application-status-controls";

export function JobCandidates({ job, applications }: { job: any, applications: any[] }) {

    return (
        <div className="max-w-6xl mx-auto py-8 px-6 text-white">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard" className="text-slate-400 hover:text-white inline-flex items-center gap-2 mb-4 transition-colors">
                    <ArrowLeft size={16} /> Volver al Panel
                </Link>
                <h1 className="text-3xl font-bold mb-2">Candidatos para: {job.title}</h1>
                <p className="text-slate-400">
                    Total postulantes: <span className="text-white font-bold">{applications.length}</span>
                </p>
            </div>

            {/* Lista de Candidatos */}
            <div className="space-y-4">
                {applications.length === 0 ? (
                    <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-12 text-center text-slate-400">
                        <User className="mx-auto mb-4 opacity-50" size={48} />
                        <p>Aún no hay candidatos para esta oferta.</p>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-xl p-6 text-slate-800 shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center">

                            {/* Avatar / Inicial */}
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 flex-shrink-0 border-4 border-white shadow-sm">
                                {app.user.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Info Principal */}
                            <div className="flex-grow space-y-2">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        {app.user.name}
                                        <ApplicationStatusControls
                                            applicationId={app.id}
                                            currentStatus={app.status}
                                        />
                                    </h3>
                                    <p className="text-slate-500 font-medium">{app.user.headline || "Sin título profesional"}</p>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Mail size={14} /> {app.user.email}
                                    </div>
                                    {app.user.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone size={14} /> {app.user.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} /> Postulado: {new Date(app.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                {app.user.bio && (
                                    <p className="text-sm text-slate-600 mt-2 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                                        "{app.user.bio}"
                                    </p>
                                )}
                            </div>

                            {/* Acciones */}
                            <div className="flex flex-col gap-2 min-w-[200px]">
                                {app.user.resumeUrl ? (
                                    <a href={app.user.resumeUrl} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full bg-slate-900 hover:bg-slate-700 text-white gap-2">
                                            <FileText size={16} /> Ver CV Completo
                                        </Button>
                                    </a>
                                ) : (
                                    <Button variant="outline" disabled className="w-full gap-2 border-slate-200 text-slate-400">
                                        <FileText size={16} /> Sin CV adjunto
                                    </Button>
                                )}

                                {app.user.linkedin && (
                                    <a href={app.user.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="w-full gap-2 border-blue-100 text-blue-600 hover:bg-blue-50">
                                            <Linkedin size={16} /> LinkedIn
                                        </Button>
                                    </a>
                                )}
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
