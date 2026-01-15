
import { JobList } from "./job-list";

export function CompanyView({ jobs = [] }: { jobs: any[] }) {
    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-slate-900">Panel de Empresa</h1>
                <p className="text-slate-500">
                    Gestiona tus ofertas activas y revisa los perfiles de los candidatos.
                </p>
            </div>

            <JobList jobs={jobs} />
        </div>
    );
}
