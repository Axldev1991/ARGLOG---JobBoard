import { Wrench } from "lucide-react";

export default function MaintenanceScreen() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-sans text-foreground">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-primary/20 opacity-90"></div>

            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card/50 p-8 text-center shadow-2xl backdrop-blur-xl">
                {/* Glow effect */}
                <div className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 bg-primary/30 blur-3xl"></div>

                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-primary/20 p-4 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                        <Wrench className="h-10 w-10 text-primary" />
                    </div>
                </div>

                <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
                    Under Maintenance
                </h1>

                <p className="mb-8 text-muted-foreground">
                    We are upgrading our engines to provide you with a better service. We
                    will be back shortly.
                </p>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
                    <span>System upgrade in progress</span>
                </div>
            </div>
        </div>
    );
}
