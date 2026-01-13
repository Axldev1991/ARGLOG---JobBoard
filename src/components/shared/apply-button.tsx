"use client"

import { useTransition } from "react"; // Hook para manejar estados de carga de acciones
import { applyToJob } from "@/actions/apply-jobs"; // Nuestra acción creada
import { Button } from "@/components/ui/button"; // Botón de Shadcn
import { Loader2, CheckCircle } from "lucide-react"; // Iconos para feedback

export function ApplyButton({ jobId, hasApplied }: { jobId: number, hasApplied: boolean }) {
    const [isPending, startTransition] = useTransition();

        const handleApply = () => {
        // startTransition envuelve la ejecución de la acción
        startTransition(async () => {
            const result = await applyToJob(jobId);
            
            if (result.error) {
                alert(result.error); // Luego lo cambiaremos por algo más lindo
            }
        });
    };
        if (hasApplied) {
        return (
            <Button disabled variant="outline" className="w-full bg-green-50 text-green-700 border-green-200">
                <CheckCircle size={16} className="mr-2" /> Ya te postulaste
            </Button>
        );
    }

    return (
        <Button 
            onClick={handleApply} 
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
            {isPending ? (
                <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Postulando...
                </>
            ) : (
                "Postularme"
            )}
        </Button>
    );
}