
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { JobCandidates } from "@/components/shared/dashboard/company/job-candidates";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function JobCandidatesPage({ params }: Props) {
    const session = await getSession();
    if (!session) redirect("/login");

    const { id } = await params;
    const jobId = parseInt(id);

    // 1. Buscar el Job y verificar que pertenezca al usuario logueado
    const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
            applications: {
                include: {
                    user: true // Traemos toooodos los datos del postulante
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    // 2. Seguridad: Si no existe el job, 404
    if (!job) {
        return <div className="p-10 text-white text-center">Oferta no encontrada</div>;
    }

    // 3. Seguridad: Si el job no es del usuario actual -> FUERA!
    if (job.authorId !== session.id) {
        // Podríamos mostrar un 403 Forbidden, o redirigir
        return <div className="p-10 text-red-400 text-center font-bold">⛔ No tienes permiso para ver estos candidatos.</div>;
    }

    return (
        <JobCandidates job={job} applications={job.applications} />
    );
}
