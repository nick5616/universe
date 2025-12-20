// src/components/FocusGroveView.tsx
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Project, Idea, Task } from "../lib/mockData";

interface FocusGroveViewProps {
    projects: Project[];
    focusedIdeaIds: number[];
    onClose: () => void;
    onUpdateProject: (updatedProject: Project) => void;
    onChangeSelection: () => void;
    onClearGrove: () => void;
}

interface FocusedIdeaCardProps {
    idea: Idea;
    projectName: string;
    onUpdateIdea: (updatedIdea: Idea) => void;
}

const FocusedIdeaCard: React.FC<FocusedIdeaCardProps> = ({
    idea,
    projectName,
    onUpdateIdea,
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

    const completedCount = idea.tasks.filter((t) => t.is_completed).length;
    const progress =
        idea.tasks.length > 0 ? (completedCount / idea.tasks.length) * 100 : 0;

    return (
        <div className="bg-earth-800 rounded-xl border border-earth-700 overflow-hidden">
            {/* Progress Bar */}
            <div className="h-1 bg-earth-700">
                <div
                    className="h-full bg-gradient-to-r from-growth-500 to-growth-400 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="p-5">
                {/* Header */}
                <div className="mb-4">
                    <p className="text-xs text-passion-400 font-medium mb-1">
                        {projectName}
                    </p>
                    <h3 className="text-xl font-bold font-serif text-stone-100">
                        {idea.name}
                    </h3>
                    {idea.tasks.length > 0 && (
                        <p className="text-sm text-stone-500 mt-1">
                            {completedCount}/{idea.tasks.length} steps complete
                        </p>
                    )}
                </div>

                {/* Tasks */}
                <ul className="space-y-2">
                    {idea.tasks.map((task) => (
                        <li
                            key={task.id}
                            onClick={() => handleToggleTask(task.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                task.is_completed
                                    ? "bg-growth-500/10 border border-growth-500/30"
                                    : "bg-earth-900/50 border border-earth-700 hover:border-earth-600"
                            }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    task.is_completed
                                        ? "bg-growth-500 border-growth-500"
                                        : "border-earth-500"
                                }`}
                            >
                                {task.is_completed && (
                                    <span className="text-white text-xs">
                                        ✓
                                    </span>
                                )}
                            </div>
                            <span
                                className={`flex-grow ${
                                    task.is_completed
                                        ? "text-stone-500 line-through"
                                        : "text-stone-200"
                                }`}
                            >
                                {task.name}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="mt-4">
                    <input
                        type="text"
                        placeholder="+ Add a step"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        className="bg-earth-900 w-full text-sm p-3 rounded-lg placeholder-stone-600 text-stone-200 focus:ring-2 focus:ring-passion-500 outline-none transition-all border border-earth-700 focus:border-transparent"
                    />
                </form>
            </div>
        </div>
    );
};

const FocusGroveView: React.FC<FocusGroveViewProps> = ({
    projects,
    focusedIdeaIds,
    onClose,
    onUpdateProject,
    onChangeSelection,
    onClearGrove,
}) => {
    // Build a structure of projects containing only focused ideas
    const focusedData = projects
        .map((project) => {
            const focusedIdeas = project.ideas.filter((idea) =>
                focusedIdeaIds.includes(idea.id)
            );
            return { project, ideas: focusedIdeas };
        })
        .filter((item) => item.ideas.length > 0);

    const totalIdeas = focusedIdeaIds.length;
    const totalTasks = focusedData.reduce(
        (acc, { ideas }) => acc + ideas.reduce((a, i) => a + i.tasks.length, 0),
        0
    );
    const completedTasks = focusedData.reduce(
        (acc, { ideas }) =>
            acc +
            ideas.reduce(
                (a, i) => a + i.tasks.filter((t) => t.is_completed).length,
                0
            ),
        0
    );

    const handleUpdateIdea = (projectId: number, updatedIdea: Idea) => {
        const project = projects.find((p) => p.id === projectId);
        if (!project) return;

        const updatedIdeas = project.ideas.map((i) =>
            i.id === updatedIdea.id ? updatedIdea : i
        );
        onUpdateProject({ ...project, ideas: updatedIdeas });
    };

    return createPortal(
        <div className="fixed inset-0 z-50 bg-earth-900 overflow-hidden flex flex-col animate-fade-in">
            {/* Header */}
            <header className="flex-shrink-0 px-6 py-4 bg-earth-800 border-b border-earth-700">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold font-serif bg-gradient-to-r from-growth-400 to-passion-400 bg-clip-text text-transparent">
                            🌿 Focus Grove
                        </h1>
                        <p className="text-stone-400 text-sm mt-1">
                            {totalIdeas} {totalIdeas === 1 ? "idea" : "ideas"} •{" "}
                            {completedTasks}/{totalTasks} steps complete
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onChangeSelection}
                            className="px-4 py-2 bg-earth-700 rounded-lg text-sm font-medium text-stone-300 hover:bg-earth-600 transition-all"
                        >
                            Add or Change
                        </button>
                        <button
                            onClick={onClearGrove}
                            className="px-4 py-2 bg-earth-700 rounded-lg text-sm font-medium text-stone-300 hover:bg-earth-600 transition-all"
                        >
                            Clear Grove
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gradient-to-r from-passion-500 to-passion-600 rounded-lg text-sm font-bold text-white hover:from-passion-400 hover:to-passion-500 transition-all"
                        >
                            Exit
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto p-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    {focusedData.map(({ project, ideas }) => (
                        <section key={project.id}>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-xl font-bold font-serif text-stone-200">
                                    {project.name}
                                </h2>
                                <span className="bg-passion-500/20 text-passion-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    {project.domain}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {ideas.map((idea) => (
                                    <FocusedIdeaCard
                                        key={idea.id}
                                        idea={idea}
                                        projectName={project.name}
                                        onUpdateIdea={(updatedIdea) =>
                                            handleUpdateIdea(
                                                project.id,
                                                updatedIdea
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </section>
                    ))}

                    {focusedData.length === 0 && (
                        <div className="text-center py-16">
                            <div className="text-5xl mb-4">🌱</div>
                            <h3 className="text-xl font-semibold font-serif text-stone-300">
                                Your Focus Grove is empty
                            </h3>
                            <p className="text-stone-500 mt-2">
                                Select some ideas to focus on.
                            </p>
                            <button
                                onClick={onChangeSelection}
                                className="mt-6 px-6 py-3 bg-gradient-to-r from-growth-500 to-growth-600 rounded-lg font-bold text-white hover:from-growth-400 hover:to-growth-500 transition-all"
                            >
                                Curate Your Focus
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Overall Progress Footer */}
            {totalTasks > 0 && (
                <footer className="flex-shrink-0 px-6 py-3 bg-earth-800 border-t border-earth-700">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-stone-400">
                                Overall Progress
                            </span>
                            <span className="text-sm font-semibold text-growth-400">
                                {Math.round(
                                    (completedTasks / totalTasks) * 100
                                )}
                                %
                            </span>
                        </div>
                        <div className="h-2 bg-earth-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-growth-500 to-growth-400 transition-all duration-500 rounded-full"
                                style={{
                                    width: `${
                                        (completedTasks / totalTasks) * 100
                                    }%`,
                                }}
                            />
                        </div>
                    </div>
                </footer>
            )}
        </div>,
        document.body
    );
};

export default FocusGroveView;
