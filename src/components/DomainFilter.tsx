// src/components/DomainFilter.tsx
import React, { useState, useEffect } from "react";
import { Project, Domain } from "../lib/mockData";
import { dataService } from "../services/dataService";

type DomainFilterType = "All" | Project["domain"];

interface DomainFilterProps {
    activeDomain: DomainFilterType;
    onSelectDomain: (domain: DomainFilterType) => void;
    onAddProjectClick: () => void;
    onAddDomainClick: () => void;
    refreshKey?: number; // Key to trigger refresh when domains change
}

const DomainFilter: React.FC<DomainFilterProps> = ({
    activeDomain,
    onSelectDomain,
    onAddProjectClick,
    onAddDomainClick,
    refreshKey,
}) => {
    const [domains, setDomains] = useState<Domain[]>([]);

    useEffect(() => {
        const loadDomains = async () => {
            const fetchedDomains = await dataService.getDomains();
            setDomains(fetchedDomains);
        };
        loadDomains();
    }, [refreshKey]);

    const allDomains: DomainFilterType[] = ["All", ...domains];

    return (
        <div>
            <div className="flex justify-between items-center"></div>
            <div className="flex flex-wrap gap-2 mt-2 pb-4">
                {allDomains.map((domain) => (
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
                <button
                    onClick={onAddDomainClick}
                    className="px-4 py-2 bg-cyan-600 rounded-lg text-sm font-bold hover:bg-cyan-500 transition"
                >
                    + New domain
                </button>
            </div>
        </div>
    );
};

export default DomainFilter;
