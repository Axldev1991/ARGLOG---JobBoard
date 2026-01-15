import Link from "next/link";
import { Building2, Users, Tags } from "lucide-react";
import { prisma } from "@/lib/db";
import { CompaniesView } from "@/components/admin/views/companies-view";
import { CandidatesView } from "@/components/admin/views/candidates-view";
import { TagsView } from "@/components/admin/views/tags-view";

interface AdminDashboardProps {
    searchParams: Promise<{ view?: string, q?: string }>;
}

export default async function AdminDashboard(props: AdminDashboardProps) {

    const searchParams = await props.searchParams;
    const view = searchParams.view || 'companies';
    const q = searchParams.q || "";

    /**
     * Dynamic Prisma 'where' clauses for filtering based on search query 'q'.
     * We construct these separately to keep the main query clean.
     */
    const companyWhere: any = { role: 'company' };
    if (q) {
        companyWhere.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { companyProfile: { legalName: { contains: q, mode: 'insensitive' } } }
        ];
    }

    const candidateWhere: any = { role: 'candidate' };
    if (q) {
        candidateWhere.OR = [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { headline: { contains: q, mode: 'insensitive' } },
            { city: { contains: q, mode: 'insensitive' } }
        ];
    }

    const tagWhere: any = {};
    if (q) {
        tagWhere.name = { contains: q, mode: 'insensitive' };
    }

    /**
     * Parallel data fetching for all admin views.
     * Note: In a larger app, we might want to fetch only the data for the active view,
     * but for now, fetching all counts/tables is acceptable for this scale.
     */
    const [companies, candidates, tags] = await Promise.all([
        prisma.user.findMany({
            where: companyWhere,
            include: { companyProfile: true },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.user.findMany({
            where: candidateWhere,
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { applications: true } } }
        }),
        prisma.tag.findMany({
            where: tagWhere,
            orderBy: { name: 'asc' },
            include: { _count: { select: { jobs: true } } }
        })
    ]);


    return (
        <main className="p-10 bg-gray-50 min-h-screen font-sans">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Panel de Control</h1>

            {/* SELECCIÓN DE VISTA (Tablero) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* CARD 1: Gestionar Empresas */}
                <Link
                    href="/admin/dashboard?view=companies"
                    className={`group p-6 rounded-xl border transition-all ${view === 'companies'
                        ? 'bg-blue-50 border-blue-200 shadow-md ring-1 ring-blue-200'
                        : 'bg-white hover:shadow-lg hover:border-blue-200'
                        }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${view === 'companies' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                            }`}>
                            <Building2 size={24} />
                        </div>
                        {view === 'companies' && <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">Activo</span>}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className={`text-lg font-bold ${view === 'companies' ? 'text-blue-900' : 'text-slate-800'}`}>Empresas</h3>
                            <p className="text-slate-500 text-sm mt-1">Control B2B y accesos.</p>
                        </div>
                        <span className="text-2xl font-bold text-slate-700">{companies.length}</span>
                    </div>
                </Link>

                {/* CARD 2: Gestionar Candidatos */}
                <Link
                    href="/admin/dashboard?view=candidates"
                    className={`group p-6 rounded-xl border transition-all ${view === 'candidates'
                        ? 'bg-purple-50 border-purple-200 shadow-md ring-1 ring-purple-200'
                        : 'bg-white hover:shadow-lg hover:border-purple-200'
                        }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${view === 'candidates' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-purple-100'
                            }`}>
                            <Users size={24} />
                        </div>
                        {view === 'candidates' && <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">Activo</span>}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className={`text-lg font-bold ${view === 'candidates' ? 'text-purple-900' : 'text-slate-800'}`}>Candidatos</h3>
                            <p className="text-slate-500 text-sm mt-1">Talento registrado.</p>
                        </div>
                        <span className="text-2xl font-bold text-slate-700">{candidates.length}</span>
                    </div>
                </Link>

                {/* CARD 3: Gestionar Tags */}
                <Link
                    href="/admin/dashboard?view=tags"
                    className={`group p-6 rounded-xl border transition-all ${view === 'tags'
                        ? 'bg-green-50 border-green-200 shadow-md ring-1 ring-green-200'
                        : 'bg-white hover:shadow-lg hover:border-green-200'
                        }`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${view === 'tags' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white'
                            }`}>
                            <Tags size={24} />
                        </div>
                        {view === 'tags' && <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">Activo</span>}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className={`text-lg font-bold ${view === 'tags' ? 'text-green-900' : 'text-slate-800'}`}>Habilidades</h3>
                            <p className="text-slate-500 text-sm mt-1">Diccionario de tags.</p>
                        </div>
                        <span className="text-2xl font-bold text-slate-700">{tags.length}</span>
                    </div>
                </Link>
            </div>

            {/* RENDERIZADO DE VISTAS */}
            {view === 'companies' && <CompaniesView companies={companies} />}
            {view === 'candidates' && <CandidatesView candidates={candidates} />}
            {view === 'tags' && <TagsView tags={tags} />}

        </main >
    );
}