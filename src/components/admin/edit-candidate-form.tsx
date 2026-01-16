"use client";

import { updateCandidate } from "@/actions/admin/update-candidate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CandidateProps {
    id: number;
    name: string;
    email: string;
    headline: string | null;
    bio: string | null;
    city: string | null;
    linkedin: string | null;
    phone: string | null;
    resumeUrl: string | null;
}

export function EditCandidateForm({ candidate }: { candidate: CandidateProps }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const toastId = toast.loading("Guardando cambios...");

        try {
            const result = await updateCandidate(candidate.id, formData);

            if (result.error) {
                toast.error(result.error, { id: toastId });
            } else {
                toast.success("¡Candidato actualizado correctamente!", { id: toastId });
                router.refresh();
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
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <User size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Editar Candidato</h1>
                    <p className="text-muted-foreground text-sm">Modifica el perfil profesional del usuario.</p>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-6">

                {/* SECCIÓN 1: IDENTIDAD */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Información Básica</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Nombre Completo</label>
                            <Input name="name" defaultValue={candidate.name} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Email</label>
                            <Input type="email" name="email" defaultValue={candidate.email} required />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-medium">Titular Profesional (Headline)</label>
                            <Input name="headline" defaultValue={candidate.headline || ""} placeholder="Ej: Senior Frontend Developer" />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: PERFIL */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Perfil Profesional</h2>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Biografía / Sobre Mí</label>
                        <Textarea name="bio" defaultValue={candidate.bio || ""} className="h-32" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Ubicación (Ciudad/País)</label>
                            <Input name="city" defaultValue={candidate.city || ""} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">LinkedIn URL</label>
                            <Input name="linkedin" defaultValue={candidate.linkedin || ""} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Teléfono</label>
                            <Input name="phone" defaultValue={candidate.phone || ""} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">CV URL (PDF)</label>
                            <Input name="resumeUrl" defaultValue={candidate.resumeUrl || ""} placeholder="https://..." />
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex gap-4">
                    <Link href="/admin/dashboard" className="w-1/3">
                        <Button variant="outline" type="button" className="w-full h-12">Cancelar</Button>
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
