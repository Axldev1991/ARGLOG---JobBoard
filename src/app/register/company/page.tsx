import { CompanyForm } from "../components/company-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CompanyRegisterPage() {
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
                            Registro de Empresa
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm">
                            Solicitá el alta de tu empresa para publicar vacantes.
                        </p>
                    </div>

                    <CompanyForm />
                </div>
            </div>
        </main>
    );
}
