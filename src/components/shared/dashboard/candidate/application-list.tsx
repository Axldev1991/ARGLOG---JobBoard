import Link from "next/link";
import { Briefcase } from "lucide-react";
import { withdrawApplication } from "@/actions/withdraw-application";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";

export function ApplicationList({ applications = [] }: { applications?: any[] }) {

    return (
        <div className="lg:col-span-3 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Mis Postulaciones</h2>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {applications.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Briefcase className="mx-auto mb-3 text-slate-300" size={48} />
                        <p>Aún no te has postulado a ninguna oferta.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-900 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Puesto</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <Link href={`/jobs/${app.job.id}`} className="hover:text-blue-600 hover:underline">
                                            {app.job.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                            ${app.status === 'PENDING' ? 'bg-blue-100 text-blue-700' : ''}
                                            ${app.status === 'HIRED' ? 'bg-green-100 text-green-700' : ''}
                                            ${app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : ''}
                                        `}>
                                            {app.status === 'PENDING' ? 'En Revisión' : app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
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
                )}
            </div>
        </div>
    );
}
