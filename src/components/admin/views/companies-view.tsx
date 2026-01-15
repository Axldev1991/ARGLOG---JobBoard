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
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Building2 size={20} className="text-blue-600" />
                    Listado de Empresas
                </h2>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <AdminSearch />
                    <Link href="/admin/companies/new">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Building2 className="mr-2 h-4 w-4" />
                            Nueva Empresa
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-12">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Nombre Comercial</th>
                            <th className="p-4 font-semibold text-slate-600">Razón Social</th>
                            <th className="p-4 font-semibold text-slate-600">CUIT</th>
                            <th className="p-4 font-semibold text-slate-600">Email Responsable</th>
                            <th className="p-4 font-semibold text-slate-600">Fecha Alta</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {companies.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-slate-400">
                                    No hay empresas registradas aún.
                                </td>
                            </tr>
                        ) : (
                            companies.map((company) => (
                                <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-900">{company.name}</td>
                                    <td className="p-4 text-slate-600">
                                        {company.companyProfile?.legalName || "-"}
                                    </td>
                                    <td className="p-4 font-mono text-slate-500 text-xs">
                                        {company.companyProfile?.cuit || "-"}
                                    </td>
                                    <td className="p-4 text-blue-600">{company.email}</td>
                                    <td className="p-4 text-slate-400">
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
