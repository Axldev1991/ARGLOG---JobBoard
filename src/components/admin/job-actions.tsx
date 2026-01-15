"use client";

import { toggleJobStatus } from "@/actions/admin/toggle-job-status";
import { deleteJob } from "@/actions/admin/delete-job";
import { DeleteButton } from "@/components/admin/delete-button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface Props {
    jobId: number;
    jobTitle: string;
    status: string;
}

/**
 * Interactive actions for a single job row.
 * Includes a status toggle switch (Published/Rejected) and a delete button.
 * Uses optimistic UI updates for instant feedback on status toggle.
 */
export function JobActions({ jobId, jobTitle, status }: Props) {
    const [isPublished, setIsPublished] = useState(status === "PUBLISHED");
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleStatus = async () => {
        setIsLoading(true);
        const newStatus = isPublished ? "REJECTED" : "PUBLISHED";

        // Optimistic update
        setIsPublished(!isPublished);

        const result = await toggleJobStatus(jobId, status);

        if (result.error) {
            // Revert on error
            setIsPublished(isPublished);
            toast.error(result.error);
        } else {
            toast.success(`Oferta ${newStatus === "PUBLISHED" ? "publicada" : "retirada"}`);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex justify-end items-center gap-4">
            <div className="flex items-center gap-2" title={isPublished ? "Visible para candidatos" : "Oculto (Moderado)"}>
                {isPublished ? <Eye size={16} className="text-blue-600" /> : <EyeOff size={16} className="text-slate-400" />}
                <Switch
                    checked={isPublished}
                    onCheckedChange={handleToggleStatus}
                    disabled={isLoading}
                    className="data-[state=checked]:bg-blue-600"
                />
            </div>

            <DeleteButton
                onDelete={() => deleteJob(jobId)}
                loadingMessage={`Eliminando oferta...`}
                successMessage="Oferta eliminada permanentemente"
                description={`Eliminar ${jobTitle}`}
            />
        </div>
    );
}
