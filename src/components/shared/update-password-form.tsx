"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updatePassword } from "@/actions/update-password"
import { toast } from "sonner"
import { KeyRound, X } from "lucide-react"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={pending}>
            {pending ? "Actualizando..." : "Actualizar Contraseña"}
        </Button>
    )
}

export function UpdatePasswordModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function action(formData: FormData) {
        const result = await updatePassword(formData)

        if (result.error) {
            toast.error(result.error)
        } else if (result.success) {
            setIsSuccess(true)
            toast.success("Tu contraseña ha sido actualizada correctamente.")
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        setIsSuccess(false)
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2"
            >
                <KeyRound size={16} />
                Cambiar Contraseña
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md mx-auto rounded-xl border border-border bg-card text-card-foreground shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        {/* Botón de cerrar */}
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {isSuccess ? (
                            <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
                                    <KeyRound className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold">¡Actualizada!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Tu contraseña se ha cambiado exitosamente. Por seguridad, usala en tu próximo inicio de sesión.
                                </p>
                                <Button onClick={handleClose} className="mt-4 w-full">
                                    Cerrar
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 pb-2">
                                    <div className="flex items-center space-x-2 mb-2 text-blue-600">
                                        <KeyRound className="w-5 h-5" />
                                        <h3 className="text-xl font-bold tracking-tight text-foreground">Cambiar Contraseña</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Ingresa tu contraseña actual y la nueva.
                                    </p>
                                </div>
                                <div className="p-6 pt-4">
                                    <form action={action} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Contraseña Actual</Label>
                                            <Input
                                                id="currentPassword"
                                                name="currentPassword"
                                                type="password"
                                                required
                                                className="bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">Nueva Contraseña</Label>
                                            <Input
                                                id="newPassword"
                                                name="newPassword"
                                                type="password"
                                                required
                                                placeholder="Mínimo 6 caracteres"
                                                className="bg-background"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                placeholder="Mínimo 6 caracteres"
                                                className="bg-background"
                                            />
                                        </div>
                                        <SubmitButton />
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
