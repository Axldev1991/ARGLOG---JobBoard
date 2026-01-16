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
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Tags size={20} className="text-primary" />
                    Diccionario de Habilidades
                </h2>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <AdminSearch />
                    <CreateTagForm />
                </div>
            </div>

            {/* Mobile View: Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {tags.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground bg-card rounded-xl border border-border shadow-sm">
                        No hay tags creados aún.
                    </div>
                ) : (
                    tags.map((tag) => (
                        <div key={tag.id} className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                                        #{tag.id} • {tag.type}
                                    </span>
                                    <span className="bg-muted text-card-foreground px-3 py-1 rounded-md border border-border font-semibold text-lg inline-block">
                                        {tag.name}
                                    </span>
                                </div>
                                <TagActions tagId={tag.id} tagName={tag.name} />
                            </div>

                            <div className="flex items-center gap-2 text-sm text-foreground bg-muted/50 p-2 rounded-lg">
                                <span className="font-medium text-foreground">Uso:</span>
                                {tag._count.jobs} ofertas
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-semibold text-muted-foreground">ID</th>
                            <th className="p-4 font-semibold text-muted-foreground">Nombre</th>
                            <th className="p-4 font-semibold text-muted-foreground">Tipo</th>
                            <th className="p-4 font-semibold text-muted-foreground">Uso (Jobs)</th>
                            <th className="p-4 font-semibold text-muted-foreground text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {tags.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No hay tags creados aún.
                                </td>
                            </tr>
                        ) : (
                            tags.map((tag) => (
                                <tr key={tag.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-mono text-muted-foreground w-16">#{tag.id}</td>
                                    <td className="p-4 font-medium text-foreground">
                                        <span className="bg-muted text-card-foreground px-2 py-1 rounded border border-border">
                                            {tag.name}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground capitalize">{tag.type}</td>
                                    <td className="p-4 text-muted-foreground">{tag._count.jobs} ofertas</td>
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
