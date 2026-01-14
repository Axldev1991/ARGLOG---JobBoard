"use client";

import { deleteCompany } from "@/actions/admin/delete-company";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
    companyId: number;
    companyName: string;
}

/**
 * Acciones (Editar/Borrar) para cada fila de la tabla de empresas.
 * Maneja la lógica de confirmación de borrado en "dos pasos" (Double Tap).
 */
export function CompanyActions({ companyId, companyName }: Props) {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleDelete = async () => {
        // Lógica de Doble Confirmación para evitar accidentes 🛡️
        if (!isConfirming) {
            setIsConfirming(true);
            setTimeout(() => setIsConfirming(false), 3000); // 3 seg para confirmar
            return;
        }

        // Ejecución del borrado
        const toastId = toast.loading("Eliminando...");
        const result = await deleteCompany(companyId);

        if (result.error) {
            toast.error(result.error, { id: toastId });
        } else {
            toast.success("Empresa eliminada correctamente", { id: toastId });
        }
        setIsConfirming(false);
    };

    return (
        <div className="flex gap-2 justify-end items-center">
            {isConfirming && (
                <span className="text-xs text-red-500 font-bold animate-pulse mr-2">
                    ¿Confirmar?
                </span>
            )}

            <Link href={`/admin/companies/${companyId}/edit`}>
                <Button variant="ghost" size="icon" className="hover:text-blue-600 hover:bg-blue-50" title="Editar detalles">
                    <Edit size={18} />
                </Button>
            </Link>

            <Button
                variant="ghost"
                size="icon"
                className={`transition-colors ${isConfirming ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'hover:text-red-600 hover:bg-red-50'}`}
                onClick={handleDelete}
                title="Eliminar empresa"
            >
                {isConfirming ? <AlertTriangle size={18} /> : <Trash2 size={18} />}
            </Button>
        </div>
    );
}
