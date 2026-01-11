import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createJob } from "@/actions/create-job";
import { cookies } from "next/headers";     
import { redirect } from "next/navigation"; 


export default async function NewJobPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("user_session");
    // Si no hay ticket de sesión... ¡FUERA!
    if (!session) {
        redirect("/login");
    }
    return (
        <main className="p-10">
            <div>
                <h1 className="text-2xl font-bold">Publicar Nueva Oferta</h1>
                <form action={createJob} className="max-w-md flex flex-col gap-4">
                    <Input name="title" placeholder="Titulo" />
                    <Input name="salary" placeholder="Salario" />
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