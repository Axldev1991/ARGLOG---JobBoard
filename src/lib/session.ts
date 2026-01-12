
import { cookies } from "next/headers";

export async function getSession() {
    const cookieStore = await cookies();
    const sessionString = cookieStore.get("user_session")?.value;

    if (!sessionString) {
        return null;
    }

    try {
        return JSON.parse(sessionString);
    } catch (error) {
        return null;
    }
}
