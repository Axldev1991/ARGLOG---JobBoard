import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"

}

// ESTA LÍNEA ES LA QUE TE FALTABA AL PRINCIPIO:
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {

        const variants = {
            default: "bg-slate-900 text-white hover:bg-slate-800",

            outline: "border border-slate-200 bg-white hover:bg-slate-100",

            ghost: "hover:bg-slate-100 text-slate-700",

            destructive: "bg-red-500 text-white hover:bg-red-600",
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 px-3",
            lg: "h-12 px-8",
            icon: "h-10 w-10",
        }

        return (
            <button
                ref={ref}
                className={cn(
                    // Clases base (siempre fijas): Flexbox, centrado, bordes redondeados
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50",

                    // Aquí inyectamos lo que elegiste arriba
                    variants[variant],
                    sizes[size],

                    // Aquí permitimos que si el usuario pasó una clase extra, se agregue al final
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
