export function JobList({ jobs = [] }: { jobs: any[] }) {
    return (
        <div className="space-y-4">
            {/* Aquí iterarás sobre los jobs para mostrarlos */}
            <h2 className="text-xl font-bold text-white">Mis Ofertas Publicadas</h2>
        </div>
    );
}
