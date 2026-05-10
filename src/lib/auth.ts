import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(
    process.env.SESSION_SECRET || "default_iron_dome_secret_change_me_in_production"
);

export interface SessionPayload {
    id: string;
    role: "candidate" | "company" | "admin" | "dev";
    name: string;
}

// 🧠 FIRMAR TOKEN
export async function signJWT(payload: SessionPayload) {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h") // Sesión de 2 horas
        .sign(SECRET);
}

// 🧠 VERIFICAR TOKEN
export async function verifyJWT(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET, {
            algorithms: ["HS256"],
        });
        return payload as unknown as SessionPayload;
    } catch (error) {
        return null;
    }
}

// 🧠 UTILIDAD RBAC (Role Based Access Control)
// Esta función envuelve la lógica de autorización
export async function requireRole(allowedRoles: string[]) {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;

    if (!token) {
        redirect("/login");
    }

    const payload = await verifyJWT(token);

    if (!payload || !allowedRoles.includes(payload.role)) {
        // Podríamos redirigir o lanzar un error específico
        throw new Error("No autorizado: Permisos insuficientes");
    }

    return payload;
}
