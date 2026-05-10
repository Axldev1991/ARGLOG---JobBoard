"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { registerCompany } from "@/actions/company/register-company";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EMPTY_ACTION_STATE } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";

export function CompanyForm() {
    const router = useRouter();
    const [state, formAction] = useActionState(registerCompany, EMPTY_ACTION_STATE);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={formAction} className="flex flex-col gap-5">
            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Razón Social</label>
                <Input type="text" name="legalName" placeholder="Ej: Logística Sur S.R.L." className="bg-background border-input focus:ring-primary" />
                <FormError errors={state.errors?.legalName} />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">CUIT</label>
                <Input type="text" name="cuit" placeholder="Ej: 30123456789" className="bg-background border-input focus:ring-primary" />
                <FormError errors={state.errors?.cuit} />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Email Corporativo</label>
                <Input type="email" name="email" placeholder="contacto@empresa.com" className="bg-background border-input focus:ring-primary" />
                <FormError errors={state.errors?.email} />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Contraseña</label>
                <Input type="password" name="password" placeholder="••••••••" className="bg-background border-input focus:ring-primary" />
                <FormError errors={state.errors?.password} />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm text-yellow-700">
                <p className="font-semibold">Solicitud en revisión</p>
                <p className="mt-1">Tu solicitud será revisada por un administrador. Recibirás un email cuando sea aprobada.</p>
            </div>

            <SubmitButton
                type="submit"
                className="w-full mt-4 font-bold text-lg h-12 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all bg-slate-900 hover:bg-slate-800 text-white"
                loadingText="Enviando..."
            >
                Enviar Solicitud de Registro
            </SubmitButton>
        </form>
    );
}
