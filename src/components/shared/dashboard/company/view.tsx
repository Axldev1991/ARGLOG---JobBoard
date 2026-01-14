export function CompanyView({ jobs = [] }: { jobs: any[] }) {
    return (
        <div className="max-w-6xl mx-auto p-6 text-white text-center">
            <h1 className="text-3xl font-bold mb-4">Panel de Empresa 🏢</h1>
            <p className="text-slate-400">Aquí podrás gestionar tus ofertas y ver postulantes.</p>

            {/* TODO: Implementar JobList y demás componentes */}
            <div className="mt-8 p-10 border border-dashed border-slate-700 rounded-xl">
                <p>Los jobs están disponibles en la prop 'jobs': {jobs.length}</p>
            </div>
        </div>
    );
}
