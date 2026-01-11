import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/actions/login";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="border p-8 rounded-xl shadow-sm w-[350px]">
                <form action={async (formData) => {
                    "use server"
                    await loginUser(formData)
                }} className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl mb-4 text-center">Iniciar Sesion</h1>
                    <Input type="email" name="email" placeholder="tu@email.com"></Input>
                    <Input type="password" name="password"></Input>
                    <Button className="w-full">Ingresar</Button>
                </form>
            </div>
        </main>
    );
}