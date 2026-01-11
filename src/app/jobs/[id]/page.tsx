import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// 1. Recibimos params (es async porque Next.js 15+ lo requiere)
interface Props {
  params: Promise<{ id: string }>; // <--- OJO: Promise en las nuevas versiones
}

export default async function JobDetailPage({ params }: Props) {
  // 2. Extraemos el ID (esperando la promesa)
  const { id } = await params;

  // 3. Buscamos en la BD
  const job = await prisma.job.findUnique({
    where: {
      id: parseInt(id) // Convertimos string "1" a numero 1
    },
    include: {
        author: true // Truco: Traer también datos del autor (nombre, email)
    }
  });

  // 4. Si no existe (ej: ID 999), mostramos error
  if (!job) {
    return <div className="p-10 text-center">Oferta no encontrada 😢</div>;
  }

  // 5. Renderizamos bonito
  return (
    <main className="max-w-4xl mx-auto p-10">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        ← Volver a Ofertas
      </Link>
      
      <div className="bg-white border rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{job.title}</h1>
        <p className="text-gray-500 mb-6">
            Publicado por {job.author.name} • ${job.salary}
        </p>

        <div className="prose max-w-none text-gray-700">
            {/* description puede ser larga, así que whitespace-pre-line respeta los saltos de línea */}
            <p className="whitespace-pre-line">{job.description}</p>
        </div>

        <div className="mt-8 pt-6 border-t flex gap-4">
            <Button className="bg-blue-600 text-white w-full md:w-auto">
                Postularme Ahora
            </Button>
            <Button variant="outline">
                Guardar oferta
            </Button>
        </div>
      </div>
    </main>
  );
}