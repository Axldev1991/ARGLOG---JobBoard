"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadCV } from "@/actions/upload-cv";
import { updateProfile } from "@/actions/update-profile";
import { deleteCV } from "@/actions/delete-cv";
import {
    Loader2,
    UploadCloud,
    FileText,
    CheckCircle,
    AlertCircle,
    User,
    Briefcase,
    MapPin,
    Phone,
    Linkedin,
    Trash2,
    Mail
} from "lucide-react";
import { isProfileComplete } from "@/lib/utils";

export function CandidateView({ user }: { user: any }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const profileComplete = isProfileComplete(user);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 🛡️ VALIDACIÓN DE TAMAÑO (Frontend)
        // 5MB = 5 * 1024 * 1024 bytes
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("El archivo es muy pesado. Máximo 5MB.");
            return;
        }

        setIsUploading(true);
        setUploadError("");

        const formData = new FormData();
        formData.append("cv", file);

        try {
            const result = await uploadCV(formData);
            if (!result?.success) {
                setUploadError(result?.error || "Error desconocido");
            }
        } catch (err) {
            setUploadError("Error de conexión al subir el archivo.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSavingProfile(true);
        const formData = new FormData(e.currentTarget);

        await updateProfile(formData);
        setIsSavingProfile(false);
    }

    return (
        <div className="max-w-6xl mx-auto text-white">

            {/* Header: Bienvenida */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Hola, {user.name} 👋</h1>
                    <p className="text-slate-500">Bienvenido a tu panel de control.</p>
                </div>
            </div>

            {/* Warning Banner: Perfil Incompleto */}
            {!profileComplete && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-amber-900">Tu perfil está incompleto</h3>
                        <p className="text-amber-700 text-sm">
                            Para poder postularte a las ofertas, necesitas completar tu información profesional y subir tu CV.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUMNA IZQUIERDA: DATOS PERSONALES (2 cols span) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800">
                        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                            <User className="text-blue-600" size={20} />
                            <h3 className="text-lg font-bold">Información Profesional</h3>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                    <Input
                                        name="email"
                                        value={user.email}
                                        disabled // <--- LA CLAVE
                                        className="pl-10 bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed" // Estilos "grisáceos"
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
                </div>

                {/* COLUMNA DERECHA: CV y STATUS */}
                <div className="space-y-6">
                    {/* TARJETA CV */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <FileText className="text-indigo-600" size={20} />
                                <h3 className="text-lg font-bold">Curriculum Vitae</h3>
                            </div>
                            {user.resumeUrl ? (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                    <CheckCircle size={10} /> Listo
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold">
                                    <AlertCircle size={10} /> Pendiente
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-slate-600 mb-6">
                            Es obligatorio tener un CV cargado para postularte.
                        </p>

                        {/* Si ya hay CV, mostramos acciones */}
                        {user.resumeUrl && !isUploading && (
                            <div className="mb-4 flex gap-2">
                                <a
                                    href={user.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-100 hover:text-slate-900 transition-all text-sm group"
                                >
                                    <FileText size={16} className="text-slate-400 group-hover:text-slate-600" />
                                    Descargar Actual
                                </a>

                                {/* Botón Borrar */}
                                <form action={deleteCV}>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        className="h-full border-slate-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3"
                                        title="Borrar CV"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </form>
                            </div>
                        )}

                        {/* Área de Carga */}
                        <div className="mt-auto">
                            <label className={`relative block border-2 border-dashed ${isUploading ? 'border-indigo-300 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'} rounded-xl p-6 text-center transition-all cursor-pointer group`}>

                                {isUploading ? (
                                    <div className="flex flex-col items-center justify-center py-2">
                                        <Loader2 className="animate-spin text-indigo-600 mb-2" size={24} />
                                        <p className="text-xs font-medium text-indigo-700">Subiendo...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-2 flex justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                            <UploadCloud size={32} />
                                        </div>
                                        <span className="inline-flex items-center justify-center rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-black py-2 px-3 w-full transition-transform active:scale-95">
                                            {user.resumeUrl ? "Reemplazar PDF" : "Subir PDF"}
                                        </span>
                                    </>
                                )}

                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    disabled={isUploading}
                                    onChange={handleFileChange}
                                />
                            </label>

                            {uploadError && (
                                <p className="text-red-500 text-xs mt-3 text-center font-medium bg-red-50 p-2 rounded-lg border border-red-100">
                                    {uploadError}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}