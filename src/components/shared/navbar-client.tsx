"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Menu, LogOut, LayoutDashboard, User as UserIcon, Building2, Briefcase, PlusCircle, Sun, Moon, Laptop } from "lucide-react";

interface NavbarClientProps {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role: string;
    } | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { setTheme, theme } = useTheme();

    // Helpers
    const isActive = (path: string) => pathname === path;
    const isCompany = user?.role === 'company';
    const isAdmin = user?.role === 'admin';
    const isDev = user?.role === 'dev';
    const isCandidate = user?.role === 'candidate';

    // Permission Logic: Can post job?
    const canPostJob = !user || isCompany || isAdmin || isDev;

    // Navigation Items
    const navItems = [
        { label: "Inicio", href: "/" },
        { label: "Ofertas", href: "/#ofertas" }, // Using anchor for now or /jobs if separate page exists
        // { label: "Empresas", href: "/companies" }, // Not implemented yet public view
    ];

    const dashboardLink = (isAdmin || isDev) ? "/admin/dashboard" : "/dashboard";

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container px-4 md:px-6 mx-auto h-16 flex items-center justify-between">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 hover:opacity-80 transition-opacity">
                    <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                        <Briefcase size={20} strokeWidth={2.5} />
                    </div>
                    <span className="hidden sm:inline-block">JobBoard</span>
                </Link>

                {/* DESKTOP NAV LINKS */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.href) ? "text-primary font-bold" : "text-muted-foreground"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* RIGHT SIDE ACTIONS */}
                <div className="flex items-center gap-4">

                    {/* POST JOB BUTTON (Desktop) - Hidden for Candidates */}
                    {canPostJob && (
                        <Link href="/jobs/new" className="hidden md:block">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-semibold">
                                <PlusCircle size={16} className="mr-2" />
                                Publicar Oferta
                            </Button>
                        </Link>
                    )}

                    {/* USER MENU (Dropdown) OR LOGIN */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-slate-100 hover:ring-slate-200">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                                            {user.name?.[0]?.toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={dashboardLink} className="cursor-pointer">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>

                                {isCandidate && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="cursor-pointer">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Mi Perfil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Tema</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                                    <Sun className="mr-2 h-4 w-4" />
                                    <span>Claro</span>
                                    {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                                    <Moon className="mr-2 h-4 w-4" />
                                    <span>Oscuro</span>
                                    {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                                    <Laptop className="mr-2 h-4 w-4" />
                                    <span>Sistema</span>
                                    {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onSelect={async () => await logout()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="hidden md:flex gap-2">
                            {/* Theme Toggle for Non-Logged Users */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="mr-2">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setTheme("light")}>Claro</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>Oscuro</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>Sistema</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Link href="/login">
                                <Button variant="ghost" size="sm">Ingresar</Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="default" size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                                    Registrarse
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* MOBILE MENU (Sheet) */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                                <Menu size={24} />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetTitle className="text-left font-bold text-xl mb-6 flex items-center gap-2">
                                <div className="bg-blue-600 text-white p-1 rounded-md">
                                    <Briefcase size={16} />
                                </div>
                                JobBoard
                            </SheetTitle>

                            <nav className="flex flex-col gap-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive(item.href)
                                            ? "bg-accent text-accent-foreground"
                                            : "hover:bg-accent/50 text-muted-foreground"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {/* Actions in Mobile Menu */}
                                <div className="border-t border-slate-100 my-2 pt-4 flex flex-col gap-3">
                                    {user ? (
                                        <>
                                            <div className="px-4 py-2 bg-slate-50 rounded-lg mb-2">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="bg-blue-100 text-blue-700">
                                                            {user.name?.[0]?.toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="overflow-hidden">
                                                        <p className="text-sm font-bold truncate">{user.name}</p>
                                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link href={dashboardLink} onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" className="w-full justify-start">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    Ir al Dashboard
                                                </Button>
                                            </Link>

                                            <form action={async () => { await logout(); setIsOpen(false); }}>
                                                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Cerrar Sesión
                                                </Button>
                                            </form>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" className="w-full">Ingresar</Button>
                                            </Link>
                                            <Link href="/register" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Registrarse</Button>
                                            </Link>
                                        </>
                                    )}

                                    {/* Mobile Post Button - Also hidden for candidates */}
                                    {canPostJob && (
                                        <div className="pt-2">
                                            <Link href="/jobs/new" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                    Publicar Oferta
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>

                </div>
            </div>
        </nav>
    );
}
