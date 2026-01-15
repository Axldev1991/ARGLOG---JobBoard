"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, X, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { deleteCandidate } from "@/actions/admin/delete-candidate";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
    candidateId: number;
    candidateName: string;
}

export function CandidateDetailActions({ candidateId, candidateName }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsPending(true);
        try {
            const result = await deleteCandidate(candidateId);
            if (result.error) {
                toast.error(result.error);
                setIsDeleting(false);
            } else {
                toast.success(`Candidato "${candidateName}" eliminado.`);
                router.push("/admin/dashboard?view=candidates");
            }
        } catch (error) {
            toast.error("Error al eliminar el candidato.");
            setIsDeleting(false);
        } finally {
            setIsPending(false);
        }
    };

    if (isDeleting) {
        return (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                <span className="text-sm text-slate-500 font-medium mr-2">¿Eliminar usuario?</span>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-9 px-3 text-slate-600 hover:bg-slate-100"
                    onClick={() => setIsDeleting(false)}
                    disabled={isPending}
                >
                    <X size={16} className="mr-1" />
                    Cancelar
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 size={16} className="animate-spin mr-1" />
                    ) : (
                        <Check size={16} className="mr-1" />
                    )}
                    Confirmar
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Link href={`/admin/candidates/${candidateId}/edit`}>
                <Button variant="outline" size="sm" className="h-9 px-4 text-slate-700 border-slate-300 hover:bg-slate-50">
                    <Edit size={16} className="mr-2 text-slate-500" />
                    Editar Perfil
                </Button>
            </Link>
            <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={() => setIsDeleting(true)}
            >
                <Trash2 size={16} className="mr-2" />
                Eliminar
            </Button>
        </div>
    );
}
