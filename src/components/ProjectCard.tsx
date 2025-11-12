// src/components/ProjectCard.tsx
import React from "react";
import { Project } from "../lib/mockData";

// Utility function to calculate "time ago"
const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
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
            className="group bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between"
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
                <span>Touched: {timeAgo(project.last_touched_at)}</span>
                <button
                    onClick={handleDeleteClick}
                    className="text-red-500 hover:text-red-400 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    DELETE
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
