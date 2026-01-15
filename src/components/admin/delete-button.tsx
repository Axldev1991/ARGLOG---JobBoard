"use client";

import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
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

    /**
     * Handles the click event. The first click activates confirmation mode.
     * The second click (within 3s) triggers the deletion.
     */
    const handleClick = async () => {
        if (!isConfirming) {
            setIsConfirming(true);
            // Auto-reset after 3 seconds if not confirmed
            setTimeout(() => setIsConfirming(false), 3000);
            return;
        }

        // Execute deletion
        setIsLoading(true);
        const toastId = toast.loading(loadingMessage);

        try {
            const result = await onDelete();

            if (result.error) {
                toast.error(result.error, { id: toastId });
            } else {
                toast.success(successMessage, { id: toastId });
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado", { id: toastId });
        } finally {
            setIsLoading(false);
            setIsConfirming(false);
        }
    };

    return (
        <div className="flex gap-2 justify-end items-center">
            {isConfirming && (
                <span className="text-xs text-red-500 font-bold animate-pulse mr-2">
                    ¿Confirmar?
                </span>
            )}

            <Button
                variant="ghost"
                size="icon"
                disabled={isLoading}
                className={`transition-colors ${isConfirming
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'hover:text-red-600 hover:bg-red-50'
                    }`}
                onClick={handleClick}
                title={description}
            >
                {isConfirming ? <AlertTriangle size={16} /> : <Trash2 size={16} />}
            </Button>
        </div>
    );
}
