import Link from "next/link";
import { Building2, Users, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { CompanyActions } from "@/components/admin/company-actions";

export default async function AdminDashboard() {
    // 1. Obtener empresas
    const companies = await prisma.user.findMany({
        where: { role: 'company' },
        include: { companyProfile: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Panel de Control</h1>

            {/* GRILLA DE ACCIONES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* TARJETA 1: Crear Empresa */}
                <Link
                    href="/admin/companies/new"
                    className="group bg-white p-6 rounded-xl border hover:shadow-lg transition-all"
                >
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Building2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Nueva Empresa</h3>
                    <p className="text-slate-500 text-sm mt-1">Dar de alta y enviar accesos.</p>
                </Link>

                {/* TARJETA 2: Placeholder Candidatos */}
                <div className="bg-white p-6 rounded-xl border opacity-50 cursor-not-allowed">
                    <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-gray-500">
                        <Users size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Candidatos</h3>
                    <p className="text-slate-500 text-sm mt-1">Gestión de usuarios (Pronto).</p>
                </div>
            </div>

            {/* TABLA DE EMPRESAS */}
            <h2 className="text-xl font-bold text-slate-800 mb-4">Empresas Registradas ({companies.length})</h2>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
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
                                    <td className="p-4 text-blue-600">
                                        {company.email}
                                    </td>
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

        </main>
    );
}