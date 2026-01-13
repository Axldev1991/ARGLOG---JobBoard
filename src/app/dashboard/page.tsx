import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { CandidateView } from "@/components/shared/dashboard/candidate-view";
import { CompanyView } from "@/components/shared/dashboard/company-view";


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

    // IMPORTANTE: Para saber QUÉ vista mostrar, usamos el rol de la SESIÓN.
    // Esto permite que el "Impersonate Mode" funcione.
    // Si usáramos user.role (DB), siempre veríamos la vista de Admin/Dev.
    const effectiveRole = session.role;

    if (effectiveRole === 'candidate') {
        return (
            <div className="p-10">
                <CandidateView user={user} />
            </div>
        );
    }

    // Si es empresa, buscamos sus trabajos
    const myJobs = await prisma.job.findMany({
        where: {
            authorId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <CompanyView jobs={myJobs} />
    );
}
