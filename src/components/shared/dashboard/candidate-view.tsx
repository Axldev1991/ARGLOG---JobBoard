"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadCV } from "@/actions/upload-cv";
import { Loader2, UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";

export function CandidateView({ user }: { user: any }) {
    // --------------------------------------------------------------------------
    // 🧠 ESTADO CLIENT-SIDE & OPTIMISTIC UI
    // --------------------------------------------------------------------------
    // Aunque recibimos `user` del servidor (Server Component prop),
    // necesitamos estado local (`useState`) para manejar la interacción de carga
    // instantánea (Loader/Spinner) sin esperar a que la página recargue.
    // --------------------------------------------------------------------------
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError("");

        const formData = new FormData();
        formData.append("cv", file);

        try {
            // Llamamos a la Server Action directamente desde el Cliente
            const result = await uploadCV(formData);
            if (!result?.success) {
                setUploadError(result?.error || "Error desconocido");
            }
            // NOTA: Si es exitoso, `revalidatePath` en el servidor disparará
            // una actualización automática de este componente con los datos nuevos.
        } catch (err) {
            setUploadError("Error de conexión al subir el archivo.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto text-white">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Hola, {user.name} 👋</h1>
                    <p className="text-slate-400">Bienvenido a tu panel de control.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* TARJETA 1: DATOS PERSONALES */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800 h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">Editar</Button>
                    </div>
                    <h3 className="text-lg font-bold mb-1">Mi Perfil</h3>
                    <p className="text-sm text-slate-600 mb-6">Gestiona tu información personal.</p>

                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-slate-500 font-medium">Email</span>
                            <span className="font-semibold text-slate-900 truncate max-w-[200px]">{user.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-slate-500 font-medium">Rol</span>
                            <span className="capitalize bg-slate-100 px-3 py-1 rounded-full text-slate-700 font-bold text-xs">{user.role}</span>
                        </div>
                    </div>
                </div>

                {/* TARJETA 2: EL CV (La importante) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-slate-800 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                            <FileText size={24} />
                        </div>
                        {user.resumeUrl ? (
                            <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-bold">
                                <CheckCircle size={12} /> Completado
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-bold">
                                <AlertCircle size={12} /> Pendiente
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg font-bold mb-1">Curriculum Vitae</h3>
                    <p className="text-sm text-slate-600 mb-6">
                        {user.resumeUrl
                            ? "Tu CV está activo. Las empresas podrán verlo al postularte."
                            : "Sube tu CV en PDF para poder postular a las ofertas."}
                    </p>

                    {/* Si ya hay CV, mostramos acciones de visualización */}
                    {user.resumeUrl && !isUploading && (
                        <div className="mb-4">
                            <a
                                href={user.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-100 hover:text-slate-900 transition-all group"
                            >
                                <FileText size={18} className="text-slate-400 group-hover:text-slate-600" />
                                ⬇️ Descargar CV Actual
                            </a>
                        </div>
                    )}

                    {/* Área de Carga (Siempre visible, cambia texto si es actualizar) */}
                    <div className="mt-auto">
                        <label className={`relative block border-2 border-dashed ${isUploading ? 'border-indigo-300 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'} rounded-xl p-6 text-center transition-all cursor-pointer group`}>

                            {isUploading ? (
                                <div className="flex flex-col items-center justify-center py-2">
                                    <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
                                    <p className="text-sm font-medium text-indigo-700">Subiendo tu CV...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-3 flex justify-center text-slate-400 group-hover:text-indigo-500 transition-colors">
                                        <UploadCloud size={40} />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 mb-3">
                                        {user.resumeUrl ? "Haz clic para reemplazar tu CV" : "Arrastra tu PDF aquí o haz clic"}
                                    </p>

                                    <span className="inline-flex items-center justify-center rounded-lg text-sm font-bold bg-slate-900 text-white hover:bg-black py-2.5 px-4 w-full transition-transform active:scale-95 shadow-lg shadow-slate-200">
                                        {user.resumeUrl ? "🔄 Actualizar Archivo" : "📤 Subir CV (PDF)"}
                                    </span>
                                </>
                            )}

                            {/* Input Invisible */}
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
    );
}