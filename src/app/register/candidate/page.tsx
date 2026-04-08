import { prisma } from "@/lib/db";
import { CandidateForm } from "../components/candidate-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function CandidateRegisterPage() {
    const allTags = await prisma.tag.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/50 p-6">
            <div className="w-full max-w-lg">
                <Link 
                    href="/register" 
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm font-medium group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Volver a selección
                </Link>

                <div className="border border-border p-8 rounded-2xl shadow-xl bg-card text-card-foreground">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">
                            Registro de Talento
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Completá tus datos para empezar a postularte.
                        </p>
                    </div>

                    <CandidateForm allTags={allTags} />
                </div>
            </div>
        </main>
    );
}
