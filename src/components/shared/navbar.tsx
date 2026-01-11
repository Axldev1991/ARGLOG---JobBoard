import Link from "next/link";
import { Button } from "../ui/button";
import { cookies } from "next/headers";

export async function Navbar() {

  const cookieStore = await cookies();
  const session = cookieStore.get("user_session")?.value;

  // Si hay sesión, parseamos el JSON para tener el objeto { name: "Axel" }
  const user = session ? JSON.parse(session) : null;
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      {/* Lado Izquierdo: Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-xl">
        <div className="bg-blue-600 text-white p-1 rounded">JD</div> {/* Icono fake */}
        JobBoard
      </Link>

      <div className="hidden md:flex gap-6">
        <Link href="/">Inicio</Link>
        <Link href="/jobs">Ofertas</Link>
        <Link href="/companies">Empresas</Link>
      </div>
      {/* Lado Derecho: Botones */}
      <div className="flex gap-4">
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">

        </div>
        <div className="flex gap-4 items-center"> {/* Agrega items-center */}

          {/* === AQUÍ EMPIEZA LO NUEVO === */}
          {user ? (
            // Opción A: Usuario Logueado
            <div className="flex items-center gap-2 font-medium bg-gray-100 p-2 rounded-full px-4">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                {user.name[0]}
              </span>
              <span className="text-sm">{user.name}</span>
            </div>
          ) : (
            // Opción B: Usuario Anónimo
            <Link href="/login">
              <Button variant="ghost">Ingresar</Button>
            </Link>
          )}
          {/* === AQUÍ TERMINA LO NUEVO === */}

          <Link href="/jobs/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Publicar Oferta</Button>
          </Link>
        </div>


      </div>
    </nav>
  );
}