import { Tags } from "lucide-react";
import { TagActions } from "@/components/admin/tag-actions";
import { AdminSearch } from "@/components/admin/admin-search";
import { CreateTagForm } from "@/components/admin/create-tag-form";

interface Props {
    tags: any[];
}

/**
 * View component for the "Tag Garden" (Skills dictionary).
 * Allows creating and deleting global tags.
 */
export function TagsView({ tags }: Props) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Tags size={20} className="text-green-600" />
                    Diccionario de Habilidades
                </h2>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <AdminSearch />
                    <CreateTagForm />
                </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">ID</th>
                            <th className="p-4 font-semibold text-slate-600">Nombre</th>
                            <th className="p-4 font-semibold text-slate-600">Tipo</th>
                            <th className="p-4 font-semibold text-slate-600">Uso (Jobs)</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {tags.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400">
                                    No hay tags creados aún.
                                </td>
                            </tr>
                        ) : (
                            tags.map((tag) => (
                                <tr key={tag.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono text-slate-500 w-16">#{tag.id}</td>
                                    <td className="p-4 font-medium text-slate-900">
                                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded border">
                                            {tag.name}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600 capitalize">{tag.type}</td>
                                    <td className="p-4 text-slate-600">{tag._count.jobs} ofertas</td>
                                    <td className="p-4 text-right">
                                        <TagActions tagId={tag.id} tagName={tag.name} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
