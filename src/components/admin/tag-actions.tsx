"use client";

import { deleteTag } from "@/actions/admin/delete-tag";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

interface Props {
    tagId: number;
    tagName: string;
}

export function TagActions({ tagId, tagName }: Props) {
    return (
        <div className="flex justify-end items-center gap-2">
            <Link href={`/admin/tags/${tagId}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full" title="Editar Tag">
                    <Pencil size={16} />
                </Button>
            </Link>

            <DeleteButton
                onDelete={() => deleteTag(tagId)}
                loadingMessage="Eliminando tag..."
                successMessage="Tag eliminado correctamente"
                description={`Eliminar tag ${tagName}`}
            />
        </div>
    );
}
