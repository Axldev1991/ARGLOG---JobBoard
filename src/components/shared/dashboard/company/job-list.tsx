"use client";

import { Users, Calendar, Eye, Briefcase, ArrowUpDown, ArrowUp, ArrowDown, Search, Pencil, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJobFilter, SortKey } from "./use-job-filter";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { deleteJob } from "@/actions/delete-jobs";
import { JobStatusControls } from "./job-status-controls";

export function JobList({ jobs = [] }: { jobs: any[] }) {
    const {
        processedJobs,
        searchTerm,
        setSearchTerm,
        sortKey,
        sortDirection,
        toggleSort
    } = useJobFilter(jobs);

    if (jobs.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-6">
            {/* Header + Toolbar */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-600" />
                        Mis Ofertas Publicadas
                        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full ml-2 border border-slate-200">
                            {processedJobs.length}
                        </span>
                    </h2>

                    <Link href="/jobs/new" className="hidden sm:block">
                        <Button variant="default" size="sm" className="bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-100">
                            + Nueva Oferta
                        </Button>
                    </Link>
                </div>

                {/* Barra de Herramientas */}
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input
                            placeholder="Buscar por puesto o categoría..."
                            className="pl-9 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <SortControls sortKey={sortKey} sortDirection={sortDirection} onToggle={toggleSort} />

                    <Link href="/jobs/new" className="sm:hidden mt-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-500">+ Nueva Oferta</Button>
                    </Link>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <TableHeader sortKey={sortKey} onToggle={toggleSort} />
                    <tbody className="divide-y divide-slate-100">
                        {processedJobs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    No se encontraron ofertas que coincidan con tu búsqueda.
                                </td>
                            </tr>
                        ) : (
                            processedJobs.map((job) => <JobRow key={job.id} job={job} />)
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- Sub-Components (para mantener limpio el componente principal) ---

function EmptyState() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No has publicado ofertas</h3>
            <p className="text-slate-500 mb-6">Comienza a buscar talento publicando tu primera oportunidad.</p>
            <Link href="/jobs/new">
                <Button className="bg-blue-600 hover:bg-blue-700">Publicar Oferta</Button>
            </Link>
        </div>
    );
}

function SortControls({ sortKey, sortDirection, onToggle }: { sortKey: SortKey, sortDirection: string, onToggle: (k: SortKey) => void }) {
    const filters: { label: string, key: SortKey }[] = [
        { label: 'Fecha', key: 'date' },
        { label: 'Nombre', key: 'title' },
        { label: 'Postulantes', key: 'applicants' }
    ];

    return (
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {filters.map(({ label, key }) => (
                <button
                    key={key}
                    onClick={() => onToggle(key)}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap border ${sortKey === key
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                >
                    {label}
                    {sortKey === key && (sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                </button>
            ))}
        </div>
    );
}

function TableHeader({ sortKey, onToggle }: { sortKey: SortKey, onToggle: (k: SortKey) => void }) {
    return (
        <thead className="bg-slate-50 border-b border-slate-100 text-slate-900 font-semibold uppercase text-xs">
            <tr>
                <th className="px-6 py-4 w-[40%] cursor-pointer hover:bg-slate-100 transition-colors select-none" onClick={() => onToggle('title')}>
                    <div className="flex items-center gap-1">Puesto <ArrowUpDown size={12} className={sortKey === 'title' ? 'text-blue-500' : 'text-slate-300'} /></div>
                </th>
                <th className="px-6 py-4 w-[15%] text-center cursor-pointer hover:bg-slate-100 transition-colors select-none whitespace-nowrap" onClick={() => onToggle('applicants')}>
                    <div className="flex items-center justify-center gap-1">Postulantes <ArrowUpDown size={12} className={sortKey === 'applicants' ? 'text-blue-500' : 'text-slate-300'} /></div>
                </th>
                <th className="px-6 py-4 w-[15%] cursor-pointer hover:bg-slate-100 transition-colors select-none whitespace-nowrap" onClick={() => onToggle('date')}>
                    <div className="flex items-center gap-1">Fecha <ArrowUpDown size={12} className={sortKey === 'date' ? 'text-blue-500' : 'text-slate-300'} /></div>
                </th>
                <th className="px-6 py-4 w-[15%] text-center whitespace-nowrap">Estado</th>
                <th className="px-6 py-4 w-[15%] text-right whitespace-nowrap">Acciones</th>
            </tr>
        </thead>
    );
}

function JobRow({ job }: { job: any }) {
    const applicationCount = job.applications?.length || 0;

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4">
                <p className="font-bold text-slate-900">{job.title}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {job.category}
                    </span>
                    <span className="text-xs text-slate-500">
                        {job.modality}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 text-center">
                {applicationCount > 0 ? (
                    <Link href={`/dashboard/jobs/${job.id}`} className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold text-xs border border-blue-100 hover:bg-blue-100 transition-colors group">
                        <Users size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                        <span>{applicationCount} Candidatos</span>
                    </Link>
                ) : (
                    <span className="text-slate-400 text-xs flex items-center justify-center gap-1">
                        <Users size={14} /> 0
                    </span>
                )}
            </td>

            <td className="px-6 py-4 text-slate-500">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2" title="Fecha de Publicación">
                        <Calendar size={14} />
                        {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    {job.expiresAt && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 font-medium" title="Fecha de Vencimiento">
                            <Clock size={12} />
                            Vence: {new Date(job.expiresAt).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </td>

            <td className="px-6 py-4 text-center">
                <JobStatusControls jobId={job.id} currentStatus={job.status} />
            </td>

            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <div className="flex items-center justify-end gap-1">
                        {/* Botón Editar (Lápiz) */}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-400 hover:bg-indigo-50" title="Editar Oferta" asChild>
                            <Link href={`/dashboard/jobs/${job.id}/edit`}>
                                <Pencil size={16} />
                            </Link>
                        </Button>

                        {/* Botón Ver (Ojo) */}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="Ver detalle público" asChild>
                            <Link href={`/jobs/${job.id}`}>
                                <Eye size={16} />
                            </Link>
                        </Button>

                        {/* Botón Eliminar */}
                        <ConfirmDeleteButton
                            title={`¿Eliminar "${job.title}"?`}
                            description="Esta oferta y todos sus candidatos serán eliminados permanentemente."
                            onDelete={async () => {
                                const fd = new FormData();
                                fd.append("jobId", job.id.toString());
                                const res = await deleteJob(fd);
                                // Adapt response to generic interface if needed
                                return { success: res.success || false, message: res.message, error: res.message };
                            }}
                        />
                    </div>
                </div>
            </td>
        </tr>
    );
}
