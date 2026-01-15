import { createJob } from "@/actions/create-job";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { JobForm } from "@/components/shared/job-form";

export default async function NewJobPage() {
    const user = await getSession();
    const tags = await prisma.tag.findMany();

    if (!user) {
        redirect("/login");
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
                        <h1 className="text-3xl font-bold text-white tracking-tight">Publicar Nueva Oferta</h1>
                        <p className="text-slate-400 mt-1">Busca el mejor talento creando una oferta atractiva.</p>
                    </div>
                </div>

                {/* Card del Formulario */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    {/* Usamos el componente reutilizable */}
                    <JobForm
                        action={createJob}
                        availableTags={tags}
                        initialData={{
                            title: "",
                            description: "",
                            category: "Otros",
                            modality: "Remoto"
                        }}
                    />
                </div>
            </div>
        </main>
    );
}