"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
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
    icon?: React.ReactNode;
    className?: string;
}

export function ConfirmDeleteButton({
    onDelete,
    title = "¿Estás seguro?",
    description = "Esta acción no se puede deshacer. Esto eliminará permanentemente el registro.",
    successMessage = "Eliminado correctamente",
    trigger,
    icon,
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
            <AlertDialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant="ghost"
                        className={cn(
                            "h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                            className
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : icon || <Trash2 size={16} />}
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border border-border rounded-xl shadow-2xl max-w-md" onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive text-xl">
                        <AlertTriangle size={24} />
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed mt-2">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 mt-6">
                    <AlertDialogCancel
                        disabled={isDeleting}
                        className="bg-transparent border-border text-foreground hover:bg-accent hover:text-accent-foreground mt-0"
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive border-0"
                    >
                        {isDeleting ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                        {isDeleting ? "Eliminando..." : "Sí, eliminar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
