import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { deleteJob } from "@/actions/delete-jobs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CandidateView } from "@/components/shared/dashboard/candidate-view";


export default async function DashboardPage() {

    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    // Obtenemos el usuario FRESCO de la base de datos
    const user = await prisma.user.findUnique({
        where: { id: session.id }
    });

    if (!user) {
        redirect("/login");
    }

    if (user.role === 'candidate') {
        return (
            <div className="p-10">
                <CandidateView user={user} />
            </div>
        );
    }

    const myJobs = await prisma.job.findMany({
        where: { // Filtros
            authorId: user.id // Nota: authorId con "d" minúscula, chequea tu schema
        },
        orderBy: { // Ordenamiento
            createdAt: 'desc'
        }
    })


    return (
        <div className="p-10">
            <div className="p-10 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Mis Publicaciones ({myJobs.length})</h1>

                {/* AQUÍ PONDREMOS LA LISTA */}
                <div className="flex flex-col gap-4">
                    {myJobs.map((job) => (
                        <div key={job.id} className="border p-4 rounded-xl flex justify-between items-center bg-white shadow-sm">
                            {/* Info Básica */}
                            <div>
                                <h2 className="font-semibold text-lg text-black">{job.title}</h2>
                                <p className="text-sm text-gray-500">${job.salary}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={`/jobs/${job.id}/edit`}>
                                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium h-9">
                                        Editar ✏️
                                    </Button>
                                </Link>

                                {/* Botón Eliminar (Formulario) */}
                                <form action={deleteJob}>
                                    <input type="hidden" name="jobId" value={job.id} />
                                    <Button className="bg-red-600 hover:bg-red-700 text-white h-9" size="sm">
                                        Eliminar 🗑️
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
