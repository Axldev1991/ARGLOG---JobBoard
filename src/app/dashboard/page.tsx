import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { deleteJob } from "@/actions/delete-jobs";
import { Button } from "@/components/ui/button";


export default async function DashboardPage() {

    const user = await getSession();
    if (!user) {
        redirect("/login");
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

                            {/* Botón Eliminar (Formulario) */}
                            <form action={deleteJob}>
                                <input type="hidden" name="jobId" value={job.id} />
                                <Button variant="destructive" size="sm">
                                    Eliminar 🗑️
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
