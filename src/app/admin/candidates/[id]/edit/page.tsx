import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditCandidateForm } from "@/components/admin/edit-candidate-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminEditCandidatePage(props: PageProps) {
    const params = await props.params;
    const candidateId = parseInt(params.id);

    if (isNaN(candidateId)) return notFound();

    const candidate = await prisma.user.findUnique({
        where: { id: candidateId }
    });

    if (!candidate || candidate.role !== 'candidate') return notFound();

    return (
        <main className="p-10 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-3xl mx-auto">
                <Link href={`/admin/candidates/${candidateId}`} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 mb-6 transition-colors">
                    <ArrowLeft size={16} /> Volver al detalle
                </Link>

                <EditCandidateForm candidate={candidate} />
            </div>
        </main>
    );
}
