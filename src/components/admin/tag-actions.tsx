"use client";

import { deleteTag } from "@/actions/admin/delete-tag";
import { DeleteButton } from "@/components/admin/delete-button";

interface Props {
    tagId: number;
    tagName: string;
}

export function TagActions({ tagId, tagName }: Props) {
    return (
        <DeleteButton
            onDelete={() => deleteTag(tagId)}
            loadingMessage="Eliminando tag..."
            successMessage="Tag eliminado correctamente"
            description={`Eliminar tag ${tagName}`}
        />
    );
}
