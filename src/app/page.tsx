import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Hero } from "@/components/shared/hero";
import Link from "next/link"; // ✅ Correcto: Importamos Link de Next.js para navegar sin recargar

export default async function Home() {
  const jobs = await prisma.job.findMany();
  // console.log(jobs); // Debug

  return (
    <main className="">
      {/* 1. SECCIÓN HERO: Bienvenida e imagen grande */}
      <Hero />

      <div className="p-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ofertas de Trabajo</h1>

        {/* 2. GRID DE OFERTAS: Lista de tarjetas responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => (
            // A. ENLACE PADRE: Envuelve toda la tarjeta para que sea cliqueable
            <Link key={job.id} href={`/jobs/${job.id}`} className="block h-full">

              {/* B. DISEÑO TARJETA: Estilos visuales y efectos hover */}
              <div className="bg-white border hover:shadow-lg transition-all p-6 rounded-xl group cursor-pointer h-full flex flex-col">

                {/* Icono decorativo */}
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  💼
                </div>

                {/* Título de la oferta */}
                <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>

                {/* Descripción (cortada a 2 líneas con line-clamp) */}
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{job.description}</p>

                {/* Footer de la tarjeta (Salario y Tiempo) */}
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-semibold text-blue-600">${job.salary}</span>
                  <span className="text-xs text-gray-400">Ver detalle →</span>
                </div>
              </div>

            </Link>
          ))}

        </div>
      </div>
    </main>
  );
}
