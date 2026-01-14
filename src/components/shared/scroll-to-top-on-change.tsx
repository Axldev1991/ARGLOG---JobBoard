"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function ScrollToTopOnChange() {
    const searchParams = useSearchParams();
    // Guardamos los params iniciales como referencia
    const prevParams = useRef(searchParams.toString());

    useEffect(() => {
        const currentParams = searchParams.toString();

        // Comparamos el string actual con el anterior.
        // Si son IGUALES (como en la carga inicial o navegación simple sin cambio de query), NO hacemos nada.
        if (currentParams !== prevParams.current) {
            const element = document.getElementById("job-list-section");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            // Actualizamos la referencia para la próxima comparación
            prevParams.current = currentParams;
        }
    }, [searchParams]);

    return null;
}
