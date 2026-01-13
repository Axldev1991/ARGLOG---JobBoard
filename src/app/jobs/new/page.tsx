import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createJob } from "@/actions/create-job";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { TagSelector } from "@/components/ui/tag-selector";


export default async function NewJobPage() {
    const user = await getSession();
    const tags = await prisma.tag.findMany();
    if (!user) {
        redirect("/login");
    }
    return (
        <main className="p-10">
            <div>
                <h1 className="text-2xl font-bold">Publicar Nueva Oferta</h1>
                <form action={createJob} className="max-w-md flex flex-col gap-4">
                    <Input name="title" placeholder="Titulo" />
                    <Input name="salary" placeholder="Salario" />
                    {/* Fila de Selectores */}
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="text-sm font-medium mb-1 block">Categoría</label>
                            <select name="category" className="w-full border p-2 rounded-md bg-white">
                                <option value="Desarrollo">Desarrollo</option>
                                <option value="Diseño">Diseño</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Ventas">Ventas</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>

                        <div className="w-1/2">
                            <label className="text-sm font-medium mb-1 block">Modalidad</label>
                            <select name="modality" className="w-full border p-2 rounded-md bg-white">
                                <option value="Remoto">Remoto 🏠</option>
                                <option value="Híbrido">Híbrido 🏢🏠</option>
                                <option value="Presencial">Presencial 🏢</option>
                            </select>
                        </div>
                    </div>

                    {/* Campo de Ubicación (Solo si no es remoto, pero lo dejaremos siempre visible por ahora) */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Ubicación</label>
                        <Input name="location" placeholder="Ej: Buenos Aires, Argentina" />
                    </div>
                    <TagSelector availableTags={tags} />
                    <textarea
                        name="description"
                        placeholder="Descripción del puesto"
                        className="border p-2 rounded-md min-h-[100px] "
                    />

                    <Button type="submit">Publicar Oferta</Button>

                </form>
            </div>
        </main>
    );
}