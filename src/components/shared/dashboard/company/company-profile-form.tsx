"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCompanyProfile } from "@/actions/company/update-profile";
import { toast } from "sonner";
import { Loader2, Upload, Building2, Globe, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface CompanyProfileFormProps {
    profile: any; // Tipado laxo por ahora, idealmente CompanyProfile type
}

export function CompanyProfileForm({ profile }: CompanyProfileFormProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.logo || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("El logo no debe superar los 2MB");
                e.target.value = ""; // Reset
                return;
            }
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true);
        try {
            const res = await updateCompanyProfile(formData);
            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success(res.message);
            }
        } catch (error) {
            toast.error("Error inesperado al guardar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form action={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 w-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Building2 className="text-blue-600" />
                Información de la Empresa
            </h2>

            <div className="space-y-6">

                {/* LOGO */}
                <div>
                    <Label className="mb-2 block text-slate-700">Logo de la Empresa</Label>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-lg bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative group">
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <ImageIcon className="text-slate-300" size={32} />
                            )}
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                                <Upload size={16} />
                                {previewUrl ? "Cambiar Logo" : "Subir Logo"}
                            </Label>
                            <Input
                                id="logo-upload"
                                name="logo"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Recomendado: 200x200px (JPG, PNG). Máx 2MB.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="legalName" className="text-slate-700">Razón Social / Nombre Comercial</Label>
                        <Input
                            id="legalName"
                            name="legalName"
                            defaultValue={profile?.legalName || ""}
                            required
                            className="mt-1.5"
                            placeholder="Ej: Tech Solutions Inc."
                        />
                    </div>
                    <div>
                        <Label htmlFor="industry" className="text-slate-700">Industria / Sector</Label>
                        <div className="relative mt-1.5">
                            <select
                                id="industry"
                                name="industry"
                                defaultValue={profile?.industry || "Tecnología"}
                                className="w-full h-10 pl-3 pr-10 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
                    </div>
                </div>

                <div>
                    <Label htmlFor="website" className="text-slate-700">Sitio Web</Label>
                    <div className="relative mt-1.5">
                        <Globe size={16} className="absolute left-3 top-3 text-slate-400" />
                        <Input
                            id="website"
                            name="website"
                            defaultValue={profile?.website || ""}
                            className="pl-9"
                            placeholder="https://tuempresa.com"
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="description" className="text-slate-700">Descripción de la Empresa</Label>
                    <div className="relative mt-1.5">
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={profile?.description || ""}
                            rows={4}
                            className="w-full p-3 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                            placeholder="Cuéntanos qué hace tu empresa, su cultura y misión..."
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-right">Esta info aparecerá en tus ofertas.</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]">
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </Button>
                </div>

            </div>
        </form>
    );
}
