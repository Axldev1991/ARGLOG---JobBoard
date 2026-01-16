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
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Briefcase size={20} className="text-primary" />
                        Mis Ofertas Publicadas
                        <span className="text-sm font-normal text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full ml-2 border border-border">
                            {processedJobs.length}
                        </span>
                    </h2>

                    <Link href="/jobs/new" className="hidden sm:block">
                        <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                            + Nueva Oferta
                        </Button>
                    </Link>
                </div>

                {/* Barra de Herramientas */}
                <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm mb-6">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            placeholder="Buscar por puesto o categoría..."
                            className="pl-9 bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <SortControls sortKey={sortKey} sortDirection={sortDirection} onToggle={toggleSort} />

                    <Link href="/jobs/new" className="sm:hidden mt-2">
                        <Button className="w-full bg-primary hover:bg-primary/90">+ Nueva Oferta</Button>
                    </Link>
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {processedJobs.length === 0 ? (
                    <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                        No se encontraron ofertas que coincidan con tu búsqueda.
                    </div>
                ) : (
                    processedJobs.map((job) => {
                        const applicationCount = job.applications?.length || 0;
                        return (
                            <div key={job.id} className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-bold text-card-foreground text-lg leading-tight">{job.title}</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                                                {job.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {job.modality}
                                            </span>
                                        </div>
                                    </div>

                                    <JobStatusControls jobId={job.id} currentStatus={job.status} />
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm border-t border-b border-border py-3">
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground uppercase font-semibold">Postulantes</span>
                                        {applicationCount > 0 ? (
                                            <Link href={`/dashboard/jobs/${job.id}`} className="flex items-center gap-2 group">
                                                <span className="text-lg font-bold text-primary group-hover:text-primary/80">
                                                    {applicationCount}
                                                </span>
                                                <Users size={14} className="text-muted-foreground group-hover:text-primary" />
                                            </Link>
                                        ) : (
                                            <div className="flex items-center gap-2 opacity-50">
                                                <span className="text-lg font-bold text-muted-foreground">0</span>
                                                <Users size={14} className="text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-muted-foreground uppercase font-semibold">Fechas</span>
                                        <div className="flex flex-col text-muted-foreground font-medium text-xs gap-1">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-muted-foreground" />
                                                <span>Pub: {new Date(job.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {job.expiresAt && (
                                                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500">
                                                    <Clock size={12} />
                                                    <span>Ven: {new Date(job.expiresAt).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <Button variant="outline" size="sm" className="h-9 text-muted-foreground hover:text-foreground" asChild>
                                        <Link href={`/jobs/${job.id}`}>
                                            <Eye size={16} className="mr-2" />
                                            Ver
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-9 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10" asChild>
                                        <Link href={`/dashboard/jobs/${job.id}/edit`}>
                                            <Pencil size={16} className="mr-2" />
                                            Editar
                                        </Link>
                                    </Button>
                                    <ConfirmDeleteButton
                                        title={`¿Eliminar "${job.title}"?`}
                                        description="Esta acción es irreversible."
                                        onDelete={async () => {
                                            const fd = new FormData();
                                            fd.append("jobId", job.id.toString());
                                            const res = await deleteJob(fd);
                                            return { success: res.success || false, message: res.message, error: res.message };
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <TableHeader sortKey={sortKey} onToggle={toggleSort} />
                    <tbody className="divide-y divide-border">
                        {processedJobs.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
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
        <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="text-muted-foreground" size={32} />
            </div>
            <h3 className="text-lg font-bold text-card-foreground mb-2">No has publicado ofertas</h3>
            <p className="text-muted-foreground mb-6">Comienza a buscar talento publicando tu primera oportunidad.</p>
            <Link href="/jobs/new">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Publicar Oferta</Button>
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
                        ? 'bg-primary/10 border-primary/20 text-primary'
                        : 'bg-card border-border text-muted-foreground hover:bg-muted/50 hover:border-border'
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
        <thead className="bg-muted/50 border-b border-border text-foreground font-semibold uppercase text-xs">
            <tr>
                <th className="px-6 py-4 w-[40%] cursor-pointer hover:bg-muted/80 transition-colors select-none" onClick={() => onToggle('title')}>
                    <div className="flex items-center gap-1">Puesto <ArrowUpDown size={12} className={sortKey === 'title' ? 'text-primary' : 'text-muted-foreground'} /></div>
                </th>
                <th className="px-6 py-4 w-[15%] text-center cursor-pointer hover:bg-muted/80 transition-colors select-none whitespace-nowrap" onClick={() => onToggle('applicants')}>
                    <div className="flex items-center justify-center gap-1">Postulantes <ArrowUpDown size={12} className={sortKey === 'applicants' ? 'text-primary' : 'text-muted-foreground'} /></div>
                </th>
                <th className="px-6 py-4 w-[15%] cursor-pointer hover:bg-muted/80 transition-colors select-none whitespace-nowrap" onClick={() => onToggle('date')}>
                    <div className="flex items-center gap-1">Fecha <ArrowUpDown size={12} className={sortKey === 'date' ? 'text-primary' : 'text-muted-foreground'} /></div>
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
        <tr className="hover:bg-muted/50 transition-colors">
            <td className="px-6 py-4">
                <p className="font-bold text-card-foreground">{job.title}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                        {job.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {job.modality}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4 text-center">
                {applicationCount > 0 ? (
                    <Link href={`/dashboard/jobs/${job.id}`} className="group inline-flex flex-col items-center">
                        <span className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                            {applicationCount}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                            Candidatos
                        </span>
                    </Link>
                ) : (
                    <div className="flex flex-col items-center opacity-50">
                        <span className="text-xl font-bold text-muted-foreground">0</span>
                        <span className="text-xs text-muted-foreground">Sin postulantes</span>
                    </div>
                )}
            </td>

            <td className="px-6 py-4 text-muted-foreground">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2" title="Fecha de Publicación">
                        <Calendar size={14} />
                        {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                    {job.expiresAt && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500 font-medium" title="Fecha de Vencimiento">
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
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/5" title="Editar Oferta" asChild>
                            <Link href={`/dashboard/jobs/${job.id}/edit`}>
                                <Pencil size={16} />
                            </Link>
                        </Button>

                        {/* Botón Ver (Ojo) */}
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/5" title="Ver detalle público" asChild>
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
