import { RegisterSelection } from "./components/register-selection";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/50 p-6">
            <div className="w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                        Únete a ArLog
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        La red de talento logístico más grande del país te espera. ¿Cómo querés empezar?
                    </p>
                </div>

                <RegisterSelection />

                <div className="mt-12 text-center text-sm">
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