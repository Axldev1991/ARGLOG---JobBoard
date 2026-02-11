import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { CandidateView } from "@/components/shared/dashboard/candidate/view";
import { CompanyView } from "@/components/shared/dashboard/company/view";


export default async function DashboardPage(props: { searchParams: Promise<{ tab?: string }> }) {
    const searchParams = await props.searchParams;
    const activeTab = searchParams.tab;

    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    // Obtenemos el usuario FRESCO de la base de datos
    const user = await prisma.user.findUnique({
        where: { id: session.id },
        include: { companyProfile: true }
    });

    if (!user) {
        redirect("/login");
    }

    const effectiveRole = session.role;

    // Si eres Admin o Dev, te mandamos a tu panel especial
    if (effectiveRole === 'admin' || effectiveRole === 'dev') {
        redirect("/admin/dashboard");
    }

    if (effectiveRole === 'candidate') {
        const applications = await prisma.application.findMany({
            where: { userId: user.id },
            include: { job: true },
            orderBy: { createdAt: 'desc' }
        });

        return (
            <div className="p-10">
                <CandidateView
                    user={user}
                    applications={applications}
                    activeTab={activeTab as any}
                />
            </div>
        );
    }

    // Si es empresa, buscamos sus trabajos
    const myJobs = await prisma.job.findMany({
        where: {
            authorId: user.id
        },
        include: {
            applications: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <CompanyView
            jobs={myJobs}
            profile={user.companyProfile}
            activeTab={activeTab as any}
        />
    );
}
