"use client";

import { useTransition } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    PlayCircle,
    PauseCircle,
    XCircle,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { updateJobStatus, JobStatus } from "@/actions/update-job-status";

interface Props {
    jobId: number;
    currentStatus: string;
}

export function JobStatusControls({ jobId, currentStatus }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (newStatus: JobStatus) => {
        if (newStatus === currentStatus) return;

        startTransition(async () => {
            const result = await updateJobStatus(jobId, newStatus);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        });
    };

    // Icono y color según estado actual
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return { icon: PlayCircle, color: "text-green-600 bg-green-50 border-green-200", label: "Publicada" };
            case "PAUSED":
                return { icon: PauseCircle, color: "text-amber-600 bg-amber-50 border-amber-200", label: "Pausada" };
            case "CLOSED":
                return { icon: XCircle, color: "text-slate-600 bg-slate-100 border-slate-200", label: "Cerrada" };
            default:
                return { icon: MoreHorizontal, color: "text-slate-500", label: status };
        }
    };

    const config = getStatusConfig(currentStatus);
    const StatusIcon = config.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 border flex items-center gap-2 transition-all ${config.color} hover:${config.color} hover:brightness-95`}
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="animate-spin" size={14} /> : <StatusIcon size={14} />}
                    <span className="text-xs font-semibold">{config.label}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => handleStatusChange("PUBLISHED")}
                    disabled={currentStatus === "PUBLISHED"}
                    className="gap-2"
                >
                    <PlayCircle size={14} className="text-green-600" /> Publicar
                    {currentStatus === "PUBLISHED" && <CheckCircle2 size={14} className="ml-auto opacity-50" />}
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handleStatusChange("PAUSED")}
                    disabled={currentStatus === "PAUSED"}
                    className="gap-2"
                >
                    <PauseCircle size={14} className="text-amber-600" /> Pausar
                    {currentStatus === "PAUSED" && <CheckCircle2 size={14} className="ml-auto opacity-50" />}
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => handleStatusChange("CLOSED")}
                    disabled={currentStatus === "CLOSED"}
                    className="gap-2 text-slate-500"
                >
                    <XCircle size={14} /> Cerrar
                    {currentStatus === "CLOSED" && <CheckCircle2 size={14} className="ml-auto opacity-50" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
