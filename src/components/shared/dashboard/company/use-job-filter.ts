
import { useState, useMemo } from "react";

export type SortKey = 'date' | 'title' | 'applicants';
export type SortDirection = 'asc' | 'desc';

export function useJobFilter(jobs: any[]) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const processedJobs = useMemo(() => {
        // 1. Filtrado (Search)
        let data = [...jobs];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(job =>
                job.title.toLowerCase().includes(lowerTerm) ||
                job.category.toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Ordenamiento (Sort)
        return data.sort((a, b) => {
            let res = 0;
            switch (sortKey) {
                case 'date':
                    res = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                    break;
                case 'title':
                    res = a.title.localeCompare(b.title);
                    break;
                case 'applicants':
                    res = (a.applications?.length || 0) - (b.applications?.length || 0);
                    break;
            }

            // Tie-breaker: siempre por fecha reciente
            if (res === 0) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }

            return sortDirection === 'asc' ? res : -res;
        });
    }, [jobs, searchTerm, sortKey, sortDirection]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    return {
        searchTerm,
        setSearchTerm,
        sortKey,
        sortDirection,
        toggleSort,
        processedJobs
    };
}
