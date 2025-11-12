// src/components/ProjectView.tsx
import React from "react";
import { createPortal } from "react-dom";
import { Idea, Project, Domain, Task } from "../lib/mockData";

// --- Sub-Components ---

const EmptyIdeasState = () => (
    <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-400">
            This project is a blank canvas.
        </h3>
        <p className="text-gray-500 mt-1">
            Add your first idea below to get started!
        </p>
    </div>
);

interface TaskItemProps {
    task: Task;
    onToggle: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => (
    <li className="flex items-center space-x-2 text-sm text-gray-400">
        <input
            type="checkbox"
            checked={task.is_completed}
            onChange={onToggle} // CHANGED: Now interactive
            className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
        />
        <span className={task.is_completed ? "line-through" : ""}>
            {task.name}
        </span>
    </li>
);

interface IdeaCardProps {
    idea: Idea;
    onAddTask: (ideaId: number, taskName: string) => void;
    onToggleTask: (ideaId: number, taskId: number) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
    idea,
    onAddTask,
    onToggleTask,
}) => {
    const [newTaskName, setNewTaskName] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskName.trim()) {
            onAddTask(idea.id, newTaskName.trim());
            setNewTaskName("");
        }
    };

    return (
        <div className="bg-stone-800 p-4 rounded-lg flex flex-col">
            <h4 className="font-bold text-gray-200">{idea.name}</h4>
            <ul className="mt-2 space-y-1 flex-grow">
                {idea.tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => onToggleTask(idea.id, task.id)}
                    />
                ))}
            </ul>
            <form onSubmit={handleSubmit} className="mt-4">
                <input
                    type="text"
                    placeholder="+ Add a task"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="bg-gray-700/50 w-full text-xs p-2 rounded placeholder-gray-500 focus:bg-gray-700 focus:ring-1 focus:ring-cyan-500 outline-none transition"
                />
            </form>
        </div>
    );
};

// --- Main Component ---

interface ProjectViewProps {
    project: Project;
    onBack: () => void;
    onUpdateProject: (updatedProject: Project) => void;
    onDeleteProject: (projectId: number) => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({
    project,
    onBack,
    onUpdateProject,
    onDeleteProject,
}) => {
    const [newIdeaName, setNewIdeaName] = React.useState("");

    const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDomain = e.target.value as Domain;
        onUpdateProject({ ...project, domain: newDomain });
    };

    const handleDeleteProject = () => {
        if (
            window.confirm(
                `Are you sure you want to permanently delete the "${project.name}" project? This cannot be undone.`
            )
        ) {
            onDeleteProject(project.id);
        }
    };

    const handleAddIdea = (e: React.FormEvent) => {
        e.preventDefault();
        if (newIdeaName.trim() === "") return;
        const newIdea: Idea = {
            id: Date.now(),
            name: newIdeaName.trim(),
            tasks: [],
        };
        onUpdateProject({ ...project, ideas: [...project.ideas, newIdea] });
        setNewIdeaName("");
    };

    // FILLED IN: Logic for adding a task to a specific idea
    const handleAddTask = (ideaId: number, taskName: string) => {
        const newTask: Task = {
            id: Date.now(),
            name: taskName,
            is_completed: false,
        };
        const updatedIdeas = project.ideas.map((idea) =>
            idea.id === ideaId
                ? { ...idea, tasks: [...idea.tasks, newTask] }
                : idea
        );
        onUpdateProject({ ...project, ideas: updatedIdeas });
    };

    // FILLED IN: Logic for toggling a task's completion status
    const handleToggleTask = (ideaId: number, taskId: number) => {
        const updatedIdeas = project.ideas.map((idea) => {
            if (idea.id !== ideaId) return idea;
            const updatedTasks = idea.tasks.map((task) =>
                task.id === taskId
                    ? { ...task, is_completed: !task.is_completed }
                    : task
            );
            return { ...idea, tasks: updatedTasks };
        });
        onUpdateProject({ ...project, ideas: updatedIdeas });
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onBack}
        >
            <div className="absolute inset-0 bg-black opacity-70" />
            <div
                className="relative bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-shrink-0">
                    <button
                        onClick={onBack}
                        className="mb-4 text-cyan-400 hover:text-cyan-300 transition"
                    >
                        &larr; Back to Universe
                    </button>
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-3xl font-bold">{project.name}</h2>
                        <select
                            value={project.domain}
                            onChange={handleDomainChange}
                            className="bg-gray-700 text-cyan-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg focus:ring-1 focus:ring-cyan-500 outline-none"
                        >
                            <option>Art</option>
                            <option>Code</option>
                            <option>Music</option>
                            <option>Content Creation</option>
                        </select>
                    </div>
                    <p className="text-gray-400 mb-6">{project.description}</p>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">
                        Ideas
                    </h3>
                    {project.ideas.length === 0 ? (
                        <EmptyIdeasState />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {project.ideas.map((idea) => (
                                <IdeaCard
                                    key={idea.id}
                                    idea={idea}
                                    onAddTask={handleAddTask}
                                    onToggleTask={handleToggleTask}
                                />
                            ))}
                        </div>
                    )}
                    <form
                        onSubmit={handleAddIdea}
                        className="mt-6 p-4 bg-gray-900/50 rounded-lg"
                    >
                        <input
                            type="text"
                            placeholder="+ Add a new idea"
                            value={newIdeaName}
                            onChange={(e) => setNewIdeaName(e.target.value)}
                            className="bg-gray-700 w-full p-2 rounded placeholder-gray-400 focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                    </form>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700 flex-shrink-0">
                    <button
                        onClick={handleDeleteProject}
                        className="text-red-500 hover:text-red-400 text-sm font-semibold"
                    >
                        Delete this Project
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectView;
