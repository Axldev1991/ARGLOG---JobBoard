"use client"
import { Input } from "@/components/ui/input";
import { loginUser } from "@/actions/login";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { EMPTY_ACTION_STATE } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";

export default function LoginPage() {
    const router = useRouter();
    const [state, formAction] = useActionState(loginUser, EMPTY_ACTION_STATE);

    useEffect(() => {
        if (state.success) {
            toast.success("¡Bienvenido de nuevo!");
            router.push("/dashboard");
            router.refresh();
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <div className="border border-border p-8 rounded-xl shadow-lg w-full max-w-[400px] bg-card text-card-foreground">
                <form action={formAction} className="flex flex-col gap-5">
                    <div className="text-center mb-2">
                        <h1 className="font-bold text-3xl text-foreground">Iniciar Sesión</h1>
                        <p className="text-muted-foreground text-sm mt-1">Ingresa a tu cuenta para continuar</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Email o CUIT</label>
                        <Input
                            type="text"
                            name="identifier"
                            placeholder="Usuario o 20-12345678-9"
                            className="bg-background border-input focus:ring-primary transition-colors"
                        />
                        <FormError errors={state.errors?.identifier} />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Contraseña</label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="bg-background border-input focus:ring-primary transition-colors"
                        />
                        <FormError errors={state.errors?.password} />
                    </div>

                    <SubmitButton className="w-full mt-2 font-bold text-md shadow-md hover:shadow-lg transition-all" loadingText="Ingresando...">
                        Ingresar
                    </SubmitButton>
                </form>

                <div className="mt-8 text-center text-sm border-t border-border pt-6">
                    <p className="text-muted-foreground">
                        ¿No tienes cuenta?{" "}
                        <Link href="/register" className="text-primary hover:text-primary/80 hover:underline font-bold transition-colors">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}