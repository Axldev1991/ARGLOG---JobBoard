import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export async function isMaintenanceMode(): Promise<boolean> {
    // Prevent caching so the switch is instant
    noStore();

    try {
        // Guard: Check if the model exists (handles stale Prisma instances in dev)
        // @ts-ignore - Prisma client might be stale in dev
        if (!prisma.systemSetting) {
            console.warn("⚠️ SystemSetting model missing. Please restart your dev server.");
            return false;
        }

        const setting = await prisma.systemSetting.findUnique({
            where: { key: "maintenance_mode" },
        });

        return setting?.value === "true";
    } catch (error) {
        console.error("Failed to check maintenance mode:", error);
        return false; // Fail open (site remains accessible if DB fails)
    }
}
