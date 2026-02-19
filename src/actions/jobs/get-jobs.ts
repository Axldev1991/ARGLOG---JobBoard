"use server";

import { prisma } from "@/lib/db";
import { Job, Prisma } from "@prisma/client";

export interface GetJobsParams {
    query?: string;
    category?: string;
    modality?: string;
    tags?: string[];
    page?: number;
    pageSize?: number;
    userId?: number;
    excludeIds?: number[];
}

export type JobWithRelations = Job & {
    tags: { id: number; name: string }[];
    author: { name: string; email: string };
    applications: { id: number }[];
};

/**
 * Retrieves a paginated list of jobs based on filters.
 * @param params - Filters and pagination parameters.
 * @returns Object containing the list of jobs and total count.
 */
export async function getJobs(params: GetJobsParams) {
    const {
        query,
        category,
        modality,
        tags = [],
        page = 1,
        pageSize = 6,
        userId,
        excludeIds = [],
    } = params;

    // 1. Build 'Where' Clause
    const whereClause: Prisma.JobWhereInput = {
        AND: [
            {
                status: "PUBLISHED",
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
            query
                ? {
                    OR: [
                        { title: { contains: query, mode: "insensitive" } },
                        { description: { contains: query, mode: "insensitive" } },
                    ],
                }
                : {},
            category ? { category } : {},
            modality ? { modality } : {},
            tags.length > 0
                ? {
                    AND: tags.map((t) => ({
                        tags: {
                            some: { name: { contains: t.trim(), mode: "insensitive" } },
                        },
                    })),
                }
                : {},
            excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {},
        ],
    };

    try {
        const [jobs, totalJobs] = await Promise.all([
            prisma.job.findMany({
                where: whereClause,
                include: {
                    tags: true,
                    author: {
                        select: { name: true, email: true }, // Select only necessary fields
                    },
                    applications: {
                        where: { userId: userId || -1 },
                        select: { id: true }, // Optimization: We only need existence check
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.job.count({ where: whereClause }),
        ]);

        return { jobs, totalJobs };
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return { jobs: [], totalJobs: 0 };
    }
}

/**
 * Retrieves featured jobs for the carousel.
 * @param limit - Number of featured jobs to retrieve.
 * @returns List of featured jobs.
 */
export async function getFeaturedJobs(limit: number = 6) {
    try {
        return await prisma.job.findMany({
            take: limit,
            where: {
                status: "PUBLISHED",
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
            },
            orderBy: { createdAt: "desc" },
            include: {
                tags: true,
                author: {
                    select: { name: true, email: true },
                },
            },
        });
    } catch (error) {
        console.error("Error fetching featured jobs:", error);
        return [];
    }
}
