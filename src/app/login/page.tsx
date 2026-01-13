import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/actions/login";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="border p-8 rounded-xl shadow-sm w-[350px] bg-white text-black">
                <form action={async (formData) => {
                    "use server"
                    await loginUser(formData)
                }} className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl mb-4 text-center">Iniciar Sesion</h1>
                    <Input type="email" name="email" placeholder="tu@email.com"></Input>
                    <Input type="password" name="password"></Input>
                    <Button className="w-full">Ingresar</Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500">
                        ¿No tienes cuenta?{" "}
                        <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}