"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
                type="text"
                className="input-field pl-10"
                placeholder="Search tasks..."
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
};
