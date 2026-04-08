"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerCompany } from "@/actions/company/register-company";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CompanyForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCompanySubmit = async (formData: FormData) => {
        setIsLoading(true);
        const toastId = toast.loading("Enviando solicitud...");

        try {
            const result = await registerCompany(formData);

            if (result?.error) {
                toast.error(result.error, { id: toastId });
            } else if (result?.success) {
                toast.success(result.message, { id: toastId });
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            }
        } catch (error) {
            toast.error("Error inesperado al registrarse", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form action={handleCompanySubmit} className="flex flex-col gap-5">
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Razón Social</label>
                <Input type="text" name="legalName" placeholder="Ej: Logística Sur S.R.L." required className="bg-background border-input focus:ring-primary" />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">CUIT</label>
                <Input type="text" name="cuit" placeholder="Ej: 30123456789" required minLength={8} maxLength={15} className="bg-background border-input focus:ring-primary" />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Email Corporativo</label>
                <Input type="email" name="email" placeholder="contacto@empresa.com" required className="bg-background border-input focus:ring-primary" />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Contraseña</label>
                <Input type="password" name="password" placeholder="••••••••" required minLength={6} className="bg-background border-input focus:ring-primary" />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-700">
                <p className="font-semibold">Solicitud en revisión</p>
                <p className="mt-1">Tu solicitud será revisada por un administrador. Recibirás un email cuando sea aprobada.</p>
            </div>

            <Button
                type="submit"
                className="w-full mt-4 font-bold text-lg h-12 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all bg-slate-900 hover:bg-slate-800 text-white"
                disabled={isLoading}
            >
                {isLoading ? "Enviando..." : "Enviar Solicitud de Registro"}
            </Button>
        </form>
    );
}
