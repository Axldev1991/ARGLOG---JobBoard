import Link from "next/link";
import { Briefcase } from "lucide-react";
import { withdrawApplication } from "@/actions/withdraw-application";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";

export function ApplicationList({ applications = [] }: { applications?: any[] }) {

    return (
        <div className="lg:col-span-3 mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Mis Postulaciones</h2>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                {applications.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <Briefcase className="mx-auto mb-3 text-muted-foreground/50" size={48} />
                        <p>Aún no te has postulado a ninguna oferta.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm text-muted-foreground min-w-[600px] md:min-w-full">
                            <thead className="bg-muted/50 border-b border-border text-foreground font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Puesto</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            <Link href={`/jobs/${app.job.id}`} className="hover:text-primary hover:underline">
                                                {app.job.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                                ${app.status === 'PENDING' ? 'bg-blue-500/10 text-blue-500' : ''}
                                                ${app.status === 'HIRED' ? 'bg-green-500/10 text-green-500' : ''}
                                                ${app.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' : ''}
                                            `}>
                                                {app.status === 'PENDING' ? 'En Revisión' : app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {app.status === 'PENDING' && (
                                                <ConfirmDeleteButton
                                                    title="¿Retirar Postulación?"
                                                    description="Se eliminará tu solicitud para esta oferta. Deberás postularte nuevamente si cambias de opinión."
                                                    onDelete={async () => {
                                                        const res = await withdrawApplication(app.id);
                                                        return { success: res.success || false, message: res.success ? "Postulación retirada" : res.error, error: res.error };
                                                    }}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
