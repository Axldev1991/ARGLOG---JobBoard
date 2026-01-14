import Link from "next/link";


interface JobWithTags {
    id: number;
    title: string;
    description: string;
    salary: string | null;
    tags?: { id: number, name: string }[];
}

import { CheckCircle } from "lucide-react";

export function JobCard({ job, hasApplied }: { job: JobWithTags, hasApplied: boolean }) {
    return (
        <div className="bg-white border border-slate-200 hover:shadow-xl hover:border-blue-100 transition-all rounded-2xl group flex flex-col h-full relative overflow-hidden">

            {/* 1. Área Clickable (Info) */}
            <Link href={`/jobs/${job.id}`} className="p-6 flex-grow flex flex-col">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-blue-600 transition-colors">
                    💼
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {job.title}
                </h2>

                <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {job.description}
                </p>

                {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto pt-2">
                        {job.tags.slice(0, 3).map(tag => (
                            <span key={tag.id} className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase px-2 py-1 rounded-md border border-slate-100">
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </Link>

            {/* 2. Sección de Acción (Botón Ver oferta) */}
            <div className="px-6 pb-6 pt-2 space-y-4">
                <div className="flex justify-between items-center text-sm border-t border-slate-50 pt-4 mb-3">
                    <span className="font-bold text-slate-900">
                        {job.salary ? `$${job.salary}` : 'Sueldo a convenir'}
                    </span>
                </div>

                {hasApplied ? (
                    <Link
                        href={`/jobs/${job.id}`}
                        className="flex items-center justify-center gap-2 w-full text-center bg-green-100 border border-green-200 text-green-700 font-bold py-3 rounded-xl transition-all cursor-pointer hover:bg-green-200"
                    >
                        <CheckCircle size={18} />
                        Ya te postulaste
                    </Link>
                ) : (
                    <Link
                        href={`/jobs/${job.id}`}
                        className="block w-full text-center bg-slate-900 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition-all"
                    >
                        Ver Oferta
                    </Link>
                )}
            </div>
        </div>
    );
}
