"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/actions/register";
import { registerCompany } from "@/actions/company/register-company";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SkillSelectorSet } from "@/components/ui/skill-selector-set";
import { Briefcase, Building2, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type RegisterTab = "candidate" | "company";

export function RegisterForm({ allTags }: { allTags: any[] }) {
    const [activeTab, setActiveTab] = useState<RegisterTab>("candidate");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleCandidateSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const toastId = toast.loading("Creando tu cuenta...");

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
        <div>
            {/* TABS */}
            <div className="flex mb-8 bg-muted/50 p-1 rounded-xl">
                <button
                    type="button"
                    onClick={() => setActiveTab("candidate")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all",
                        activeTab === "candidate"
                            ? "bg-card text-primary shadow-md"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Users size={18} />
                    Soy Candidato
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("company")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all",
                        activeTab === "company"
                            ? "bg-card text-primary shadow-md"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Building2 size={18} />
                    Soy Empresa
                </button>
            </div>

            {/* CANDIDATE FORM */}
            {activeTab === "candidate" && (
                <form action={handleCandidateSubmit} className="flex flex-col gap-5">
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

                    <div className="space-y-4 pt-2">
                        <label className="text-xs font-semibold uppercase text-muted-foreground ml-1 flex items-center gap-2">
                            <Briefcase size={14} className="text-primary" />
                            Tus Habilidades Logísticas
                        </label>
                        <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 shadow-inner">
                            <SkillSelectorSet availableTags={allTags} />
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
            )}

            {/* COMPANY FORM */}
            {activeTab === "company" && (
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
                        <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Email</label>
                        <Input type="email" name="email" placeholder="contacto@empresa.com" required className="bg-background border-input focus:ring-primary" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Contraseña</label>
                        <Input type="password" name="password" placeholder="••••••••" required minLength={6} className="bg-background border-input focus:ring-primary" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-muted-foreground ml-1">Industria</label>
                        <select
                            name="industry"
                            required
                            className="w-full h-10 px-3 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                        >
                            <option value="">Seleccionar industria...</option>
                            <option value="Tecnología">Tecnología & Software</option>
                            <option value="Finanzas">Finanzas & Fintech</option>
                            <option value="Salud">Salud & Biotech</option>
                            <option value="E-commerce">Retail & E-commerce</option>
                            <option value="Educación">Educación</option>
                            <option value="Servicios">Servicios Profesionales</option>
                            <option value="Logística">Logística & Transporte</option>
                            <option value="Otros">Otros</option>
                        </select>
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
                        {isLoading ? "Enviando..." : "Enviar Solicitud"}
                    </Button>
                </form>
            )}
        </div>
    );
}