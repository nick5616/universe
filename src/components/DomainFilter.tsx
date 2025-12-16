import React from "react";
import { Project } from "../lib/mockData";

type Domain = "All" | Project["domain"];

interface DomainFilterProps {
    activeDomain: Domain;
    onSelectDomain: (domain: Domain) => void;
    onAddProjectClick: () => void;
}

const DomainFilter: React.FC<DomainFilterProps> = ({
    activeDomain,
    onSelectDomain,
    onAddProjectClick,
}) => {
    const domains: Domain[] = [
        "All",
        "Art",
        "Code",
        "Music",
        "Content Creation",
    ];

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
                {domains.map((domain) => (
                    <button
                        key={domain}
                        onClick={() => onSelectDomain(domain)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                            activeDomain === domain
                                ? "bg-passion-500 text-white shadow-lg glow-passion"
                                : "bg-earth-800 text-stone-300 hover:bg-earth-700 hover:text-stone-100"
                        }`}
                    >
                        {domain}
                    </button>
                ))}
            </div>
            <button
                onClick={onAddProjectClick}
                className="px-5 py-2 bg-gradient-to-r from-growth-500 to-growth-600 rounded-lg text-sm font-bold text-white hover:from-growth-400 hover:to-growth-500 transition-all duration-300 shadow-lg hover:shadow-growth-500/25"
            >
                + Plant a Seed
            </button>
        </div>
    );
};

export default DomainFilter;
