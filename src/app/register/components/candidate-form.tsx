"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/actions/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SkillSelectorSet } from "@/components/ui/skill-selector-set";
import { Briefcase } from "lucide-react";
import { EMPTY_ACTION_STATE } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";

export function CandidateForm({ allTags }: { allTags: any[] }) {
    const router = useRouter();
    const [state, formAction] = useActionState(registerUser, EMPTY_ACTION_STATE);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "¡Cuenta creada con éxito!");
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={formAction} className="flex flex-col gap-5">
            <input type="hidden" name="role" value="candidate" />

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Nombre Completo</label>
                <Input type="text" name="name" placeholder="Ej: Juan Pérez" className="bg-background border-input focus:ring-primary" />
                <FormError errors={state.errors?.name} />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Email</label>
                <Input type="email" name="email" placeholder="nombre@ejemplo.com" className="bg-background border-input focus:ring-primary" />
                <FormError errors={state.errors?.email} />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Contraseña</label>
                <Input type="password" name="password" placeholder="••••••••" className="bg-background border-input focus:ring-primary" />
                <FormError errors={state.errors?.password} />
            </div>

            <div className="space-y-4 pt-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1 flex items-center gap-2">
                    <Briefcase size={14} className="text-primary" />
                    Tus Habilidades Logísticas
                </label>
                <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 shadow-inner">
                    <SkillSelectorSet availableTags={allTags} />
                </div>
                <FormError errors={state.errors?.tagIds} />
            </div>

            <SubmitButton
                type="submit"
                className="w-full mt-4 font-bold text-lg h-12 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all bg-slate-900 hover:bg-slate-800 text-white"
                loadingText="Creando cuenta..."
            >
                Registrarme Ahora
            </SubmitButton>
        </form>
    );
}
