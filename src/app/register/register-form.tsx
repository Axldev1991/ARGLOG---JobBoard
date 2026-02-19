"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/actions/register";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SkillSelectorSet } from "@/components/ui/skill-selector-set";
import { Briefcase } from "lucide-react";

export function RegisterForm({ allTags }: { allTags: any[] }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const toastId = toast.loading("Creando tu cuenta...");

        // Forzamos el rol de CANDIDATE siempre
        formData.set("role", "candidate");

        try {
            const result = await registerUser(formData);

            if (result?.error) {
                toast.error(result.error, { id: toastId });
            } else if (result?.success) {
                toast.success("¡Cuenta creada con éxito!", { id: toastId });
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            }
        } catch (error) {
            toast.error("Error inesperado al registrarse", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form action={handleSubmit} className="flex flex-col gap-5">
            {/* Input oculto para el rol */}
            <input type="hidden" name="role" value="candidate" />

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Nombre Completo</label>
                <Input type="text" name="name" placeholder="Ej: Juan Pérez" required className="bg-background border-input focus:ring-primary" />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Email</label>
                <Input type="email" name="email" placeholder="nombre@ejemplo.com" required className="bg-background border-input focus:ring-primary" />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Contraseña</label>
                <Input type="password" name="password" placeholder="••••••••" required minLength={6} className="bg-background border-input focus:ring-primary" />
            </div>

            {/* SECCIÓN DE TAGS */}
            <div className="space-y-4 pt-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground ml-1 flex items-center gap-2">
                    <Briefcase size={14} className="text-primary" />
                    Tus Habilidades Logísticas
                </label>
                <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 shadow-inner">
                    <SkillSelectorSet
                        availableTags={allTags}
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full mt-4 font-bold text-lg h-12 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all bg-slate-900 hover:bg-slate-800 text-white"
                disabled={isLoading}
            >
                {isLoading ? "Creando cuenta..." : "Registrarme"}
            </Button>
        </form>
    );
}
