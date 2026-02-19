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
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex justify-center relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40 dark:opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-blue-400/10 blur-[100px] rounded-full" />
            </div>

            <div className="w-full max-w-4xl space-y-8 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-2 transition-colors font-medium">
                            <ArrowLeft size={16} /> Volver al Panel
                        </Link>
                        <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">Publicar Nueva Oferta</h1>
                        <p className="text-muted-foreground mt-1 font-medium">Busca el mejor talento creando una oferta atractiva.</p>
                    </div>
                </div>

                {/* Card del Formulario - Glassmorphism */}
                <div className="bg-card/40 backdrop-blur-[var(--glass-blur)] border-[var(--glass-border)] rounded-3xl p-8 shadow-2xl relative overflow-hidden dark:bg-card dark:backdrop-blur-none dark:rounded-2xl dark:border-border">
                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

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