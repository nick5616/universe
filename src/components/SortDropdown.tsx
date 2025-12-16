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
            <label htmlFor="sort-by" className="text-sm text-stone-400">
                Sort by:
            </label>
            <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-earth-800 text-stone-200 text-sm font-medium p-2 rounded-lg border border-earth-700 focus:ring-2 focus:ring-passion-500 focus:border-transparent outline-none transition-all"
            >
                <option value="last_touched_at">Last Tended</option>
                <option value="name">Alphabetical</option>
                <option value="ideas">Most Ideas</option>
            </select>
        </div>
    );
};

export default SortDropdown;
