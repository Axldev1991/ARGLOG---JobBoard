import Link from "next/link";
import { Button } from "../ui/button";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { logout } from "@/actions/logout";

export async function Navbar() {

  const user = await getSession();

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
            <>
              <Link href="/dashboard" className="flex items-center gap-2 font-medium bg-gray-100 p-2 rounded-full px-4 hover:bg-gray-200 transition-colors">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="text-sm font-semibold text-gray-900">{user.name}</span>
              </Link>

              <form action={logout}>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  Salir
                </Button>
              </form>
            </>
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