import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Calendar, Users, DollarSign, Briefcase } from "lucide-react";
import { notFound } from "next/navigation";
import { JobActions } from "@/components/admin/job-actions";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function JobDetailPage(props: PageProps) {
    const params = await props.params;
    const jobId = parseInt(params.id);

    if (isNaN(jobId)) return notFound();

    // Fetch Job Data with relations
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            author: {
                include: { companyProfile: true }
            },
            tags: true,
            applications: {
                orderBy: { createdAt: 'desc' },
                include: {
                    user: true // The candidate
                }
            }
        }
    });

    if (!job) return notFound();

    return (
        <main className="p-10 bg-gray-50 min-h-screen font-sans">
            {/* Header / Breadcrumbs */}
            <div className="mb-8">
                <div className="flex gap-4 text-sm text-slate-500 mb-4">
                    <Link href="/admin/dashboard?view=jobs" className="hover:text-slate-900 flex items-center gap-1">
                        <ArrowLeft size={14} /> Ofertas
                    </Link>
                    <span>/</span>
                    <Link href={`/admin/companies/${job.authorId}`} className="hover:text-slate-900">
                        {job.author.companyProfile?.legalName || job.author.name}
                    </Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">#{job.id}</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <Building2 size={14} /> {job.author.companyProfile?.legalName || job.author.name}
                            </span>
                            <span className="flex items-center gap-1">
                                <MapPin size={14} /> {job.location || "Remoto"}
                            </span>
                            <span className="flex items-center gap-1">
                                <DollarSign size={14} /> {job.salary || "No especificado"}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} /> {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Reuse the existing JobActions component for Toggle/Delete */}
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${job.status === 'PUBLISHED'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {job.status === 'PUBLISHED' ? 'PUBLISHED' : 'REJECTED'}
                        </div>
                        <JobActions jobId={job.id} jobTitle={job.title} status={job.status} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Job Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-slate-800">Descripción del Puesto</h2>
                        <div className="prose prose-slate max-w-none text-sm text-slate-600 whitespace-pre-line">
                            {job.description}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {job.tags.map(tag => (
                                <span key={tag.id} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Applicants Table */}
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <Users size={20} className="text-purple-600" />
                                Postulantes
                            </h2>
                            <span className="bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded text-xs">
                                {job.applications.length} Total
                            </span>
                        </div>

                        <table className="w-full text-left text-sm">
                            <thead className="bg-white text-slate-500 border-b">
                                <tr>
                                    <th className="p-4 font-medium">Candidato</th>
                                    <th className="p-4 font-medium">Headline</th>
                                    <th className="p-4 font-medium">Fecha Postulación</th>
                                    <th className="p-4 font-medium text-right">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {job.applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400">
                                            Aún no hay postulantes para esta oferta.
                                        </td>
                                    </tr>
                                ) : (
                                    job.applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <Link href={`/admin/candidates/${app.userId}`} className="group block">
                                                    <div className="font-medium text-slate-900 group-hover:text-purple-600 transition-colors">
                                                        {app.user.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500">{app.user.email}</div>
                                                </Link>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {app.user.headline || "—"}
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${app.status === 'HIRED' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                                                            'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT COLUMN: Metadata & Snapshot */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Detalles Técnicos</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500">Categoría</span>
                                <span className="font-medium text-slate-900">{job.category}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500">Modalidad</span>
                                <span className="font-medium text-slate-900">{job.modality}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-slate-500">Salario</span>
                                <span className="font-medium text-slate-900">{job.salary || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
