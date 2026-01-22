import { useMemo } from "react";

type PaginationItem = number | "dots";

interface UsePaginationParams {
    currentPage: number;
    totalPages: number;
    siblings?: number;
}

export const usePagination = ({
                                  currentPage,
                                  totalPages,
                                  siblings = 1,
                              }: UsePaginationParams): PaginationItem[] => {
    return useMemo(() => {
        if (totalPages <= 1) return [];

        const range: PaginationItem[] = [];

        const firstPage = 1;
        const lastPage = totalPages;

        const startPage = Math.max(currentPage - siblings, 5);
        const endPage = Math.min(currentPage + siblings, totalPages - 1);

        range.push(firstPage);

        if (startPage >= 7) {
            range.push("dots");
        }

        for (let page = startPage; page <= endPage; page++) {
            range.push(page);
        }

        if (endPage < totalPages - 1) {
            range.push("dots");
        }

        if (totalPages > 1) {
            range.push(lastPage);
        }

        return range;
    }, [currentPage, totalPages, siblings]);
};
