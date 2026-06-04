import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

const getCachedMaintenanceMode = unstable_cache(
    async () => {
        // Guard: Check if the model exists (handles stale Prisma instances in dev)
        if (!prisma.systemSetting) {
            console.warn("⚠️ SystemSetting model missing. Please restart your dev server.");
            return false;
        }

        const setting = await prisma.systemSetting.findUnique({
            where: { key: "maintenance_mode" },
        });

        return setting?.value === "true";
    },
    ["maintenance_mode"],
    { revalidate: 30, tags: ["system_settings"] }
);

export async function isMaintenanceMode(): Promise<boolean> {
    try {
        return await getCachedMaintenanceMode();
    } catch (error) {
        console.error("Failed to check maintenance mode:", error);
        return false; // Fail open (site remains accessible if DB fails)
    }
}
