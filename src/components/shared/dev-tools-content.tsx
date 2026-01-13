"use client"

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { impersonateRole } from "@/actions/dev-tools";

export function DevToolsContent({ role }: { role: string }) {
    const pathname = usePathname();

    const handleImpersonate = async (targetRole: string) => {
        await impersonateRole(targetRole, pathname);
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 group">
            {/* Botón Flotante */}
            <div className={`bg-slate-900 text-white rounded-full p-3 shadow-2xl cursor-pointer hover:scale-110 transition-transform flex items-center gap-2 border-2 ${role === 'dev' ? 'border-indigo-500' : 'border-slate-700'}`}>
                <span className="text-xl">🛠️</span>
                <span className="font-bold text-xs max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
                    Modo Dios
                </span>
            </div>

            {/* Menú Desplegable (hover del padre) */}
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-2 hidden group-hover:block transition-all transform origin-bottom-right">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2 px-2">Impersonar Rol</p>

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

                <div className="h-px bg-slate-100 my-1"></div>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-xs h-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                    onClick={() => handleImpersonate('dev')}
                >
                    🦸 Reset (Admin)
                </Button>
            </div>
        </div>
    )
}
