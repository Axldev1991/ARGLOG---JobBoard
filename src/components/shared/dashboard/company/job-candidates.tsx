
import Link from "next/link";
import { ArrowLeft, User, FileText, Linkedin, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApplicationStatusControls } from "./application-status-controls";

export function JobCandidates({ job, applications }: { job: any, applications: any[] }) {

    return (
        <div className="max-w-6xl mx-auto py-8 px-6 text-foreground">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 mb-4 transition-colors">
                    <ArrowLeft size={16} /> Volver al Panel
                </Link>
                <h1 className="text-3xl font-bold mb-2">Candidatos para: {job.title}</h1>
                <p className="text-muted-foreground">
                    Total postulantes: <span className="text-foreground font-bold">{applications.length}</span>
                </p>
            </div>

            {/* Lista de Candidatos */}
            <div className="space-y-4">
                {applications.length === 0 ? (
                    <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
                        <User className="mx-auto mb-4 opacity-50" size={48} />
                        <p>Aún no hay candidatos para esta oferta.</p>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="bg-card rounded-xl p-6 text-card-foreground shadow-lg flex flex-col md:flex-row gap-6 items-start md:items-center border border-border">

                            {/* Avatar / Inicial */}
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0 border-4 border-background shadow-sm">
                                {app.user.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Info Principal */}
                            <div className="flex-grow space-y-2">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                        {app.user.name}
                                        <ApplicationStatusControls
                                            applicationId={app.id}
                                            currentStatus={app.status}
                                        />
                                    </h3>
                                    <p className="text-muted-foreground font-medium">{app.user.headline || "Sin título profesional"}</p>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 bg-muted/50 p-2 rounded-lg border border-border italic">
                                        "{app.user.bio}"
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 min-w-[200px]">
                                {app.user.resumeUrl ? (
                                    <a href={app.user.resumeUrl} target="_blank" rel="noopener noreferrer">
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                                            <FileText size={16} /> Ver CV Completo
                                        </Button>
                                    </a>
                                ) : (
                                    <Button variant="outline" disabled className="w-full gap-2 border-border text-muted-foreground">
                                        <FileText size={16} /> Sin CV adjunto
                                    </Button>
                                )}

                                {app.user.linkedin && (
                                    <a href={app.user.linkedin} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="w-full gap-2 border-border text-primary hover:bg-primary/10">
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
