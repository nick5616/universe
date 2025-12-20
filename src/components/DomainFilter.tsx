import React, { useState, useRef, useEffect } from "react";
import { Project } from "../lib/mockData";

type Domain = "All" | Project["domain"];

interface DomainFilterProps {
    activeDomain: Domain;
    domains: Domain[];
    onSelectDomain: (domain: Domain) => void;
    onAddProjectClick: () => void;
    onAddDomain?: () => void;
}

const DomainFilter: React.FC<DomainFilterProps> = ({
    activeDomain,
    domains,
    onSelectDomain,
    onAddProjectClick,
    onAddDomain,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftGradient, setShowLeftGradient] = useState(false);
    const [showRightGradient, setShowRightGradient] = useState(false);

    const updateGradients = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        const isAtStart = scrollLeft <= 0;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1; // -1 for floating point precision

        setShowLeftGradient(!isAtStart);
        setShowRightGradient(!isAtEnd);
    };

    useEffect(() => {
        updateGradients();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", updateGradients);
            // Also check on resize
            window.addEventListener("resize", updateGradients);
            return () => {
                container.removeEventListener("scroll", updateGradients);
                window.removeEventListener("resize", updateGradients);
            };
        }
    }, [domains]);

    return (
        <div className="flex items-center gap-4 w-full min-w-0">
            {/* Horizontal scrollable domain container - fixed width, doesn't overflow */}
            <div className="relative flex-1 min-w-0 overflow-hidden">
                {/* Gradient fade indicators */}
                {showLeftGradient && (
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-earth-900 via-earth-900/80 to-transparent pointer-events-none z-10" />
                )}
                {showRightGradient && (
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-earth-900 via-earth-900/80 to-transparent pointer-events-none z-10" />
                )}

                {/* Scrollable domain buttons */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth min-w-0"
                >
                    {domains.map((domain) => (
                        <button
                            key={domain}
                            onClick={() => onSelectDomain(domain)}
                            className={`flex-shrink-0 w-32 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap text-center ${
                                activeDomain === domain
                                    ? "bg-passion-500 text-white shadow-lg glow-passion"
                                    : "bg-earth-800 text-stone-300 hover:bg-earth-700 hover:text-stone-100"
                            }`}
                        >
                            <span className="truncate block">{domain}</span>
                        </button>
                    ))}
                    {onAddDomain && (
                        <button
                            onClick={onAddDomain}
                            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium bg-earth-800 text-stone-300 hover:bg-earth-700 hover:text-stone-100 transition-all duration-300"
                            title="Create domain"
                        >
                            +
                        </button>
                    )}
                </div>
            </div>

            <button
                onClick={onAddProjectClick}
                className="flex-shrink-0 px-5 py-2 bg-gradient-to-r from-growth-500 to-growth-600 rounded-lg text-sm font-bold text-white hover:from-growth-400 hover:to-growth-500 transition-all duration-300 shadow-lg hover:shadow-growth-500/25"
            >
                + Project
            </button>
        </div>
    );
};

export default DomainFilter;
