import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">
        Proyecto Vacío
      </h1>
      <p className="mt-4 text-gray-500">
        Listo para empezar a programar paso a paso.
      </p>
      <Button variant="outline">Mi primer boton</Button>
    </main>
  );
}
