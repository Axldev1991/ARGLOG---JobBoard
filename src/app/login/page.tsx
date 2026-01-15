"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/actions/login";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        // Toast de carga inicial (opcional, pero queda pro)
        const toastId = toast.loading("Verificando credenciales...");

        try {
            const result = await loginUser(formData);

            if (result?.error) {
                toast.error(result.error, { id: toastId });
            } else if (result?.success) {
                toast.success("¡Bienvenido de nuevo!", { id: toastId });
                // Pequeña pausa para que vea el check verde
                setTimeout(() => {
                    router.push("/dashboard");
                    router.refresh(); // Para actualizar la navbar y sesión
                }, 1000);
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="border border-slate-200 p-8 rounded-xl shadow-lg w-full max-w-[400px] bg-white text-slate-900">
                <form action={handleSubmit} className="flex flex-col gap-5">
                    <div className="text-center mb-2">
                        <h1 className="font-bold text-3xl text-slate-900">Iniciar Sesión</h1>
                        <p className="text-slate-500 text-sm mt-1">Ingresa a tu cuenta para continuar</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Email</label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="ejemplo@correo.com"
                            required
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Contraseña</label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        />
                    </div>

                    <Button className="w-full mt-2 font-bold text-md shadow-md hover:shadow-lg transition-all" disabled={isLoading}>
                        {isLoading ? "Ingresando..." : "Ingresar"}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
                    <p className="text-slate-500">
                        ¿No tienes cuenta?{" "}
                        <Link href="/register" className="text-blue-600 hover:text-blue-700 hover:underline font-bold transition-colors">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}