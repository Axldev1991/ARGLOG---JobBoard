"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTopOnChange() {
    const searchParams = useSearchParams();

    useEffect(() => {
        // Buscamos el elemento ancla que definimos en page.tsx
        const element = document.getElementById("job-list-section");
        if (element) {
            // Hacemos scroll suave hacia él
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [searchParams]); // Se ejecuta cada vez que cambia la URL (página o filtro)

    return null; // Este componente no renderiza nada visual
}
