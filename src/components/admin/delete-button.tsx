"use client";

import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, X, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteButtonProps {
    onDelete: () => Promise<{ error?: string; success?: boolean }>;
    loadingMessage?: string;
    successMessage?: string;
    description?: string; // Para screen readers o tooltips
}

export function DeleteButton({
    onDelete,
    loadingMessage = "Eliminando...",
    successMessage = "Eliminado correctamente",
    description = "Eliminar item"
}: DeleteButtonProps) {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        const toastId = toast.loading(loadingMessage);

        try {
            const result = await onDelete();

            if (result.error) {
                toast.error(result.error, { id: toastId });
                setIsLoading(false);
            } else {
                toast.success(successMessage, { id: toastId });
                setIsConfirming(false);
                setIsLoading(false);
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado", { id: toastId });
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`relative h-9 flex items-center justify-end overflow-hidden transition-all duration-300 ease-in-out ${isConfirming ? 'w-20' : 'w-8'
                }`}
        >
            {/* Capa 1: Botón de Basura (Inicial) */}
            <div
                className={`absolute right-0 top-0 transition-all duration-300 ease-in-out transform ${isConfirming ? 'translate-x-[150%] opacity-0' : 'translate-x-0 opacity-100'
                    }`}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsConfirming(true);
                    }}
                    title={description}
                >
                    <Trash2 size={16} />
                </Button>
            </div>

            {/* Capa 2: Confirmación (Deslizar desde derecha) */}
            <div
                className={`absolute right-0 top-0 flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200 shadow-sm transition-all duration-300 ease-cubic-bezier(0.4, 0, 0.2, 1) transform ${isConfirming ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'
                    }`}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full text-slate-500 hover:text-slate-700 hover:bg-white transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsConfirming(false);
                    }}
                    disabled={isLoading}
                    title="Cancelar"
                >
                    <X size={14} />
                </Button>
                <div className="w-[1px] h-4 bg-slate-300 mx-0.5"></div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleConfirm();
                    }}
                    disabled={isLoading}
                    title="Confirmar"
                >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                </Button>
            </div>
        </div>
    );
}
