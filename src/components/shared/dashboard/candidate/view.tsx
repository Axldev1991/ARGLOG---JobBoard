"use client"

import { useRouter } from "next/navigation";
import { AlertCircle, User, FileText, Briefcase } from "lucide-react";
import { isProfileComplete, cn } from "@/lib/utils";
import { ProfileForm } from "./profile-form";
import { ResumeManager } from "./resume-manager";
import { ApplicationList } from "./application-list";

type Tab = "profile" | "applications";

export function CandidateView({
    user,
    allTags = [],
    applications = [],
    activeTab: initialTab = "profile"
}: {
    user: any,
    allTags?: any[],
    applications?: any[],
    activeTab?: Tab
}) {
    const router = useRouter();
    const activeTab = initialTab || "profile";
    const profileComplete = isProfileComplete(user);

    const handleTabChange = (newTab: Tab) => {
        router.push(`/dashboard?tab=${newTab}`, { scroll: false });
    };

    return (
        <div className="max-w-6xl mx-auto w-full py-6 md:py-8">

            {/* Header: Bienvenida */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Hola, {user.name}</h1>
                    <p className="text-muted-foreground">Gestiona tus datos y postulaciones desde un solo lugar.</p>
                </div>
            </div>

            {/* Warning Banner: Perfil Incompleto */}
            {!profileComplete && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 dark:text-amber-500 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-amber-600 dark:text-amber-500">Tu perfil está incompleto</h3>
                        <p className="text-amber-700 dark:text-amber-400/80 text-sm">
                            Para poder postularte a las ofertas, necesitas completar tu información profesional y subir tu CV.
                        </p>
                    </div>
                </div>
            )}

            {/* TAB NAVIGATION (Cards Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* CARD 1: Mi Perfil */}
                <button
                    onClick={() => handleTabChange("profile")}
                    className={cn(
                        "group p-6 rounded-xl border transition-all text-left w-full relative overflow-hidden",
                        activeTab === "profile"
                            ? "bg-primary/5 border-primary shadow-md ring-1 ring-primary"
                            : "bg-card hover:shadow-lg hover:border-primary/50 text-card-foreground"
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                            activeTab === "profile"
                                ? "bg-primary text-primary-foreground"
                                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                        )}>
                            <User size={24} />
                        </div>
                        {activeTab === "profile" && (
                            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full animate-in fade-in zoom-in">
                                Activo
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className={cn("text-lg font-bold", activeTab === "profile" ? "text-primary " : "text-foreground")}>
                                Mi Perfil
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">Datos personales y profesionales.</p>
                        </div>
                        <div className="text-right">
                            {profileComplete ? (
                                <span className="text-xs font-medium text-green-600 bg-emerald-500/10 px-2 py-1 rounded-full">Completo</span>
                            ) : (
                                <span className="text-xs font-medium text-amber-600 bg-amber-500/10 px-2 py-1 rounded-full">Incompleto</span>
                            )}
                        </div>
                    </div>
                </button>

                {/* CARD 2: Mis Postulaciones */}
                <button
                    onClick={() => handleTabChange("applications")}
                    className={cn(
                        "group p-6 rounded-xl border transition-all text-left w-full relative overflow-hidden",
                        activeTab === "applications"
                            ? "bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500"
                            : "bg-card hover:shadow-lg hover:border-emerald-500/50 text-card-foreground"
                    )}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                            activeTab === "applications"
                                ? "bg-emerald-600 text-white"
                                : "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white"
                        )}>
                            <Briefcase size={24} />
                        </div>
                        {activeTab === "applications" && (
                            <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-in fade-in zoom-in">
                                Activo
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className={cn("text-lg font-bold", activeTab === "applications" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>
                                Mis Postulaciones
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">Sigue el estado de tus búsquedas.</p>
                        </div>
                        <span className="text-3xl font-bold text-foreground">{applications.length}</span>
                    </div>
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="animate-in fade-in duration-500">
                {activeTab === "profile" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <ProfileForm user={user} allTags={allTags} />
                        </div>
                        <div className="space-y-6">
                            <ResumeManager user={user} />
                        </div>
                    </div>
                ) : (
                    <ApplicationList applications={applications} />
                )}
            </div>
        </div>
    );
}