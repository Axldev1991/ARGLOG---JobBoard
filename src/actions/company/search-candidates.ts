"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface SearchCandidatesParams {
    query?: string;
    tagIds?: number[];
    page?: number;
    pageSize?: number;
}

export async function searchCandidates(params: SearchCandidatesParams) {
    const {
        query,
        tagIds = [],
        page = 1,
        pageSize = 10,
    } = params;

    const whereClause: Prisma.UserWhereInput = {
        role: "candidate",
        AND: [
            query
                ? {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { headline: { contains: query, mode: "insensitive" } },
                        { bio: { contains: query, mode: "insensitive" } },
                    ],
                }
                : {},
            tagIds.length > 0
                ? {
                    tags: {
                        some: {
                            id: { in: tagIds }
                        }
                    }
                }
                : {},
        ],
    };

    try {
        const [candidates, total] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                include: {
                    tags: true,
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.user.count({ where: whereClause }),
        ]);

        return { candidates, total };
    } catch (error) {
        console.error("Error searching candidates:", error);
        return { candidates: [], total: 0 };
    }
}
