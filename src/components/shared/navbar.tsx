import Link from "next/link";
import { Button } from "../ui/button";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 border-b">
      {/* Lado Izquierdo: Logo */}
      <h1 className="text-xl font-bold">JobBoard</h1>

      {/* Lado Derecho: Botones */}
      <div className="flex gap-4">
        <Link href="/login">
            <Button variant="ghost">Ingresar</Button>
        </Link>
        <Button>Publicar Oferta</Button>
      </div>
    </nav>
  );
}