"use client";

import { AlertCircle } from "lucide-react";
import { isProfileComplete } from "@/lib/utils";
import { ProfileForm } from "./profile-form";
import { ResumeManager } from "./resume-manager";
import { ApplicationList } from "./application-list";

export function CandidateView({ user, applications = [] }: { user: any, applications?: any[] }) {

    const profileComplete = isProfileComplete(user);

    return (
        <div className="max-w-6xl mx-auto text-white">

            {/* Header: Bienvenida */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Hola, {user.name}</h1>
                    <p className="text-muted-foreground">Bienvenido a tu panel de control.</p>
                </div>
            </div>

            {/* Warning Banner: Perfil Incompleto */}
            {!profileComplete && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 dark:text-amber-500 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-amber-900 dark:text-amber-500">Tu perfil está incompleto</h3>
                        <p className="text-amber-700 dark:text-amber-400/80 text-sm">
                            Para poder postularte a las ofertas, necesitas completar tu información profesional y subir tu CV.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUMNA IZQUIERDA: DATOS PERSONALES (2 cols span) */}
                <div className="lg:col-span-2 space-y-6">
                    <ProfileForm user={user} />
                </div>

                {/* COLUMNA DERECHA: CV y STATUS */}
                <div className="space-y-6">
                    <ResumeManager user={user} />
                </div>

                {/* ABAJO: LISTA DE APLICACIONES */}
                <ApplicationList applications={applications} />

            </div>
        </div>
    );
}