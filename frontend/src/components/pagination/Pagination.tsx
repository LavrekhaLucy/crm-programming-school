import React from "react";
import { useSearchParams } from "react-router-dom";
import {usePagination} from "../hook/usePagination.ts";

const baseBtn =
    "w-9 h-9 rounded-full flex items-center justify-center " +
    "bg-green-500 text-white font-medium " +
    "hover:bg-green-600 transition-colors " +
    "disabled:bg-green-200 disabled:cursor-not-allowed";

interface PaginationProps {
    totalPages: number;
    siblings?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          totalPages,
                                                          siblings = 1,
                                                      }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Math.min(
        Math.max(Number(searchParams.get("page")) || 1, 1),
        totalPages
    );

    const paginationRange = usePagination({
        currentPage,
        totalPages,
        siblings,
    });

    const setPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        setSearchParams(params);
    };

    if (paginationRange.length === 0) return null;

    return (
        <nav aria-label="Pagination">
            <ul style={{ display: "flex", gap: 8, listStyle: "none", padding: 0 }}>
                {/* Prev */}
                <li>
                    <button className={baseBtn}
                        onClick={() => setPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        {"<"}
                    </button>
                </li>

                {paginationRange.map((item, index) => {
                    if (item === "dots") {
                        return (
                            <li key={`dots-${index}`}  className="w-9 h-9 flex items-center justify-center text-green-600" aria-hidden>
                                …
                            </li>
                        );
                    }

                    const page = item;

                    return (
                        <li key={`page-${page}`}>
                            <button
                                onClick={() => setPage(page)}
                                aria-current={page === currentPage ? "page" : undefined}
                                className={`${baseBtn} ${
                                    page === currentPage ? "bg-green-700 hover:bg-green-700" : ""
                                }`}
                            >
                                {page}
                            </button>
                        </li>
                    );
                })}

                {/* Next */}
                <li>
                    <button className={baseBtn}
                        onClick={() => setPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        {">"}
                    </button>
                </li>
            </ul>
        </nav>
    );
};
