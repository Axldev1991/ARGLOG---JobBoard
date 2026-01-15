"use client";

import { deleteJob } from "@/actions/admin/delete-job";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

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
    return (
        <div className="flex justify-end items-center gap-2">
            <Link href={`/admin/jobs/${jobId}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full" title="Editar Oferta">
                    <Pencil size={16} />
                </Button>
            </Link>

            <ConfirmDeleteButton
                title={`¿Eliminar oferta "${jobTitle}"?`}
                description="Esta acción eliminará permanentemente la oferta y todos los datos asociados."
                onDelete={async () => {
                    const res = await deleteJob(jobId);
                    return { success: !!res.success, error: res.error };
                }}
            />
        </div>
    );
}
