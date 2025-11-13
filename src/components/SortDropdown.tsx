// src/components/SortDropdown.tsx
import React from "react";

export type SortOption = "last_touched_at" | "name" | "ideas";

interface SortDropdownProps {
    sortBy: SortOption;
    onSortChange: (value: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
    sortBy,
    onSortChange,
}) => {
    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="sort-by" className="text-sm text-gray-400">
                Sort by:
            </label>
            <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-gray-700 text-white text-sm font-semibold p-1.5 rounded-lg focus:ring-1 focus:ring-cyan-500 outline-none"
            >
                <option value="last_touched_at">Last Touched</option>
                <option value="name">Alphabetical</option>
                <option value="ideas">Most Ideas</option>
            </select>
        </div>
    );
};

export default SortDropdown;
