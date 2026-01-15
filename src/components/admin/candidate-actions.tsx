"use client";

import { deleteCandidate } from "@/actions/admin/delete-candidate";
import { DeleteButton } from "@/components/admin/delete-button";

interface Props {
    candidateId: number;
    candidateName: string;
    resumeUrl?: string | null;
}

export function CandidateActions({ candidateId, candidateName, resumeUrl }: Props) {
    return (
        <DeleteButton
            onDelete={() => deleteCandidate(candidateId)}
            loadingMessage={`Eliminando a ${candidateName}...`}
            successMessage="Candidato eliminado correctamente"
            description={`Eliminar candidato ${candidateName}`}
        />
    );
}
