"use client";

import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCompanyProfile } from "@/actions/company/update-profile";
import { toast } from "sonner";
import { Building2, Globe } from "lucide-react";
import { UpdatePasswordModal } from "@/components/shared/update-password-form";
import { LogoUpload } from "./logo-upload";
import { EMPTY_ACTION_STATE } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";

interface CompanyProfile {
    id: number;
    legalName: string;
    cuit: string;
    industry: string;
    description?: string | null;
    website?: string | null;
    logo?: string | null;
    logoPublicId?: string | null;
}

interface CompanyProfileFormProps {
    profile: CompanyProfile | null | undefined;
}

export function CompanyProfileForm({ profile }: CompanyProfileFormProps) {
    const [state, formAction] = useActionState(updateCompanyProfile, EMPTY_ACTION_STATE);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form action={formAction} className="bg-card rounded-3xl border border-border shadow-sm p-8 md:p-10 w-full overflow-hidden">
            <h2 className="text-2xl font-bold text-card-foreground mb-10 flex items-center gap-3 border-b border-border pb-6">
                <Building2 className="text-primary" size={28} />
                Identidad de Empresa
            </h2>

            <div className="space-y-8">

                {/* LOGO UPGRADE */}
                <LogoUpload profile={profile} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="legalName" className="text-foreground">Razón Social / Nombre Comercial</Label>
                        <Input
                            id="legalName"
                            name="legalName"
                            defaultValue={profile?.legalName || ""}
                            className="mt-1.5 bg-background border-input"
                            placeholder="Ej: Logística Sur S.R.L."
                        />
                        <FormError errors={state.errors?.legalName} />
                    </div>
                    <div>
                        <Label htmlFor="industry" className="text-foreground">Industria / Sector</Label>
                        <div className="relative mt-1.5">
                            <select
                                id="industry"
                                name="industry"
                                defaultValue={profile?.industry || "Logística"}
                                className="w-full h-10 pl-3 pr-10 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none text-foreground"
                            >
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
                        <FormError errors={state.errors?.industry} />
                    </div>
                </div>

                <div>
                    <Label htmlFor="website" className="text-foreground">Sitio Web</Label>
                    <div className="relative mt-1.5">
                        <Globe size={16} className="absolute left-3 top-3 text-muted-foreground" />
                        <Input
                            id="website"
                            name="website"
                            defaultValue={profile?.website || ""}
                            className="pl-9 bg-background border-input"
                            placeholder="https://tuempresa.com"
                        />
                    </div>
                    <FormError errors={state.errors?.website} />
                </div>

                <div>
                    <Label htmlFor="description" className="text-foreground">Descripción de la Empresa</Label>
                    <div className="relative mt-1.5">
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={profile?.description || ""}
                            rows={4}
                            className="w-full p-3 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-muted-foreground text-foreground"
                            placeholder="Cuéntanos qué hace tu empresa, su cultura y misión..."
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">Esta info aparecerá en tus ofertas.</p>
                    <FormError errors={state.errors?.description} />
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                    <UpdatePasswordModal />
                    <SubmitButton type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]">
                        Guardar Cambios
                    </SubmitButton>
                </div>

            </div>
        </form>
    );
}
