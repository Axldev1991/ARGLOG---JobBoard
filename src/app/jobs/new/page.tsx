import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createJob } from "@/actions/create-job";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { TagSelector } from "@/components/ui/tag-selector";
import { ArrowLeft, Briefcase, MapPin, DollarSign, LayoutGrid, Globe, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function NewJobPage() {
    const user = await getSession();
    const tags = await prisma.tag.findMany();

    if (!user) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-[#020817] py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="w-full max-w-4xl space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 mb-2 transition-colors">
                            <ArrowLeft size={16} /> Volver al Panel
                        </Link>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Publicar Nueva Oferta</h1>
                        <p className="text-slate-400 mt-1">Busca el mejor talento creando una oferta atractiva.</p>
                    </div>
                </div>

                {/* Card del Formulario */}
                <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">

                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <form action={createJob} className="space-y-8 relative z-10">

                        {/* 1. Detalles Básicos */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                                <Briefcase className="text-blue-500" size={20} /> Detalles del Puesto
                            </h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Título de la Oferta</label>
                                    <Input
                                        name="title"
                                        placeholder="Ej: Senior Frontend Developer"
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500 h-12 text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        <LayoutGrid size={16} /> Categoría
                                    </label>
                                    <div className="relative">
                                        <select name="category" className="w-full h-11 pl-3 pr-10 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none">
                                            <option value="Desarrollo">Desarrollo</option>
                                            <option value="Diseño">Diseño</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Ventas">Ventas</option>
                                            <option value="Producto">Producto</option>
                                            <option value="Data">Data & Analytics</option>
                                            <option value="Logística">Logística</option>
                                            <option value="Otros">Otros</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        <DollarSign size={16} /> Salario (Mensual)
                                    </label>
                                    <Input
                                        name="salary"
                                        placeholder="Ej: $1,500 - $2,500 USD"
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Ubicación y Modalidad */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2 mt-8">
                                <Globe className="text-indigo-500" size={20} /> Ubicación y Modalidad
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Modalidad de Trabajo</label>
                                    <div className="relative">
                                        <select name="modality" className="w-full h-11 pl-3 pr-10 py-2 bg-slate-900/50 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none">
                                            <option value="Remoto">Remoto 100%</option>
                                            <option value="Híbrido">Híbrido</option>
                                            <option value="Presencial">Presencial</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        <MapPin size={16} /> Ciudad / País
                                    </label>
                                    <Input
                                        name="location"
                                        placeholder="Ej: Buenos Aires, Argentina"
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Skills y Descripción */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-2 mt-8">
                                <FileText className="text-emerald-500" size={20} /> Descripción y Habilidades
                            </h2>

                            <div className="bg-slate-900/30 p-6 rounded-xl border border-slate-800">
                                <label className="block text-sm font-medium text-slate-300 mb-4">
                                    Habilidades Requeridas (Skills)
                                </label>
                                <TagSelector availableTags={tags} />
                                <p className="text-xs text-slate-500 mt-2">Selecciona las tecnologías o habilidades clave para el puesto.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Descripción Detallada</label>
                                <textarea
                                    name="description"
                                    placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
                                    className="w-full bg-slate-900/50 border-slate-700 text-white rounded-lg p-4 min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-600 leading-relaxed"
                                    required
                                />
                            </div>
                        </div>

                        {/* Footer de Acciones */}
                        <div className="pt-8 border-t border-slate-800 flex items-center justify-end gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" type="button" className="text-slate-400 hover:text-white hover:bg-slate-800">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 text-lg font-semibold shadow-lg shadow-blue-900/20">
                                <CheckCircle2 size={20} className="mr-2" /> Publicar Oferta
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    );
}