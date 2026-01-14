"use client"

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { impersonateRole } from "@/actions/dev-tools";
import { useState } from "react";

export function DevToolsContent({ role }: { role: string }) {
    // Estado para controlar la visibilidad del menú
    const [isOpen, setIsOpen] = useState(false);

    const handleImpersonate = async (targetRole: string) => {
        let targetPath = "/dashboard";

        if (targetRole === 'admin' || targetRole === 'dev') {
            targetPath = "/admin/dashboard";
        }

        await impersonateRole(targetRole, targetPath);
        setIsOpen(false); // Cerramos el menú al seleccionar
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">

            {/* Menú Desplegable (Controlado por Click) */}
            {isOpen && (
                <div className="mb-3 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <p className="text-xs font-bold text-slate-400 uppercase">Impersonar Rol</p>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-xs h-8 mb-1 gap-2"
                        onClick={() => handleImpersonate('candidate')}
                    >
                        👤 Candidato
                        {role === 'candidate' && <span className="ml-auto text-green-500">●</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-xs h-8 mb-1 gap-2"
                        onClick={() => handleImpersonate('company')}
                    >
                        🏢 Empresa
                        {role === 'company' && <span className="ml-auto text-green-500">●</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-xs h-8 mb-1 gap-2"
                        onClick={() => handleImpersonate('admin')}
                    >
                        👑 Admin (Cliente)
                        {role === 'admin' && <span className="ml-auto text-green-500">●</span>}
                    </Button>

                    <div className="h-px bg-slate-100 my-1"></div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-xs h-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                        onClick={() => handleImpersonate('dev')}
                    >
                        🦸 Reset (Dev)
                    </Button>
                </div>
            )}

            {/* Botón Flotante (Trigger) */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-slate-900 text-white rounded-full p-3 shadow-2xl cursor-pointer hover:bg-slate-800 transition-colors flex items-center gap-2 border-2 ${role === 'dev' ? 'border-indigo-500' : 'border-slate-700'}`}
            >
                <span className="text-xl">🛠️</span>
                <span className="font-bold text-xs max-w-xs transition-all whitespace-nowrap">
                    {isOpen ? "Cerrar" : "Modo Dios"}
                </span>
            </div>

        </div>
    )
}
