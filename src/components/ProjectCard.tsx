import React from "react";
import { Project } from "../lib/mockData";

const getVitality = (
    dateString: string
): { daysAgo: number; label: string } => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const days = Math.floor(seconds / 86400);

    if (days < 1) return { daysAgo: 0, label: "tended today" };
    if (days === 1) return { daysAgo: 1, label: "tended yesterday" };
    return { daysAgo: days, label: `tended ${days} days ago` };
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

    let vitalityStyles = "transition-all duration-500 border-2";
    if (vitality.daysAgo <= 3) {
        vitalityStyles += " border-growth-500/50 glow-growth opacity-100";
    } else if (vitality.daysAgo <= 14) {
        vitalityStyles += " border-earth-700 opacity-80 hover:opacity-100";
    } else {
        vitalityStyles += " border-earth-800 opacity-50 hover:opacity-90";
    }

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Let "${project.name}" go?`)) {
            onDelete(project.id);
        }
    };

    return (
        <div
            className={`group bg-earth-800 rounded-xl p-6 hover:scale-[1.02] cursor-pointer flex flex-col justify-between ${vitalityStyles}`}
            onClick={onClick}
        >
            <div>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold font-serif text-stone-100">
                        {project.name}
                    </h3>
                    <span className="bg-passion-500/20 text-passion-400 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                        {project.domain}
                    </span>
                </div>
                {project.description && (
                    <p className="text-stone-400 mt-3 text-sm line-clamp-2">
                        {project.description}
                    </p>
                )}
                <p className="text-growth-400 mt-3 font-medium">
                    {project.ideas.length}{" "}
                    {project.ideas.length === 1 ? "idea" : "ideas"}
                </p>
            </div>
            <div className="mt-4 pt-4 border-t border-earth-700 flex justify-between items-center text-sm">
                <span className="text-stone-500">{vitality.label}</span>
                <button
                    onClick={handleDeleteClick}
                    className="text-stone-600 hover:text-red-400 font-medium text-xs opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
