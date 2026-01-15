"use client";

import { deleteCompany } from "@/actions/admin/delete-company";
import { DeleteButton } from "@/components/admin/delete-button";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    companyId: number;
    companyName: string;
}

export function CompanyActions({ companyId, companyName }: Props) {
    return (
        <div className="flex justify-end gap-2">
            <Link href={`/admin/companies/${companyId}/edit`}>
                <Button variant="ghost" size="icon" className="hover:text-blue-600 hover:bg-blue-50">
                    <Pencil size={16} />
                </Button>
            </Link>

            <DeleteButton
                onDelete={() => deleteCompany(companyId)}
                loadingMessage={`Eliminando a ${companyName}...`}
                successMessage="Empresa eliminada correctamente"
                description={`Eliminar empresa ${companyName}`}
            />
        </div>
    );
}
