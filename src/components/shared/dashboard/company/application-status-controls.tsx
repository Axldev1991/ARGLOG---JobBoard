"use client";

import { useState, useTransition } from "react";
import { Check, X, Clock, Loader2 } from "lucide-react";
import { updateApplicationStatus } from "@/actions/update-application-status";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
    applicationId: number;
    currentStatus: string; // "PENDING" | "HIRED" | "REJECTED"
}

export function ApplicationStatusControls({ applicationId, currentStatus }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === currentStatus) return;

        startTransition(async () => {
            const result = await updateApplicationStatus(applicationId, newStatus);

            if (result.success) {
                toast.success(`Estado actualizado a ${newStatus}`);
            } else {
                toast.error(result.message || "Error al actualizar");
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "HIRED": return "text-green-600 bg-green-50 border-green-100";
            case "REJECTED": return "text-red-600 bg-red-50 border-red-100";
            default: return "text-blue-600 bg-blue-50 border-blue-100";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "HIRED": return "Contratado";
            case "REJECTED": return "Descartado";
            default: return "Pendiente";
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    disabled={isPending}
                    className={`gap-2 min-w-[140px] justify-between border ${getStatusColor(currentStatus)} hover:opacity-80 transition-opacity`}
                >
                    {isPending ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        getStatusLabel(currentStatus)
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange("PENDING")} className="gap-2 cursor-pointer">
                    <Clock size={16} className="text-blue-500" />
                    Pendiente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("HIRED")} className="gap-2 cursor-pointer">
                    <Check size={16} className="text-green-500" />
                    Contratado
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("REJECTED")} className="gap-2 cursor-pointer">
                    <X size={16} className="text-red-500" />
                    Descartado
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
