// src/components/ProjectCard.tsx
import React from "react";
import { Project } from "../lib/mockData";

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    const timeAgo = (date: string) => {
        const seconds = Math.floor(
            (new Date().getTime() - new Date(date).getTime()) / 1000
        );
        let interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        return "today";
    };

    return (
        <div
            className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.03] transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold">{project.name}</h3>
                <span className="bg-gray-700 text-cyan-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {project.domain}
                </span>
            </div>
            <p className="text-gray-400 mt-2">{project.ideas.length} ideas</p>
            <div className="mt-4 text-sm text-gray-500">
                <span>Last touched: {timeAgo(project.last_touched_at)}</span>
            </div>
        </div>
    );
};

export default ProjectCard;
