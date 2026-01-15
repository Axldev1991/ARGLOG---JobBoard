"use client";

import { toggleJobStatus } from "@/actions/admin/toggle-job-status";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface Props {
    jobId: number;
    status: string;
}

/**
 * Switch component to toggle job status directly in the 'Estado' column.
 */
export function JobStatusSwitch({ jobId, status }: Props) {
    const [isPublished, setIsPublished] = useState(status === "PUBLISHED");
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleStatus = async () => {
        setIsLoading(true);
        const newStatus = isPublished ? "REJECTED" : "PUBLISHED";

        setIsPublished(!isPublished); // Optimistic

        const result = await toggleJobStatus(jobId, status);

        if (result.error) {
            setIsPublished(isPublished);
            toast.error(result.error);
        } else {
            toast.success(`Oferta ${newStatus === "PUBLISHED" ? "publicada" : "retirada"}`);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center gap-2" title={isPublished ? "Visible" : "Oculto"}>
            <Switch
                checked={isPublished}
                onCheckedChange={handleToggleStatus}
                disabled={isLoading}
                className="data-[state=checked]:bg-blue-600 scale-90"
            />
            <span className={`text-xs font-bold ${isPublished ? 'text-green-700' : 'text-red-700'}`}>
                {isPublished ? 'Visible' : 'Oculto'}
            </span>
        </div>
    );
}
