"use client"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { TagPill } from "./tag-pill";

export function SearchFilters() {
    const router = useRouter(); // 🚗 El conductor (para cambiar de ruta)
    const searchParams = useSearchParams(); // 🕵️ El detective (lee la URL actual)

    // Función que se ejecuta al darle "Buscar" o Enter
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 🛑 Evitamos el recargo completo de página

        // 1. Leemos los datos del formulario
        const formData = new FormData(e.currentTarget);
        const q = formData.get("q") as string;
        const category = formData.get("category") as string;
        const modality = formData.get("modality") as string;

        // 2. Construimos los parámetros URL de forma limpia
        const params = new URLSearchParams();

        if (q) params.set("q", q);
        if (category) params.set("category", category);
        if (modality) params.set("modality", modality);

        // 3. Empujamos la nueva URL (sin recargar)
        // scroll: false evita que la página salte hacia arriba al buscar
        router.push(`/?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
            <form onSubmit={handleSubmit} className="flex gap-4">
                <Input
                    name="q"
                    placeholder="Buscar por puesto o palabra clave..."
                    className="flex-1"
                    defaultValue={searchParams.get("q")?.toString()} // ✨ Mantiene lo que escribiste si refrescas
                />
                <select
                    name="category"
                    defaultValue={searchParams.get("category")?.toString()} // ✨ Mantiene la selección
                    className="bg-white border border-slate-200 p-2 rounded-md text-sm text-slate-700 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Todas las Categorías</option>
                    <option value="Logística">Logística</option>
                    <option value="Administración">Administración</option>
                    <option value="Transporte">Transporte</option>
                </select>

                <select
                    name="modality"
                    defaultValue={searchParams.get("modality")?.toString()} // ✨ Mantiene la selección
                    className="bg-white border border-slate-200 p-2 rounded-md text-sm text-slate-700 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Cualquier Modalidad</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Híbrido">Híbrido</option>
                </select>
                <Button type="submit">Buscar</Button>
            </form>

            {/* Sugerencias de Tags Pro (Multi-Select) */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-400 font-medium mr-2">Filtros rápidos:</span>
                {["Clark", "Excel", "Liderazgo", "SAP", "Inglés", "Zona Norte"].map((tag) => {
                    // 1. Leemos los tags actuales de la URL (separados por coma)
                    const currentTagsParam = searchParams.get("tags");
                    const currentTags = currentTagsParam ? currentTagsParam.split(",") : [];

                    // 2. Verificamos si ESTE tag está en la lista
                    const isActive = currentTags.includes(tag);

                    return (
                        <TagPill
                            key={tag}
                            label={tag}
                            selected={isActive}
                            onClick={() => {
                                const params = new URLSearchParams(searchParams.toString());
                                let newTags = [...currentTags];

                                if (isActive) {
                                    // Si ya estaba, lo quitamos
                                    newTags = newTags.filter(t => t !== tag);
                                } else {
                                    // Si no estaba, lo agregamos
                                    newTags.push(tag);
                                }

                                // Actualizamos la URL
                                if (newTags.length > 0) {
                                    params.set("tags", newTags.join(","));
                                } else {
                                    params.delete("tags"); // Si no queda ninguno, limpiamos el param
                                }

                                router.push(`/?${params.toString()}`, { scroll: false });
                            }}
                        />
                    );
                })}
            </div>
        </div>
    )
}