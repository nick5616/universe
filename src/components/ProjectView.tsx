// src/components/ProjectView.tsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Idea, Project, Domain, Task } from "../lib/mockData";
import { dataService } from "../services/dataService";

// --- Reusable Editable Text Component ---
// A self-contained component for handling the logic of inline editing.
interface EditableTextProps {
    text: string;
    onSave: (newText: string) => void;
    className: string;
    as?: "input" | "textarea";
}

const EditableText: React.FC<EditableTextProps> = ({
    text,
    onSave,
    className,
    as = "input",
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);

    const handleSave = () => {
        // Only save if the text has actually changed
        if (editText.trim() && editText.trim() !== text) {
            onSave(editText.trim());
        }
        setIsEditing(false);
    };

    if (isEditing) {
        const commonProps = {
            value: editText,
            onChange: (
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setEditText(e.target.value),
            onBlur: handleSave,
            onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" && as !== "textarea") handleSave(); // Save on Enter for single-line inputs
                if (e.key === "Escape") setIsEditing(false); // Cancel on Escape
            },
            autoFocus: true,
            className: `${className} bg-gray-600 rounded p-1 outline-none ring-2 ring-cyan-500`,
        };
        return as === "textarea" ? (
            <textarea {...commonProps} rows={3} />
        ) : (
            <input {...commonProps} type="text" />
        );
    }

    // The onClick handler makes the text clickable to enter edit mode.
    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`${className} cursor-pointer`}
        >
            {text}
        </div>
    );
};

// --- Sub-Components for Project View ---

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

interface IdeaCardProps {
    idea: Idea;
    onUpdateIdea: (updatedIdea: Idea) => void;
    onDeleteIdea: (ideaId: number) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
    idea,
    onUpdateIdea,
    onDeleteIdea,
}) => {
    const [newTaskName, setNewTaskName] = useState("");

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskName.trim()) return;
        const newTask: Task = {
            id: Date.now(),
            name: newTaskName.trim(),
            is_completed: false,
        };
        onUpdateIdea({ ...idea, tasks: [...idea.tasks, newTask] });
        setNewTaskName("");
    };

    const handleToggleTask = (taskId: number) => {
        const updatedTasks = idea.tasks.map((t) =>
            t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
        );
        onUpdateIdea({ ...idea, tasks: updatedTasks });
    };

    const handleDeleteTask = (taskId: number) => {
        const updatedTasks = idea.tasks.filter((t) => t.id !== taskId);
        onUpdateIdea({ ...idea, tasks: updatedTasks });
    };

    const handleUpdateIdeaName = (newName: string) => {
        onUpdateIdea({ ...idea, name: newName });
    };

    return (
        <div className="bg-stone-800 p-4 rounded-lg flex flex-col group">
            <div className="flex justify-between items-center mb-2">
                <EditableText
                    text={idea.name}
                    onSave={handleUpdateIdeaName}
                    className="font-bold text-gray-200 w-full"
                />
                <button
                    onClick={() => onDeleteIdea(idea.id)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition text-xs ml-2 flex-shrink-0"
                >
                    DELETE
                </button>
            </div>
            <ul className="mt-2 space-y-1 flex-grow">
                {idea.tasks.map((task) => (
                    <li
                        key={task.id}
                        className="flex items-center space-x-2 text-sm text-gray-400 group/task"
                    >
                        <input
                            type="checkbox"
                            checked={task.is_completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="form-checkbox h-4 w-4 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                        />
                        <span
                            className={task.is_completed ? "line-through" : ""}
                        >
                            {task.name}
                        </span>
                        <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 opacity-0 group-hover/task:opacity-100 transition text-xs ml-auto"
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleAddTask} className="mt-4">
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

// --- Main Project View Component ---

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
    const [newIdeaName, setNewIdeaName] = useState("");

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

    const handleUpdateIdea = (updatedIdea: Idea) => {
        const updatedIdeas = project.ideas.map((i) =>
            i.id === updatedIdea.id ? updatedIdea : i
        );
        onUpdateProject({ ...project, ideas: updatedIdeas });
    };

    const handleDeleteIdea = (ideaId: number) => {
        if (window.confirm("Are you sure you want to delete this idea?")) {
            const updatedIdeas = project.ideas.filter((i) => i.id !== ideaId);
            onUpdateProject({ ...project, ideas: updatedIdeas });
        }
    };

    const [domains, setDomains] = useState<Domain[]>([]);
    useEffect(() => {
        dataService.getDomains().then((domains: Domain[]) => {
            setDomains(domains);
        });
    }, []);

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
                        <EditableText
                            text={project.name}
                            onSave={(name) =>
                                onUpdateProject({ ...project, name })
                            }
                            className="text-3xl font-bold w-full"
                        />
                        <select
                            value={project.domain}
                            onChange={(e) =>
                                onUpdateProject({
                                    ...project,
                                    domain: e.target.value as Domain,
                                })
                            }
                            className="bg-gray-700 text-cyan-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg focus:ring-1 focus:ring-cyan-500 outline-none ml-4 flex-shrink-0"
                        >
                            {domains.map((domain) => (
                                <option key={domain} value={domain}>
                                    {domain}
                                </option>
                            ))}
                        </select>
                    </div>
                    <EditableText
                        text={project.description}
                        onSave={(description) =>
                            onUpdateProject({ ...project, description })
                        }
                        as="textarea"
                        className="text-gray-400 mb-6 w-full min-h-[4rem] bg-gray-700/50 rounded-lg p-2"
                    />
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
                                    onUpdateIdea={handleUpdateIdea}
                                    onDeleteIdea={handleDeleteIdea}
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
