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
                <div className="mb-3 w-48 bg-card rounded-xl shadow-xl border border-border p-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <div className="flex justify-between items-center mb-2 px-2 border-b border-border pb-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Impersonar Rol</p>
                        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">×</button>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-xs h-8 mb-1 gap-2 hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleImpersonate('candidate')}
                    >
                        👤 Candidato
                        {role === 'candidate' && <span className="ml-auto text-emerald-500">●</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-xs h-8 mb-1 gap-2 hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleImpersonate('company')}
                    >
                        🏢 Empresa
                        {role === 'company' && <span className="ml-auto text-emerald-500">●</span>}
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-xs h-8 mb-1 gap-2 hover:bg-accent hover:text-accent-foreground"
                        onClick={() => handleImpersonate('admin')}
                    >
                        👑 Admin (Cliente)
                        {role === 'admin' && <span className="ml-auto text-emerald-500">●</span>}
                    </Button>

                    <div className="h-px bg-border my-1"></div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-xs h-8 text-primary bg-primary/10 hover:bg-primary/20"
                        onClick={() => handleImpersonate('dev')}
                    >
                        🦸 Reset (Dev)
                    </Button>
                </div>
            )}

            {/* Botón Flotante (Trigger) */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-foreground text-background rounded-full p-3 shadow-2xl cursor-pointer hover:opacity-90 transition-all flex items-center gap-2 border-2 ${role === 'dev' ? 'border-primary' : 'border-border'}`}
            >
                <span className="text-xl">🛠️</span>
                <span className="font-bold text-xs max-w-xs transition-all whitespace-nowrap">
                    {isOpen ? "Cerrar" : "Modo Dios"}
                </span>
            </div>

        </div>
    )
}
