import { Button } from "../ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Lado Izquierdo: Textos */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Encuentra tu Trabajo <br />
            <span className="text-blue-600">Ideal Ahora Mismo</span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
            Conectamos a los mejores talentos con las empresas más innovadoras. 
            Tu próxima gran oportunidad está a un click de distancia.
          </p>

          <div className="flex gap-4 justify-center md:justify-start">
            <Link href="/jobs">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Ver Ofertas
                </Button>
            </Link>
            <Button variant="outline" className="px-8 py-6 text-lg">
              Saber Más
            </Button>
          </div>
        </div>

        {/* Lado Derecho: Imagen (Cuadrado Azul Decorativo por ahora) */}
        <div className="flex-1 w-full max-w-lg">
          <div className="aspect-square bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl shadow-2xl skew-y-3 transform rotate-2">
            {/* Aquí iría una foto real luego */}
          </div>
        </div>

      </div>
    </section>
  );
}