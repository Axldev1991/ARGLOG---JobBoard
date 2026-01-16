"use client";

import { updateCompany } from "@/actions/admin/update-company";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Definimos qué forma tienen los datos que recibimos
interface CompanyProps {
    id: number;
    name: string;
    email: string;
    companyProfile: {
        legalName: string;
        cuit: string;
        industry: string;
        website: string | null;
    } | null;
}

export function EditCompanyForm({ company }: { company: CompanyProps }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const toastId = toast.loading("Guardando cambios...");

        try {
            // Pasamos el ID y el FormData a la Server Action
            const result = await updateCompany(company.id, formData);

            if (result.error) {
                toast.error(result.error, { id: toastId });
            } else {
                toast.success("¡Empresa actualizada correctamente!", { id: toastId });
                router.refresh(); // Refrescar datos en pantalla
                setTimeout(() => router.push("/admin/dashboard"), 1000);
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-border pb-6">
                <div className="bg-amber-500/10 p-3 rounded-lg text-amber-600 dark:text-amber-500">
                    <Building2 size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Editar Empresa</h1>
                    <p className="text-muted-foreground text-sm">Modifica los datos comerciales o legales.</p>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-6">

                {/* SECCIÓN 1: IDENTIDAD COMERCIAL */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Identidad Comercial</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Nombre Comercial</label>
                            <Input name="name" defaultValue={company.name} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Sitio Web</label>
                            <Input name="website" defaultValue={company.companyProfile?.website || ""} />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: DATOS LEGALES */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Datos Fiscales</h2>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Razón Social</label>
                        <Input name="legalName" defaultValue={company.companyProfile?.legalName} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">CUIT</label>
                            <Input name="cuit" defaultValue={company.companyProfile?.cuit} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Rubro / Industria</label>
                            <Input name="industry" defaultValue={company.companyProfile?.industry} required />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 3: CONTACTO */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Contacto</h2>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email del Responsable</label>
                        <Input type="email" name="email" defaultValue={company.email} required />
                    </div>
                </div>

                <div className="pt-6 flex gap-4">
                    <Link href="/admin/dashboard" className="w-1/3">
                        <Button variant="outline" className="w-full h-12">Cancelar</Button>
                    </Link>
                    <Button
                        type="submit"
                        className="w-2/3 bg-primary hover:bg-primary/90 h-12 text-lg font-semibold text-primary-foreground"
                        disabled={isLoading}
                    >
                        <Save className="mr-2" size={18} />
                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </div>

            </form>
        </div>
    );
}
