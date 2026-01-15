"use client";

import { deleteTag } from "@/actions/admin/delete-tag";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
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

            <ConfirmDeleteButton
                title={`¿Eliminar tag "${tagName}"?`}
                description="Esto eliminará el tag de todas las ofertas que lo estén usando."
                onDelete={async () => {
                    const res = await deleteTag(tagId);
                    return { success: !!res.success, error: res.error };
                }}
            />
        </div>
    );
}
