import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Idea, Project, Domain, Task } from "../lib/mockData";

// --- Reusable Editable Text Component ---
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
                if (e.key === "Enter" && as !== "textarea") handleSave();
                if (e.key === "Escape") setIsEditing(false);
            },
            autoFocus: true,
            className: `${className} bg-earth-700 rounded-lg p-2 outline-none ring-2 ring-passion-500`,
        };
        return as === "textarea" ? (
            <textarea {...commonProps} rows={3} />
        ) : (
            <input {...commonProps} type="text" />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`${className} cursor-pointer hover:bg-earth-700/50 rounded-lg p-1 -m-1 transition-colors`}
        >
            {text || (
                <span className="text-stone-500 italic">Click to add...</span>
            )}
        </div>
    );
};

// --- Empty Ideas State ---
const EmptyIdeasState = () => (
    <div className="text-center py-12 border-2 border-dashed border-earth-700 rounded-xl bg-earth-800/30">
        <div className="text-4xl mb-3">🌱</div>
        <h3 className="text-lg font-semibold font-serif text-stone-300">
            This project is a blank canvas.
        </h3>
        <p className="text-stone-500 mt-1">
            Add your first idea below to get started!
        </p>
    </div>
);

// --- Idea Card Component ---
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

    const completedCount = idea.tasks.filter((t) => t.is_completed).length;

    return (
        <div className="bg-earth-900/50 p-5 rounded-xl border border-earth-700 flex flex-col group hover:border-earth-600 transition-colors">
            <div className="flex justify-between items-start gap-2 mb-3">
                <EditableText
                    text={idea.name}
                    onSave={handleUpdateIdeaName}
                    className="font-bold font-serif text-stone-100 text-lg w-full"
                />
                <button
                    onClick={() => onDeleteIdea(idea.id)}
                    className="text-stone-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                >
                    Remove
                </button>
            </div>

            {idea.tasks.length > 0 && (
                <p className="text-xs text-stone-500 mb-2">
                    {completedCount}/{idea.tasks.length} steps complete
                </p>
            )}

            <ul className="space-y-2 flex-grow">
                {idea.tasks.map((task) => (
                    <li
                        key={task.id}
                        className="flex items-center space-x-3 text-sm group/task"
                    >
                        <input
                            type="checkbox"
                            checked={task.is_completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="h-4 w-4 rounded bg-earth-700 border-earth-600 text-growth-500 focus:ring-growth-500 focus:ring-offset-0 cursor-pointer transition-colors"
                        />
                        <span
                            className={`flex-grow ${
                                task.is_completed
                                    ? "line-through text-stone-500"
                                    : "text-stone-300"
                            }`}
                        >
                            {task.name}
                        </span>
                        <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-stone-600 hover:text-red-400 text-xs opacity-0 group-hover/task:opacity-100 transition-all"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleAddTask} className="mt-4">
                <input
                    type="text"
                    placeholder="+ Add a step"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="bg-earth-800 w-full text-sm p-2.5 rounded-lg placeholder-stone-600 text-stone-200 focus:ring-2 focus:ring-passion-500 outline-none transition-all border border-earth-700 focus:border-transparent"
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
                `Let this project go? It will be permanently removed.`
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
        if (window.confirm("Let this idea go?")) {
            const updatedIdeas = project.ideas.filter((i) => i.id !== ideaId);
            onUpdateProject({ ...project, ideas: updatedIdeas });
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onBack}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
            <div
                className="relative bg-earth-800 rounded-2xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-zoom-in flex flex-col border border-earth-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 mb-6">
                    <button
                        onClick={onBack}
                        className="mb-4 text-passion-400 hover:text-passion-300 transition-colors font-medium"
                    >
                        ← Back to Garden
                    </button>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <EditableText
                            text={project.name}
                            onSave={(name) =>
                                onUpdateProject({ ...project, name })
                            }
                            className="text-3xl md:text-4xl font-bold font-serif text-stone-100 w-full"
                        />
                        <select
                            value={project.domain}
                            onChange={(e) =>
                                onUpdateProject({
                                    ...project,
                                    domain: e.target.value as Domain,
                                })
                            }
                            className="bg-earth-700 text-passion-400 text-sm font-semibold px-3 py-2 rounded-lg focus:ring-2 focus:ring-passion-500 outline-none border border-earth-600 flex-shrink-0"
                        >
                            <option>Art</option>
                            <option>Code</option>
                            <option>Music</option>
                            <option>Content Creation</option>
                        </select>
                    </div>
                    <EditableText
                        text={project.description}
                        onSave={(description) =>
                            onUpdateProject({ ...project, description })
                        }
                        as="textarea"
                        className="text-stone-400 w-full"
                    />
                </div>

                {/* Ideas Section */}
                <div className="flex-grow overflow-y-auto">
                    <h3 className="text-xl font-semibold font-serif mb-4 text-stone-200">
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

                    {/* Add Idea Form */}
                    <form
                        onSubmit={handleAddIdea}
                        className="mt-6 p-4 bg-earth-900/50 rounded-xl border border-earth-700"
                    >
                        <input
                            type="text"
                            placeholder="+ Add a new idea"
                            value={newIdeaName}
                            onChange={(e) => setNewIdeaName(e.target.value)}
                            className="bg-earth-800 w-full p-3 rounded-lg placeholder-stone-500 text-stone-200 focus:ring-2 focus:ring-passion-500 outline-none transition-all border border-earth-700 focus:border-transparent"
                        />
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-earth-700 flex-shrink-0">
                    <button
                        onClick={handleDeleteProject}
                        className="text-stone-500 hover:text-red-400 text-sm font-medium transition-colors"
                    >
                        Remove from Garden
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ProjectView;
