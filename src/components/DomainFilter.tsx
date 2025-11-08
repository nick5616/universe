// src/components/DomainFilter.tsx
import React from "react";
import { Project } from "../lib/mockData";

type Domain = "All" | Project["domain"];

interface DomainFilterProps {
    activeDomain: Domain;
    onSelectDomain: (domain: Domain) => void;
    onAddProject: () => void;
}

const DomainFilter: React.FC<DomainFilterProps> = ({
    activeDomain,
    onSelectDomain,
    onAddProject,
}) => {
    const domains: Domain[] = [
        "All",
        "Art",
        "Code",
        "Music",
        "Content Creation",
    ];

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Your Projects</h2>
                <button
                    onClick={onAddProject}
                    className="px-4 py-2 bg-cyan-600 rounded-lg text-sm font-bold hover:bg-cyan-500 transition"
                >
                    + Add Project
                </button>
            </div>
            <div className="flex space-x-2 mt-2 border-b border-gray-700 pb-4">
                {domains.map((domain) => (
                    <button
                        key={domain}
                        onClick={() => onSelectDomain(domain)}
                        className={`px-4 py-1 rounded-full text-sm transition ${
                            activeDomain === domain
                                ? "bg-cyan-500 text-white font-bold"
                                : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                        {domain}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DomainFilter;
