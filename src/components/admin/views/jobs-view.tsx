import Link from "next/link";
import { Briefcase } from "lucide-react";
import { JobActions } from "@/components/admin/job-actions";
import { JobStatusSwitch } from "@/components/admin/job-status-switch";
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
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" />
                    Moderación de Ofertas
                </h2>

                <div className="w-full md:w-auto">
                    <AdminSearch />
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {jobs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border shadow-sm">
                        No hay ofertas que coincidan con la búsqueda.
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className={`p-4 rounded-xl border shadow-sm space-y-3 ${job.status === 'REJECTED' ? 'bg-destructive/10 border-destructive/20' : 'bg-card border-border'}`}>
                            <div className="flex justify-between items-start gap-2">
                                <Link href={`/admin/jobs/${job.id}`} className="block group flex-1">
                                    <div className="font-medium text-card-foreground group-hover:text-primary transition-colors text-lg leading-tight">
                                        {job.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-mono mt-1">#{job.id}</div>
                                </Link>
                                <JobActions
                                    jobId={job.id}
                                    jobTitle={job.title}
                                    status={job.status}
                                />
                            </div>

                            <div className="text-sm text-foreground border-b border-border pb-2">
                                {job.author.companyProfile?.legalName || job.author.name}
                            </div>

                            <div className="flex justify-between items-center pt-1">
                                <div className="text-xs text-muted-foreground">
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <JobStatusSwitch jobId={job.id} status={job.status} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-semibold text-muted-foreground">Título / ID</th>
                            <th className="p-4 font-semibold text-muted-foreground">Empresa</th>
                            <th className="p-4 font-semibold text-muted-foreground">Estado</th>
                            <th className="p-4 font-semibold text-muted-foreground">Fecha</th>
                            <th className="p-4 font-semibold text-muted-foreground text-right">Moderación</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {jobs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No hay ofertas que coincidan con la búsqueda.
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job.id} className={`transition-colors ${job.status === 'REJECTED' ? 'bg-destructive/10 hover:bg-destructive/20' : 'hover:bg-muted/50'}`}>
                                    <td className="p-4">
                                        <Link href={`/admin/jobs/${job.id}`} className="group block">
                                            <div className="font-medium text-foreground group-hover:text-primary transition-colors">{job.title}</div>
                                            <div className="text-xs text-muted-foreground font-mono">#{job.id}</div>
                                        </Link>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-foreground">
                                            {job.author.companyProfile?.legalName || job.author.name}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <JobStatusSwitch jobId={job.id} status={job.status} />
                                    </td>
                                    <td className="p-4 text-muted-foreground">
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
