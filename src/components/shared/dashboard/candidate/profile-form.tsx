"use client";

import { useState } from "react";
import { User, Mail, Briefcase, MapPin, Phone, Linkedin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/actions/update-profile";

export function ProfileForm({ user }: { user: any }) {
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSavingProfile(true);
        const formData = new FormData(e.currentTarget);

        await updateProfile(formData);
        setIsSavingProfile(false);
    }

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <User className="text-blue-600" size={20} />
                <h3 className="text-lg font-bold">Información Profesional</h3>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">

                {/* CAMPO: NOMBRE */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input
                            name="name"
                            defaultValue={user.name || ""}
                            className="pl-10 font-medium"
                            placeholder="Tu nombre completo"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input
                            name="email"
                            value={user.email}
                            disabled
                            className="pl-10 bg-slate-50 text-slate-500 border-slate-200 cursor-not-allowed"
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">El email no se puede cambiar.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Titular Profesional</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input
                            name="headline"
                            placeholder="Ej: Senior React Developer | UX Specialist"
                            className="pl-10"
                            defaultValue={user.headline || ""}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Breve descripción que aparecerá bajo tu nombre.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad / Ubicación</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <Input
                                name="city"
                                placeholder="Ej: Buenos Aires, CABA"
                                className="pl-10"
                                defaultValue={user.city || ""}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <Input
                                name="phone"
                                placeholder="+54 9 11 1234 5678"
                                className="pl-10"
                                defaultValue={user.phone || ""}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Perfil de LinkedIn</label>
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <Input
                            name="linkedin"
                            placeholder="https://linkedin.com/in/tu-usuario"
                            className="pl-10"
                            defaultValue={user.linkedin || ""}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sobre Mí (Bio)</label>
                    <textarea
                        name="bio"
                        rows={4}
                        className="w-full rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Cuéntanos sobre tu experiencia, habilidades y lo que buscas en tu próximo desafío..."
                        defaultValue={user.bio || ""}
                    ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                    <Button disabled={isSavingProfile} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]">
                        {isSavingProfile ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                            </>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
