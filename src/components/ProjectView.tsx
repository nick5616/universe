// src/components/ProjectView.tsx
import React from "react";
import { Project, Idea, Task } from "../lib/mockData";

interface ProjectViewProps {
    project: Project;
    onBack: () => void;
}

const TaskItem: React.FC<{ task: Task }> = ({ task }) => (
    <li className="flex items-center space-x-2 text-sm text-gray-400">
        <input
            type="checkbox"
            checked={task.is_completed}
            readOnly
            className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"
        />
        <span className={task.is_completed ? "line-through" : ""}>
            {task.name}
        </span>
    </li>
);

const IdeaCard: React.FC<{ idea: Idea }> = ({ idea }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg">
        <h4 className="font-bold text-gray-200">{idea.name}</h4>
        {idea.tasks.length > 0 && (
            <ul className="mt-2 space-y-1">
                {idea.tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </ul>
        )}
    </div>
);

const ProjectView: React.FC<ProjectViewProps> = ({ project, onBack }) => {
    return (
        <div className="animate-fade-in">
            <button
                onClick={onBack}
                className="mb-4 text-cyan-400 hover:text-cyan-300 transition"
            >
                &larr; Back to Universe
            </button>
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold">{project.name}</h2>
                    <span className="bg-gray-700 text-cyan-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {project.domain}
                    </span>
                </div>
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">
                        Ideas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.ideas.map((idea) => (
                            <IdeaCard key={idea.id} idea={idea} />
                        ))}
                    </div>
                    {project.ideas.length === 0 && (
                        <p className="text-gray-500">
                            No ideas for this project yet. Add one!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectView;
