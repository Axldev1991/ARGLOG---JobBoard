import Link from "next/link";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanyActions } from "@/components/admin/company-actions";
import { AdminSearch } from "@/components/admin/admin-search";

interface Props {
    companies: any[]; // To be strictly typed with Prisma generated types in the future
}

/**
 * View component for managing registered companies.
 * Displays a table with company details and actions.
 */
export function CompaniesView({ companies }: Props) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Building2 size={20} className="text-primary" />
                    Listado de Empresas
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

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden mb-12">
                {companies.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border shadow-sm">
                        No hay empresas registradas aún.
                    </div>
                ) : (
                    companies.map((company) => (
                        <div key={company.id} className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-3">
                            <div className="flex justify-between items-start gap-4">
                                <Link href={`/admin/companies/${company.id}`} className="block group flex-1">
                                    <div className="font-medium text-card-foreground group-hover:text-primary transition-colors text-lg">
                                        {company.companyProfile?.legalName || company.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{company.email}</div>
                                </Link>
                                <CompanyActions companyId={company.id} companyName={company.name} />
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="bg-muted/50 p-2 rounded-lg border border-border">
                                    <span className="text-muted-foreground text-xs uppercase block mb-1">CUIT</span>
                                    <span className="font-mono text-foreground font-medium">
                                        {company.companyProfile?.cuit || "-"}
                                    </span>
                                </div>
                                <div className="bg-muted/50 p-2 rounded-lg border border-border">
                                    <span className="text-muted-foreground text-xs uppercase block mb-1">Alta</span>
                                    <span className="text-foreground">
                                        {new Date(company.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-12">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-semibold text-muted-foreground">Empresa</th>
                            <th className="p-4 font-semibold text-muted-foreground">CUIT</th>
                            <th className="p-4 font-semibold text-muted-foreground">Fecha Alta</th>
                            <th className="p-4 font-semibold text-muted-foreground text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {companies.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                    No hay empresas registradas aún.
                                </td>
                            </tr>
                        ) : (
                            companies.map((company) => (
                                <tr key={company.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4">
                                        <Link href={`/admin/companies/${company.id}`} className="block group">
                                            <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                {company.companyProfile?.legalName || company.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{company.email}</div>
                                        </Link>
                                    </td>
                                    <td className="p-4 font-mono text-muted-foreground text-xs">
                                        {company.companyProfile?.cuit || "-"}
                                    </td>
                                    <td className="p-4 text-muted-foreground">
                                        {new Date(company.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <CompanyActions companyId={company.id} companyName={company.name} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
