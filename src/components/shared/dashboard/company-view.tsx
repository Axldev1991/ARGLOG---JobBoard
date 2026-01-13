"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteJob } from "@/actions/delete-jobs";

interface Job {
    id: number;
    title: string;
    salary: string | null;
}

export function CompanyView({ jobs }: { jobs: Job[] }) {
    return (
        <div className="p-10">
            <div className="p-10 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Mis Publicaciones ({jobs.length})</h1>
                    <Link href="/jobs/new">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            + Nueva Oferta
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {jobs.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <div className="text-4xl mb-4">📭</div>
                            <h3 className="text-lg font-medium text-slate-900">Aún no tienes ofertas publicadas</h3>
                            <p className="text-slate-500 mb-6">Comienza a publicar para encontrar talento.</p>
                            <Link href="/jobs/new">
                                <Button className="bg-slate-900 text-white">Publicar Primera Oferta</Button>
                            </Link>
                        </div>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="border p-4 rounded-xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
                                {/* Info Básica */}
                                <div>
                                    <h2 className="font-semibold text-lg text-slate-900">{job.title}</h2>
                                    <p className="text-sm text-slate-500">{job.salary ? `$${job.salary}` : 'Sin salario especificado'}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={`/jobs/${job.id}/edit`}>
                                        <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium h-9">
                                            Editar ✏️
                                        </Button>
                                    </Link>

                                    {/* Botón Eliminar (Formulario) */}
                                    <form action={deleteJob}>
                                        <input type="hidden" name="jobId" value={job.id} />
                                        <Button className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 h-9 hover:text-red-700" size="sm" type="submit">
                                            Eliminar 🗑️
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
