"use client";

import React from "react";
import { clsx } from "clsx";

interface FilterProps {
    currentFilter: string;
    onFilterChange: (filter: string) => void;
}

export const Filter: React.FC<FilterProps> = ({ currentFilter, onFilterChange }) => {
    const filters = [
        { label: "All", value: "" },
        { label: "Pending", value: "false" },
        { label: "Completed", value: "true" },
    ];

    return (
        <div className="flex bg-secondary/50 p-1 rounded-lg">
            {filters.map((f) => (
                <button
                    key={f.value}
                    onClick={() => onFilterChange(f.value)}
                    className={clsx(
                        "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                        currentFilter === f.value
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
};
