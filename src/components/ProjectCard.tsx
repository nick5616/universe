// src/components/ProjectCard.tsx
import React from "react";
import { Project } from "../lib/mockData";

// This function now calculates a "vitality" score in days
const getVitality = (
    dateString: string
): { daysAgo: number; label: string } => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const days = Math.floor(seconds / 86400);

    if (days < 1) return { daysAgo: 0, label: "touched today" };
    if (days === 1) return { daysAgo: 1, label: "touched yesterday" };
    return { daysAgo: days, label: `touched ${days} days ago` };
};

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
    onDelete: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onClick,
    onDelete,
}) => {
    const vitality = getVitality(project.last_touched_at);

    // --- THEMATIC STYLING ---
    // Determine the card's visual state based on its vitality
    let vitalityStyles = "transition-all duration-500";
    if (vitality.daysAgo <= 3) {
        // Recently active: Bright and glowing
        vitalityStyles += " opacity-100 shadow-lg shadow-cyan-500/20";
    } else if (vitality.daysAgo <= 14) {
        // A little dormant: Still bright but less glow
        vitalityStyles += " opacity-90";
    } else {
        // Dormant: Faded, like a distant star
        vitalityStyles += " opacity-60 hover:opacity-100";
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (
            window.confirm(`Are you sure you want to delete "${project.name}"?`)
        ) {
            onDelete(project.id);
        }
    };

    return (
        <div
            className={`group bg-gray-800 rounded-lg p-6 hover:scale-[1.03] cursor-pointer flex flex-col justify-between ${vitalityStyles}`}
            onClick={onClick}
        >
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold">{project.name}</h3>
                    <span className="bg-gray-700 text-cyan-400 text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ml-2">
                        {project.domain}
                    </span>
                </div>
                <p className="text-gray-400 mt-2 text-sm italic line-clamp-2">
                    {project.description}
                </p>
                <p className="text-gray-400 mt-2">
                    {project.ideas.length} ideas
                </p>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>{vitality.label}</span>
                <button
                    onClick={handleDeleteClick}
                    className="text-gray-500 hover:text-red-500 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    REMOVE
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
