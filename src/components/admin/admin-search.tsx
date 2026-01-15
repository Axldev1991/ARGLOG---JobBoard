"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRef } from "react";

export function AdminSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (term: string) => {
        // Limpiar el timeout anterior si el usuario sigue escribiendo
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Configurar nuevo timeout (debounce manual)
        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams);

            if (term) {
                params.set("q", term);
            } else {
                params.delete("q");
            }

            replace(`${pathname}?${params.toString()}`);
        }, 300);
    };

    return (
        <div className="relative w-full max-w-sm">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
            </div>
            <Input
                placeholder="Buscar..."
                className="pl-10 bg-white border-slate-200 focus-visible:ring-blue-500"
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("q")?.toString()}
            />
        </div>
    );
}
