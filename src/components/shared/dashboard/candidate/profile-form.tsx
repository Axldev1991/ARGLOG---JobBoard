"use client";

import { useActionState, useEffect } from "react";
import { User as UserIcon, Mail, Briefcase, MapPin, Phone, Linkedin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/actions/update-profile";
import { UpdatePasswordModal } from "@/components/shared/update-password-form";
import { SkillSelectorSet } from "@/components/ui/skill-selector-set";
import { toast } from "sonner";
import { AvatarUpload } from "./avatar-upload";
import { EMPTY_ACTION_STATE } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";

interface Tag {
    id: number;
    name: string;
    type: string;
}

interface User {
    name?: string | null;
    email: string;
    headline?: string | null;
    city?: string | null;
    phone?: string | null;
    linkedin?: string | null;
    bio?: string | null;
    tags?: { id: number; name: string }[];
}

export function ProfileForm({ user, allTags = [] }: { user: User, allTags: Tag[] }) {
    const [state, formAction] = useActionState(updateProfile, EMPTY_ACTION_STATE);

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "¡Perfil actualizado con éxito!");
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state]);

    const userTagIds = user.tags?.map((t: any) => t.id) || [];

    return (
        <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm text-card-foreground">
            <AvatarUpload user={user} />

            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <UserIcon className="text-primary" size={20} />
                <h3 className="text-lg font-bold">Información Profesional</h3>
            </div>

            <form action={formAction} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Nombre Completo</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                        <Input
                            name="name"
                            defaultValue={user.name || ""}
                            className="pl-10 font-medium bg-background border-input"
                            placeholder="Tu nombre completo"
                        />
                    </div>
                    <FormError errors={state.errors?.name} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                            <Input
                                name="email"
                                value={user.email}
                                disabled
                                className="pl-10 bg-muted text-muted-foreground border-border cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <UpdatePasswordModal />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Titular Profesional</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                        <Input
                            name="headline"
                            placeholder="Ej: Supervisor de Almacén | Especialista en Logística"
                            className="pl-10 bg-background border-input"
                            defaultValue={user.headline || ""}
                        />
                    </div>
                    <FormError errors={state.errors?.headline} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Ciudad / Ubicación</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                            <Input
                                name="city"
                                placeholder="Ej: Buenos Aires, CABA"
                                className="pl-10 bg-background border-input"
                                defaultValue={user.city || ""}
                            />
                        </div>
                        <FormError errors={state.errors?.city} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Teléfono</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                            <Input
                                name="phone"
                                placeholder="+54 9 11 1234 5678"
                                className="pl-10 bg-background border-input"
                                defaultValue={user.phone || ""}
                            />
                        </div>
                        <FormError errors={state.errors?.phone} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Perfil de LinkedIn</label>
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
                        <Input
                            name="linkedin"
                            placeholder="https://linkedin.com/in/tu-usuario"
                            className="pl-10 bg-background border-input"
                            defaultValue={user.linkedin || ""}
                        />
                    </div>
                    <FormError errors={state.errors?.linkedin} />
                </div>

                {/* NUEVA SECCIÓN: TAGS (HABILIDADES) */}
                <div className="pt-4">
                    <label className="block text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                        <Briefcase className="text-primary" size={16} />
                        Mis Habilidades Principales
                    </label>
                    <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 shadow-sm">
                        <SkillSelectorSet
                            availableTags={allTags}
                            initialSelectedIds={userTagIds}
                        />
                    </div>
                    <FormError errors={state.errors?.tagIds} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Sobre Mí (Bio)</label>
                    <textarea
                        name="bio"
                        rows={4}
                        className="w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                        placeholder="Cuéntanos sobre tu experiencia, habilidades y lo que buscas en tu próximo desafío..."
                        defaultValue={user.bio || ""}
                    ></textarea>
                    <FormError errors={state.errors?.bio} />
                </div>

                <div className="flex justify-end pt-2">
                    <SubmitButton className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px]">
                        Guardar Cambios
                    </SubmitButton>
                </div>
            </form>
        </div>
    );
}
