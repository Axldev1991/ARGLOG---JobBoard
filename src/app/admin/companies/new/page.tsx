"use client";

import { createCompany } from "@/actions/admin/create-company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewCompanyPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const toastId = toast.loading("Creando empresa y enviando credenciales...");

        try {
            const result = await createCompany(formData);

            if (result.error) {
                toast.error(result.error, { id: toastId });
            } else {
                toast.success("¡Empresa creada con éxito! Se ha enviado el email de bienvenida.", { id: toastId });
                // Limpiar el form o redirigir
                setTimeout(() => router.push("/dashboard"), 2000);
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="container max-w-2xl mx-auto py-10 px-4">

            <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Volver al Dashboard
            </Link>

            <div className="bg-white border rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b pb-6">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                        <Building2 size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Alta de Nueva Empresa</h1>
                        <p className="text-slate-500 text-sm">Crea el perfil, genera credenciales y notifica al cliente.</p>
                    </div>
                </div>

                <form action={handleSubmit} className="space-y-6">

                    {/* SECCIÓN 1: IDENTIDAD COMERCIAL */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Identidad Comercial</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Nombre Comercial</label>
                                <Input name="name" placeholder="Ej: TechCorp" required />
                                <p className="text-xs text-slate-400">Visible en las ofertas</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Sitio Web</label>
                                <Input name="website" placeholder="https://..." />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: DATOS LEGALES */}
                    <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Datos Fiscales</h2>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Razón Social</label>
                            <Input name="legalName" placeholder="Ej: Technology Corporation S.A." required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">CUIT</label>
                                <Input name="cuit" placeholder="20-12345678-9" required />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Rubro / Industria</label>
                                <Input name="industry" placeholder="Ej: Logística, Software..." required />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 3: ACCESO */}
                    <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Acceso y Contacto</h2>

                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3 text-sm text-amber-800">
                            <span>⚠️</span>
                            <p>Se enviará un email a esta dirección con una <strong>contraseña temporal</strong> generada automáticamente.</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Email del Responsable</label>
                            <Input type="email" name="email" placeholder="rrhh@empresa.com" required />
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-lg font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creando Empresa..." : "Dar de Alta Empresa"}
                        </Button>
                    </div>

                </form>
            </div>
        </main>
    );
}