import Link from "next/link";
import { Briefcase } from "lucide-react";
import { JobActions } from "@/components/admin/job-actions";
import { AdminSearch } from "@/components/admin/admin-search";

interface Props {
    jobs: any[]; // Ideally typed with Prisma.JobGetPayload
}

/**
 * View component for moderation of job postings.
 * Allows Admins to Publish/Reject jobs or delete them permanently.
 * Displays current status with color-coded badges.
 */
export function JobsView({ jobs }: Props) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Briefcase size={20} className="text-orange-600" />
                    Moderación de Ofertas
                </h2>

                <div className="w-full md:w-auto">
                    <AdminSearch />
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Título / ID</th>
                            <th className="p-4 font-semibold text-slate-600">Empresa</th>
                            <th className="p-4 font-semibold text-slate-600">Estado</th>
                            <th className="p-4 font-semibold text-slate-600">Fecha</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Moderación</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {jobs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    No hay ofertas que coincidan con la búsqueda.
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job.id} className={`transition-colors ${job.status === 'REJECTED' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}`}>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{job.title}</div>
                                        <div className="text-xs font-mono text-slate-400">ID: #{job.id}</div>
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {job.author?.companyProfile?.legalName || job.author?.name || "Desconocido"}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${job.status === 'PUBLISHED'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {job.status === 'PUBLISHED' ? 'Visible' : 'Oculto'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">
                                        {new Date(job.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <JobActions
                                            jobId={job.id}
                                            jobTitle={job.title}
                                            status={job.status}
                                        />
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
