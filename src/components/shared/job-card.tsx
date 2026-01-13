import Link from "next/link";
import { Tag } from "@prisma/client"; // Usamos el tipo real de Prisma si queremos, o definimos uno local simple

interface JobWithTags {
    id: number;
    title: string;
    description: string;
    salary: string | null;
    tags?: { id: number, name: string }[];
}

export function JobCard({ job }: { job: JobWithTags }) {
    return (
        <Link href={`/jobs/${job.id}`} className="block h-full">
            <div className="bg-white border hover:shadow-lg transition-all p-6 rounded-xl group cursor-pointer h-full flex flex-col relative overflow-hidden">

                {/* Decoración sutil de fondo (opcional) */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl text-blue-500">💼</span>
                </div>

                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors z-10">
                    💼
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2 z-10">{job.title}</h2>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2 z-10 flex-grow">
                    {job.description}
                </p>

                {/* Sección de TAGS (Preparada para recibir datos) */}
                {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 mt-2">
                        {job.tags.slice(0, 3).map(tag => (
                            <span key={tag.id} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md border border-slate-200">
                                {tag.name}
                            </span>
                        ))}
                        {job.tags.length > 3 && (
                            <span className="text-xs text-slate-400 self-center">+{job.tags.length - 3}</span>
                        )}
                    </div>
                )}

                <div className="flex justify-between items-end mt-auto border-t border-gray-100 pt-4 z-10">
                    <span className="font-semibold text-blue-600">
                        {job.salary ? `$${job.salary}` : 'Consultar'}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                        Ver detalle →
                    </span>
                </div>
            </div>
        </Link>
    );
}
