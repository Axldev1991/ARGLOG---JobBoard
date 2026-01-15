
import { updateJob } from "@/actions/update-job";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { JobForm } from "@/components/shared/job-form";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: Props) {
    const user = await getSession();
    if (!user) redirect("/login");

    const { id } = await params;
    const jobId = parseInt(id);

    // 1. Fetch Job & Tags
    const [job, tags] = await Promise.all([
        prisma.job.findUnique({
            where: { id: jobId },
            include: { tags: true }
        }),
        prisma.tag.findMany()
    ]);

    // 2. Security Check (Iron Dome)
    if (!job) {
        return <div className="text-white text-center p-10">Oferta no encontrada</div>;
    }

    const isOwner = job.authorId === user.id;
    const isAdmin = user.role === 'admin' || user.role === 'dev';

    if (!isOwner && !isAdmin) {
        return <div className="text-red-400 text-center p-10">⛔ No tienes permiso para editar esta oferta.</div>;
    }

    return (
        <main className="min-h-screen bg-[#020817] py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="w-full max-w-4xl space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
                            <ArrowLeft size={16} /> Volver al Panel
                        </Link>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Editar Oferta</h1>
                        <p className="text-slate-400 mt-1">Actualiza los detalles de tu publicación.</p>
                    </div>
                </div>

                {/* Card del Formulario */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <JobForm
                        action={updateJob}
                        availableTags={tags}
                        initialData={job}
                        isEditing={true}
                    />
                </div>
            </div>
        </main>
    );
}
