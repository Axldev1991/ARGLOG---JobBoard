"use client";

import React, { useState, useEffect, useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagSelector } from "@/components/ui/tag-selector";
import { ArrowLeft, Briefcase, MapPin, DollarSign, LayoutGrid, Globe, FileText, CheckCircle2, Save } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useRouter } from "next/navigation";
import { EMPTY_ACTION_STATE } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface JobFormProps {
    action: (prevState: any, formData: FormData) => Promise<any>;
    initialData?: {
        id?: number;
        title: string;
        description: string;
        salary?: string | null;
        category: string;
        modality: string;
        location?: string | null;
        expiresAt?: Date | null;
        tags?: { id: number; name: string; type: string }[];
    };
    availableTags: { id: number; name: string; type: string }[];
    isEditing?: boolean;
}

export function JobForm({ action, initialData, availableTags, isEditing = false }: JobFormProps) {
    const router = useRouter();
    const [state, formAction] = useActionState(action, EMPTY_ACTION_STATE);

    const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initialData?.tags?.map(t => t.id) || []);
    const [description, setDescription] = useState(initialData?.description || "");

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            router.push("/dashboard/company");
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={formAction} className="space-y-8 relative z-10 w-full">

            {isEditing && initialData?.id && (
                <input type="hidden" name="jobId" value={initialData.id} />
            )}

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                    <Briefcase className="text-primary" size={20} /> Detalles del Puesto
                </h2>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Título de la Oferta</label>
                        <Input
                            name="title"
                            defaultValue={initialData?.title}
                            placeholder="Ej: Gerente de Logística, Operario de Depósito"
                            className={cn(
                                "bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-primary h-12 text-lg",
                                state.errors?.title && "border-red-500 focus:ring-red-500"
                            )}
                        />
                        <FormError errors={state.errors?.title} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <LayoutGrid size={16} /> Categoría
                            </label>
                            <div className="relative">
                                <select
                                    name="category"
                                    defaultValue={initialData?.category || "Otros"}
                                    className={cn(
                                        "w-full h-11 pl-3 pr-10 py-2 bg-background border border-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none",
                                        state.errors?.category && "border-red-500"
                                    )}
                                >
                                    <option value="Desarrollo">Desarrollo</option>
                                    <option value="Diseño">Diseño</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Ventas">Ventas</option>
                                    <option value="Producto">Producto</option>
                                    <option value="Data">Data & Analytics</option>
                                    <option value="Logística">Logística</option>
                                    <option value="Otros">Otros</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-muted-foreground">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                </div>
                            </div>
                            <FormError errors={state.errors?.category} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <DollarSign size={16} /> Salario (Mensual)
                            </label>
                            <Input
                                name="salary"
                                defaultValue={initialData?.salary || "A convenir"}
                                placeholder="Ej: $1,500 - $2,500 USD o A convenir"
                                className={cn(
                                    "bg-background border-input text-foreground placeholder:text-muted-foreground",
                                    state.errors?.salary && "border-red-500"
                                )}
                            />
                            <FormError errors={state.errors?.salary} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                📅 Cierre (Opcional)
                            </label>
                            <Input
                                type="date"
                                name="expiresAt"
                                defaultValue={initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : ""}
                                className={cn(
                                    "bg-background border-input text-foreground placeholder:text-muted-foreground appearance-none w-full",
                                    state.errors?.expiresAt && "border-red-500"
                                )}
                            />
                            <FormError errors={state.errors?.expiresAt} />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Ubicación y Modalidad */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2 mt-8">
                    <Globe className="text-indigo-500" size={20} /> Ubicación y Modalidad
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Modalidad de Trabajo</label>
                        <div className="relative">
                            <select
                                name="modality"
                                defaultValue={initialData?.modality || "Remoto"}
                                className="w-full h-11 pl-3 pr-10 py-2 bg-background border border-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                            >
                                <option value="Remoto">Remoto 100%</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="Presencial">Presencial</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-muted-foreground">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <MapPin size={16} /> Ciudad / País
                        </label>
                        <Input
                            name="location"
                            defaultValue={initialData?.location || ""}
                            placeholder="Ej: Buenos Aires, Argentina"
                            className={cn(
                                "bg-background border-input text-foreground placeholder:text-muted-foreground",
                                state.errors?.location && "border-red-500"
                            )}
                        />
                        <FormError errors={state.errors?.location} />
                    </div>
                </div>
            </div>

            {/* 3. Skills y Descripción */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2 mt-8">
                    <FileText className="text-emerald-500" size={20} /> Descripción y Habilidades
                </h2>

                <div className={cn(
                    "bg-muted/30 p-6 rounded-xl border border-border",
                    state.errors?.tags && "border-red-500 bg-red-500/5"
                )}>
                    <label className="block text-sm font-medium text-muted-foreground mb-4">
                        Habilidades Requeridas (Skills)
                    </label>
                    {/* Input oculto para tags */}
                    <input type="hidden" name="tags" value={JSON.stringify(selectedTagIds)} />
                    <TagSelector 
                        availableTags={availableTags} 
                        initialSelectedIds={selectedTagIds} 
                        onChange={setSelectedTagIds}
                    />
                    <FormError errors={state.errors?.tags} />
                    <p className="text-xs text-muted-foreground mt-2">Selecciona las tecnologías o habilidades clave para el puesto.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Descripción Detallada</label>
                    {/* Input oculto para que FormData lo capture al enviar */}
                    <input type="hidden" name="description" value={description} />

                    <div className={cn(state.errors?.description && "border border-red-500 rounded-lg overflow-hidden")}>
                        <RichTextEditor
                            value={description}
                            onChange={setDescription}
                        />
                    </div>
                    <FormError errors={state.errors?.description} />
                </div>
            </div>

            {/* Footer de Acciones */}
            <div className="pt-8 border-t border-border flex items-center justify-end gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" type="button" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                        Cancelar
                    </Button>
                </Link>
                <SubmitButton
                    type="submit"
                    loadingText={isEditing ? "Guardando..." : "Publicando..."}
                    className="h-14 px-10 font-black text-lg rounded-2xl transition-all active:translate-y-[2px] active:shadow-[0_2px_0_0_#1e3a8a] active:scale-[0.98] bg-gradient-to-b from-primary via-primary to-blue-800 text-white shadow-[0_6px_0_0_#1e3a8a,0_15px_30px_-10px_rgba(var(--primary),0.5),inset_0_1px_0_0_rgba(255,255,255,0.4),inset_0_-2px_0_0_rgba(0,0,0,0.2)] ring-1 ring-primary/20 hover:shadow-[0_8px_0_0_#1e3a8a,0_20px_40px_-15px_rgba(var(--primary),0.7)] hover:-translate-y-[2px] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:h-1/2 dark:bg-primary dark:from-primary dark:to-primary dark:text-blue-900 dark:shadow-none dark:ring-0 dark:before:hidden dark:active:translate-y-0 dark:hover:translate-y-0 dark:font-bold"
                >
                    {isEditing ? (
                        <div className="relative z-10 flex items-center"><Save size={20} className="mr-2" /> Guardar Cambios</div>
                    ) : (
                        <div className="relative z-10 flex items-center"><CheckCircle2 size={20} className="mr-2" /> Publicar Oferta</div>
                    )}
                </SubmitButton>
            </div>

        </form>
    );
}
