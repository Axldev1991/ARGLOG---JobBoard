"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/actions/register";
import Link from "next/link";

export default function RegisterPage() {
    const [role, setRole] = useState("candidate"); // Por defecto es candidato
    return (
        <main className="flex min-h-screen items-center justify-center p-24">
            <div className="border p-8 rounded-xl shadow-sm w-[400px] bg-white text-black">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Crea tu Cuenta
                </h1>
                <form action={registerUser} className="flex flex-col gap-4">
                    <Input type="text" name="name" placeholder="Nombre completo" required />
                    <Input type="email" name="email" placeholder="Email" required />
                    <Input type="password" name="password" placeholder="Contraseña" required minLength={6} />

                    <div className="flex gap-2">
                        <input type="hidden" name="role" value={role} />
                        {/* Botón Candidato */}
                        <Button
                            type="button" // Importante: evita que envíe el formulario
                            variant={role === "candidate" ? "default" : "outline"}
                            onClick={() => setRole("candidate")}
                            className={`w-full ${role === "candidate" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                        >
                            Soy Candidato
                        </Button>

                        {/* Botón Empresa */}
                        <Button
                            type="button"
                            variant={role === "company" ? "default" : "outline"}
                            onClick={() => setRole("company")}
                            className={`w-full ${role === "company" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                        >
                            Soy Empresa
                        </Button>
                    </div>

                    <Button type="submit" className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white">
                        Registrarse
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-500">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                            Inicia sesión
                        </Link>
                    </p>
                </div>

            </div>
        </main>
    );
}