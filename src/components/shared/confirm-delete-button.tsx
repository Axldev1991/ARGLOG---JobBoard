"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteButtonProps {
    onDelete: () => Promise<{ success: boolean; message?: string; error?: string }>;
    title?: string;
    description?: React.ReactNode;
    successMessage?: string;
    trigger?: React.ReactNode;
    className?: string;
}

export function ConfirmDeleteButton({
    onDelete,
    title = "¿Estás seguro?",
    description = "Esta acción no se puede deshacer. Esto eliminará permanentemente el registro.",
    successMessage = "Eliminado correctamente",
    trigger,
    className
}: ConfirmDeleteButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent bubbling if inside a link/row clickable
        setIsDeleting(true);

        try {
            const result = await onDelete();

            if (result.success) {
                toast.success(result.message || successMessage);
                setIsOpen(false);
            } else {
                toast.error(result.message || result.error || "Error al eliminar");
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 ${className}`}
                        title="Eliminar"
                    >
                        <Trash2 size={16} />
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border border-slate-700 text-white rounded-xl shadow-2xl max-w-md" onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-400 text-xl">
                        <AlertTriangle size={24} />
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400 text-sm leading-relaxed mt-2">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 gap-2">
                    <AlertDialogCancel
                        className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white mt-0"
                        disabled={isDeleting}
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <Button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 border-0"
                    >
                        {isDeleting ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                        {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
