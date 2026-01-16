"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagSelector } from "@/components/ui/tag-selector";
import { ArrowLeft, Briefcase, MapPin, DollarSign, LayoutGrid, Globe, FileText, CheckCircle2, Save } from "lucide-react";
import Link from "next/link";

interface JobFormProps {
    action: (formData: FormData) => Promise<void>;
    initialData?: {
        id?: number;
        title: string;
        description: string;
        salary?: string | null;
        category: string; // Valores por defecto: 'Otros'
        modality: string; // 'Remoto', etc
        location?: string | null;
        expiresAt?: Date | null;
        tags?: { id: number; name: string; type: string }[];
    };
    availableTags: { id: number; name: string; type: string }[];
    isEditing?: boolean;
}

export function JobForm({ action, initialData, availableTags, isEditing = false }: JobFormProps) {

    // Necesitamos pasarle al TagSelector los IDs ya seleccionados si estamos editando
    // Pero el TagSelector es Client Component y maneja su estado interno.
    // Tendremos que actualizar TagSelector para aceptar `initialSelectedIds`.
    const initialTagIds = initialData?.tags?.map(t => t.id) || [];

    return (
        <form action={action} className="space-y-8 relative z-10 w-full">

            {/* Si estamos editando, necesitamos enviar el ID oculto */}
            {isEditing && initialData?.id && (
                <input type="hidden" name="jobId" value={initialData.id} />
            )}

            {/* 1. Detalles Básicos */}
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
                            placeholder="Ej: Senior Frontend Developer"
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:ring-primary h-12 text-lg"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <LayoutGrid size={16} /> Categoría
                            </label>
                            <div className="relative">
                                <select
                                    name="category"
                                    defaultValue={initialData?.category || "Otros"}
                                    className="w-full h-11 pl-3 pr-10 py-2 bg-background border border-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent appearance-none"
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
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <DollarSign size={16} /> Salario (Mensual)
                            </label>
                            <Input
                                name="salary"
                                defaultValue={initialData?.salary || ""}
                                placeholder="Ej: $1,500 - $2,500 USD"
                                className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                📅 Cierre (Opcional)
                            </label>
                            <Input
                                type="date"
                                name="expiresAt"
                                defaultValue={initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().split('T')[0] : ""}
                                className="bg-background border-input text-foreground placeholder:text-muted-foreground appearance-none w-full"
                            />
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
                            className="bg-background border-input text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Skills y Descripción */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2 mt-8">
                    <FileText className="text-emerald-500" size={20} /> Descripción y Habilidades
                </h2>

                <div className="bg-muted/30 p-6 rounded-xl border border-border">
                    <label className="block text-sm font-medium text-muted-foreground mb-4">
                        Habilidades Requeridas (Skills)
                    </label>
                    {/* Le pasamos todos los tags y los preseleccionados */}
                    <TagSelector availableTags={availableTags} initialSelectedIds={initialTagIds} />
                    <p className="text-xs text-muted-foreground mt-2">Selecciona las tecnologías o habilidades clave para el puesto.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Descripción Detallada</label>
                    <textarea
                        name="description"
                        defaultValue={initialData?.description}
                        placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
                        className="w-full bg-background border-input text-foreground rounded-lg p-4 min-h-[200px] focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-muted-foreground leading-relaxed"
                        required
                    />
                </div>
            </div>

            {/* Footer de Acciones */}
            <div className="pt-8 border-t border-border flex items-center justify-end gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" type="button" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                        Cancelar
                    </Button>
                </Link>
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-lg font-semibold shadow-lg shadow-primary/20">
                    {isEditing ? (
                        <div className="flex items-center"><Save size={20} className="mr-2" /> Guardar Cambios</div>
                    ) : (
                        <div className="flex items-center"><CheckCircle2 size={20} className="mr-2" /> Publicar Oferta</div>
                    )}
                </Button>
            </div>

        </form>
    );
}
