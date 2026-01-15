"use client";

import { deleteCandidate } from "@/actions/admin/delete-candidate";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";

interface Props {
    candidateId: number;
    candidateName: string;
    resumeUrl?: string | null;
}

export function CandidateActions({ candidateId, candidateName, resumeUrl }: Props) {
    return (
        <ConfirmDeleteButton
            onDelete={async () => {
                const res = await deleteCandidate(candidateId);
                return { success: !!res.success, error: res.error };
            }}
            title={`¿Eliminar a ${candidateName}?`}
            description="Esta acción eliminará permanentemente al candidato y todos sus datos."
        />
    );
}
