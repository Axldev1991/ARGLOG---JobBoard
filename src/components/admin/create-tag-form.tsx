"use client";

import { createTag } from "@/actions/admin/create-tag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";

export function CreateTagForm() {
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        const result = await createTag(formData);

        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success("Tag creado correctamente");
            formRef.current?.reset();
        }
    };

    return (
        <form
            ref={formRef}
            action={handleSubmit}
            className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
            <Input
                name="name"
                placeholder="Nuevo Tag (ej: Python)"
                className="bg-white h-9 min-w-[200px]"
                required
            />
            <select
                name="type"
                className="h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                <option value="tech">Tech</option>
                <option value="location">Ubicación</option>
                <option value="role">Rol</option>
            </select>
            <Button type="submit" size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                <Plus size={16} className="mr-1" /> Agregar
            </Button>
        </form>
    );
}
