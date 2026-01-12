
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateJob } from "@/actions/update-job";
import Link from "next/link";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Seguridad
    const user = await getSession();
    if (!user) redirect("/login");

    // 2. Buscar datos actuales
    const job = await prisma.job.findUnique({
        where: { id: parseInt(id) }
    });

    // 3. Verificar propiedad
    if (!job || job.authorId !== user.id) {
        redirect("/dashboard?error=unauthorized");
    }

    return (
        <main className="p-10 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Editar Oferta</h1>

            <form action={updateJob} className="flex flex-col gap-4">
                {/* ID oculto para saber qué actualizamos */}
                <input type="hidden" name="jobId" value={job.id} />

                <div>
                    <label className="text-sm font-medium mb-1 block">Título</label>
                    <Input name="title" defaultValue={job.title} required className="bg-white text-black border-gray-300" />
                </div>

                <div>
                    <label className="text-sm font-medium mb-1 block">Salario</label>
                    <Input name="salary" defaultValue={job.salary || ""} className="bg-white text-black border-gray-300" />
                </div>

                <div>
                    <label className="text-sm font-medium mb-1 block">Descripción</label>
                    <textarea
                        name="description"
                        className="w-full border p-2 rounded-md min-h-[150px] bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue={job.description}
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <Button type="submit" className="flex-1 bg-blue-600">Guardar Cambios</Button>
                    <Link href="/dashboard" className="flex-1">
                        <Button variant="outline" type="button" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100">
                            Cancelar
                        </Button>
                    </Link>
                </div>
            </form>
        </main>
    );
}
