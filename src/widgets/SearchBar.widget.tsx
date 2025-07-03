"use client";
import React from "react";
import { SearchIcon } from "@/lib/svg/icons"

interface SearchBarProps {
    placeholderText: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholderText }) => {
    return (
        <div className="searchbar bg-foreground border border-border-accent min-w-[300px] px-4 py-3 flex items-center gap-2 shadow-searchbar rounded-full">
            <span className="text-secondary">{SearchIcon()}</span>
            <input
                className="text-xs bg-transparent border-none outline-none font-medium text-text-primary w-full h-full placeholder-text-secondary"
                placeholder={placeholderText}
                type="search"
            />
        </div>
    );
}

export default SearchBar;

