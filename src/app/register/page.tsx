"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/actions/register";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    // Ya no necesitamos state para el rol, es fijo.
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const toastId = toast.loading("Creando tu cuenta...");

        // Forzamos el rol de CANDIDATE siempre
        formData.set("role", "candidate"); // Ojo: en DB es minúscula 'candidate' por defecto en el schema viejo, o 'CANDIDATE' si usaste enum. 
        // Revisando tu schema: role String @default("candidate"). Así que usamos "candidate".

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
        <main className="flex min-h-screen items-center justify-center bg-muted/50 p-6">
            <div className="border border-border p-8 rounded-2xl shadow-xl w-full max-w-md bg-card text-card-foreground">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">
                        Únete a ArLog
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Crea tu perfil profesional y encuentra tu próximo desafío.
                    </p>
                </div>

                <form action={handleSubmit} className="flex flex-col gap-5">

                    {/* Input oculto para compatibilidad, aunque lo seteamos en handleSubmit tmb */}
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

                    <Button
                        type="submit"
                        className="w-full mt-4 font-bold text-lg h-12 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all bg-slate-900 hover:bg-slate-800 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creando cuenta..." : "Registrarme"}
                    </Button>
                </form>

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