"use client"

import { useTransition } from "react";
import { applyToJob } from "@/actions/apply-jobs";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner"; // Importamos el toast

export function ApplyButton({ jobId, hasApplied }: { jobId: number, hasApplied: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleApply = () => {
        // Ejecutamos la acción dentro de la transición
        startTransition(async () => {
            // Guardamos el toast ID para actualizarlo si quisieramos hacer un loading state más complejo
            // pero como el botón ya muestra spinner, usamos toast directo al final.

            try {
                const result = await applyToJob(jobId);

                if (result.error) {
                    toast.error(result.error);
                } else if (result.success) {
                    toast.success("Postulación enviada correctamente");
                }
            } catch (err) {
                toast.error("Ocurrió un error al intentar postularse.");
            }
        });
    };

    if (hasApplied) {
        return (
            <Button disabled variant="outline" className="w-full bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold opacity-100 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30">
                <CheckCircle size={16} className="mr-2" /> Postulado
            </Button>
        );
    }

    return (
        <Button
            onClick={handleApply}
            disabled={isPending}
            className="w-full font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 duration-200"
        >
            {isPending ? (
                <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Procesando...
                </>
            ) : (
                "Postularme ahora"
            )}
        </Button>
    );
}