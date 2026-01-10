"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/actions/register";

export default function RegisterPage() {
    const [role, setRole] = useState("candidate"); // Por defecto es candidato
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="border p-8 rounded-xl shadow-sm w-[350px]">
                <h1 className="text-4xl font-bold">
                    Quien eres?
                </h1>
                <form action={registerUser} className="flex flex-col gap-4">
                    <Input type="text" name="name" placeholder="Nombre" />
                    <Input type="email" name="email" placeholder="Email" />
                    <Input type="password" name="password" placeholder="Contraseña" />
                    <div className="flex gap-4">
                        <input type="hidden" name="role" value={role} />
                        {/* Botón Candidato */}
                        <Button
                            type="button" // Importante: evita que envíe el formulario
                            variant={role === "candidate" ? "default" : "outline"}
                            onClick={() => setRole("candidate")}
                            className="w-full"
                        >
                            Soy Candidato
                        </Button>

                        {/* Botón Empresa */}
                        <Button
                            type="button"
                            variant={role === "company" ? "default" : "outline"}
                            onClick={() => setRole("company")}
                            className="w-full"
                        >
                            Soy Empresa
                        </Button>
                        <Button type="submit" className="w-full mt-4">
                            Registrarse
                        </Button>
                    </div>
                </form>

            </div>
        </main>
    );
}