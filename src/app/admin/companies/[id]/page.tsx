import { prisma } from "@/lib/db";
import { requireAdminAction } from "@/lib/auth-guard";
import Link from "next/link";
import { ArrowLeft, Building2, Globe, MapPin, Calendar, Briefcase, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { CompanyDetailActions } from "@/components/admin/company-detail-actions";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage(props: PageProps) {
    // 1. Verify Admin Access (Layout protects it, but double check doesn't hurt logic flow)
    // Actually layout handles it.

    const params = await props.params;
    const companyId = parseInt(params.id);

    if (isNaN(companyId)) return notFound();

    // 2. Fetch Data
    const company = await prisma.user.findUnique({
        where: { id: companyId },
        include: {
            companyProfile: true,
            jobs: {
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { applications: true }
                    }
                }
            }
        }
    });

    if (!company || company.role !== 'company') {
        return notFound();
    }

    // Stats
    const totalJobs = company.jobs.length;
    const activeJobs = company.jobs.filter(j => j.status === 'PUBLISHED').length;
    const totalApplicationsReceived = company.jobs.reduce((acc, job) => acc + job._count.applications, 0);

    return (
        <main className="p-10 bg-gray-50 min-h-screen font-sans">
            {/* Breadcrumb / Back */}
            <div className="mb-8">
                <Link href="/admin/dashboard?view=companies" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 mb-4 transition-colors">
                    <ArrowLeft size={16} /> Volver al listado
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{company.name}</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Empresa</span>
                            <span className="text-slate-400">ID: #{company.id}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-400">Registrada el {new Date(company.createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>

                    <CompanyDetailActions companyId={company.id} companyName={company.name} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Profile Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Building2 size={20} className="text-slate-400" />
                            Perfil Corporativo
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Razón Social</label>
                                <p className="text-slate-900 font-medium">{company.companyProfile?.legalName || "—"}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">CUIT</label>
                                <p className="text-slate-900 font-mono text-sm">{company.companyProfile?.cuit || "—"}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Industria</label>
                                <p className="text-slate-900">{company.companyProfile?.industry || "—"}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Sitio Web</label>
                                {company.companyProfile?.website ? (
                                    <a href={company.companyProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                        <Globe size={14} /> {company.companyProfile.website}
                                    </a>
                                ) : ("—")}
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Descripción</label>
                                <p className="text-slate-600 text-sm leading-relaxed">{company.companyProfile?.description || "Sin descripción."}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 text-slate-800">Métricas Clave</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg text-center">
                                <span className="block text-2xl font-bold text-slate-900">{totalJobs}</span>
                                <span className="text-xs text-slate-500 font-medium uppercase">Ofertas Totales</span>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg text-center">
                                <span className="block text-2xl font-bold text-blue-700">{activeJobs}</span>
                                <span className="text-xs text-blue-600 font-medium uppercase">Activas</span>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg text-center col-span-2">
                                <span className="block text-3xl font-bold text-purple-700">{totalApplicationsReceived}</span>
                                <span className="text-xs text-purple-600 font-medium uppercase">Postulantes Recibidos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Jobs History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <Briefcase size={20} className="text-slate-400" />
                                Historial de Ofertas
                            </h2>
                        </div>

                        <table className="w-full text-left text-sm">
                            <thead className="bg-white text-slate-500 border-b">
                                <tr>
                                    <th className="p-4 font-medium">Título</th>
                                    <th className="p-4 font-medium">Estado</th>
                                    <th className="p-4 font-medium">Publicado</th>
                                    <th className="p-4 font-medium text-right">Postulantes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {company.jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400">
                                            Esta empresa aún no ha publicado ofertas.
                                        </td>
                                    </tr>
                                ) : (
                                    company.jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <Link href={`/admin/jobs/${job.id}`} className="group block">
                                                    <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</div>
                                                    <div className="text-xs text-slate-500">{job.modality} • {job.category}</div>
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${job.status === 'PUBLISHED'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {job.status === 'PUBLISHED' ? 'Activa' : 'Oculta'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="inline-flex items-center gap-1 font-mono font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                    <Users size={12} className="text-slate-400" />
                                                    {job._count.applications}
                                                </div>
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
