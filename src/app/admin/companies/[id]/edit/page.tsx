import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditCompanyForm } from "@/components/admin/edit-company-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminEditCompanyPage(props: PageProps) {
    const params = await props.params;
    const companyId = parseInt(params.id);

    if (isNaN(companyId)) return notFound();

    const company = await prisma.user.findUnique({
        where: { id: companyId },
        include: { companyProfile: true }
    });

    if (!company || company.role !== 'company') return notFound();

    return (
        <main className="p-10 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-3xl mx-auto">
                <Link href={`/admin/companies/${companyId}`} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 mb-6 transition-colors">
                    <ArrowLeft size={16} /> Volver al detalle
                </Link>

                <EditCompanyForm company={company} />
            </div>
        </main>
    );
}
