import { prisma } from "@/lib/db";
import Link from "next/link";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
    // Obtenemos las tags disponibles desde el servidor
    const allTags = await prisma.tag.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/50 p-6">
            <div className="border border-border p-8 rounded-2xl shadow-xl w-full max-w-lg bg-card text-card-foreground">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        Únete a ArLog
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Crea tu perfil profesional y encuentra tu próximo desafío.
                    </p>
                </div>

                <RegisterForm allTags={allTags} />

                <div className="mt-8 text-center text-sm border-t border-border pt-6">
                    <p className="text-muted-foreground">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="text-primary hover:text-primary/80 hover:underline font-bold transition-colors">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}