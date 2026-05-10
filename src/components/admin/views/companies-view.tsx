"use client"
import Link from "next/link";
import { Building2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyActions } from "@/components/admin/company-actions";
import { AdminSearch } from "@/components/admin/admin-search";
import { approveCompany } from "@/actions/admin/approve-company";
import { rejectCompany } from "@/actions/admin/reject-company";
import { toast } from "sonner";

interface Company {
    id: number;
    name: string;
    email: string;
    status: string;
    createdAt: Date;
    companyProfile: {
        legalName: string;
        cuit: string;
        industry: string;
    } | null;
}

interface Props {
    companies: Company[];
}

export function CompaniesView({ companies }: Props) {
    const pendingCompanies = companies.filter(c => c.status === "PENDING");
    const activeCompanies = companies.filter(c => c.status !== "PENDING");

    const handleApprove = async (userId: number) => {
        const result = await approveCompany(userId);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Empresa aprobada");
            window.location.reload();
        }
    };

    const handleReject = async (userId: number) => {
        const result = await rejectCompany(userId);
        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Empresa rechazada");
            window.location.reload();
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {pendingCompanies.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                            {pendingCompanies.length}
                        </span>
                        Solicitudes Pendientes
                    </h3>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingCompanies.map((company) => (
                                <div 
                                    key={company.id} 
                                    className="bg-card border border-border rounded-lg p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="font-medium text-foreground">
                                            {company.companyProfile?.legalName || company.name}
                                        </div>
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                            Pendiente
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground mb-1">
                                        {company.email}
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-3">
                                        CUIT: {company.companyProfile?.cuit} | {company.companyProfile?.industry}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            onClick={() => handleApprove(company.id)}
                                        >
                                            <Check size={14} className="mr-1" />
                                            Aprobar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => handleReject(company.id)}
                                        >
                                            <X size={14} className="mr-1" />
                                            Rechazar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Building2 size={20} className="text-primary" />
                    Empresas Activas ({activeCompanies.length})
                </h2>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <AdminSearch />
                    <Link href="/admin/companies/new">
                        <Button className="whitespace-nowrap shrink-0">
                            <Building2 className="mr-2 h-4 w-4" />
                            Nueva Empresa
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden mb-12">
                {activeCompanies.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border shadow-sm">
                        No hay empresas activas aún.
                    </div>
                ) : (
                    activeCompanies.map((company) => (
                        <div key={company.id} className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <Link href={`/admin/companies/${company.id}`} className="block group flex-1">
                                    <div className="font-medium text-card-foreground group-hover:text-primary transition-colors text-lg">
                                        {company.companyProfile?.legalName || company.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{company.email}</div>
                                </Link>
                                <CompanyActions companyId={company.id} />
                            </div>
                            {company.companyProfile && (
                                <div className="text-xs text-muted-foreground">
                                    <span className="inline-block bg-muted px-2 py-1 rounded">
                                        {company.companyProfile.industry}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="hidden md:block overflow-x-auto rounded-xl border border-border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left p-4 font-medium text-muted-foreground">Empresa</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">CUIT</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Industria</th>
                            <th className="text-left p-4 font-medium text-muted-foreground">Fecha Registro</th>
                            <th className="text-right p-4 font-medium text-muted-foreground">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeCompanies.map((company) => (
                            <tr key={company.id} className="border-b border-border hover:bg-muted/30">
                                <td className="p-4">
                                    <Link href={`/admin/companies/${company.id}`} className="block group">
                                        <div className="font-medium text-card-foreground group-hover:text-primary">
                                            {company.companyProfile?.legalName || company.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{company.email}</div>
                                    </Link>
                                </td>
                                <td className="p-4 text-sm text-foreground">
                                    {company.companyProfile?.cuit || "-"}
                                </td>
                                <td className="p-4 text-sm">
                                    <span className="bg-muted px-2 py-1 rounded text-xs">
                                        {company.companyProfile?.industry || "-"}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                    {new Date(company.createdAt).toLocaleDateString("es-AR")}
                                </td>
                                <td className="p-4 text-right">
                                    <CompanyActions companyId={company.id} />
                                </td>
                            </tr>
                        ))}
                        {activeCompanies.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No hay empresas activas aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}