"use client";

import { useState } from "react";
import { FileText, CheckCircle, AlertCircle, Loader2, UploadCloud, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadCV } from "@/actions/upload-cv";
import { deleteCV } from "@/actions/delete-cv";

export function ResumeManager({ user }: { user: any }) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 🛡️ VALIDACIÓN DE TAMAÑO (Frontend)
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

    return (
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
                    <form action={async () => { await deleteCV(); }}>
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
    );
}
