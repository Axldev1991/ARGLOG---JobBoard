
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("user_session")?.value;

    if (!token) {
        return null;
    }

    return await verifyJWT(token);
}
