import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditCompanyForm } from "@/components/admin/edit-company-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCompanyPage({ params }: PageProps) {
    // 1. Desempaquetar params (Next.js 15 es async)
    const { id } = await params;
    const companyId = parseInt(id);

    if (isNaN(companyId)) return notFound();

    // 2. Buscar datos en DB
    const company = await prisma.user.findUnique({
        where: { id: companyId },
        include: { companyProfile: true } // Traemos los datos extra
    });

    if (!company || company.role !== 'company') {
        return notFound();
    }

    // 3. Pasar datos limpios al formulario cliente
    // (Necesario porque companyProfile puede ser null aunque no debería)
    const companyData = {
        id: company.id,
        name: company.name,
        email: company.email,
        companyProfile: company.companyProfile ? {
            legalName: company.companyProfile.legalName,
            cuit: company.companyProfile.cuit,
            industry: company.companyProfile.industry,
            website: company.companyProfile.website,
        } : null
    };

    if (!companyData.companyProfile) {
        // Edge case: Usuario es rol 'company' pero no tiene perfil (migración vieja o error)
        return (
            <div className="p-10 text-center">
                <h1 className="text-red-500 font-bold mb-4">Error de Datos</h1>
                <p>Esta empresa no tiene perfil legal asociado.</p>
                <Link href="/admin/dashboard" className="text-blue-500 underline">Volver</Link>
            </div>
        )
    }

    return (
        <main className="container max-w-2xl mx-auto py-10 px-4">
            <Link href="/admin/dashboard" className="flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors">
                <ArrowLeft size={16} className="mr-2" /> Volver al Dashboard
            </Link>

            {/* Renderizamos el formulario cliente */}
            {/* @ts-ignore : TypeScript a veces se queja de nulls, pero lo manejamos arriba */}
            <EditCompanyForm company={companyData} />
        </main>
    );
}
