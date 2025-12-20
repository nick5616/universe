// src/components/FocusSelectionModal.tsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Project } from "../lib/mockData";

interface FocusSelectionModalProps {
    projects: Project[];
    initialSelectedIds: number[];
    onClose: () => void;
    onSave: (selectedIds: number[]) => void;
}

const FocusSelectionModal: React.FC<FocusSelectionModalProps> = ({
    projects,
    initialSelectedIds,
    onClose,
    onSave,
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(
        new Set(initialSelectedIds)
    );
    const [expandedProjects, setExpandedProjects] = useState<Set<number>>(
        new Set()
    );

    // Expand all projects that have selected ideas on mount
    useEffect(() => {
        const projectsWithSelectedIdeas = new Set<number>();
        projects.forEach((project) => {
            project.ideas.forEach((idea) => {
                if (initialSelectedIds.includes(idea.id)) {
                    projectsWithSelectedIdeas.add(project.id);
                }
            });
        });
        setExpandedProjects(projectsWithSelectedIdeas);
    }, [projects, initialSelectedIds]);

    const toggleIdea = (ideaId: number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(ideaId)) {
            newSelected.delete(ideaId);
        } else {
            newSelected.add(ideaId);
        }
        setSelectedIds(newSelected);
    };

    const toggleProject = (projectId: number) => {
        const newExpanded = new Set(expandedProjects);
        if (newExpanded.has(projectId)) {
            newExpanded.delete(projectId);
        } else {
            newExpanded.add(projectId);
        }
        setExpandedProjects(newExpanded);
    };

    const selectAllInProject = (project: Project) => {
        const newSelected = new Set(selectedIds);
        project.ideas.forEach((idea) => newSelected.add(idea.id));
        setSelectedIds(newSelected);
    };

    const deselectAllInProject = (project: Project) => {
        const newSelected = new Set(selectedIds);
        project.ideas.forEach((idea) => newSelected.delete(idea.id));
        setSelectedIds(newSelected);
    };

    const handleSave = () => {
        onSave(Array.from(selectedIds));
    };

    const growingProjects = projects.filter((p) => {
        const isGrowing =
            p.status === "Growing" || p.status === "Dormant" || !p.status;
        return isGrowing && p.ideas.length > 0;
    });

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
            <div
                className="relative bg-earth-800 rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-earth-700 animate-zoom-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 mb-6">
                    <h2 className="text-3xl font-bold font-serif text-stone-100">
                        Curate Your Focus
                    </h2>
                    <p className="text-stone-400 mt-2">
                        Select the ideas you want to nurture right now.
                    </p>
                </div>

                {/* Selection Count */}
                <div className="flex-shrink-0 mb-4 px-4 py-3 bg-earth-900/50 rounded-xl border border-earth-700">
                    <span className="text-growth-400 font-semibold">
                        {selectedIds.size}
                    </span>
                    <span className="text-stone-400">
                        {" "}
                        {selectedIds.size === 1 ? "idea" : "ideas"} selected
                    </span>
                </div>

                {/* Project List */}
                <div className="flex-grow overflow-y-auto space-y-3 pr-2">
                    {growingProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-3">🌱</div>
                            <p className="text-stone-400">
                                No growing projects with ideas yet.
                            </p>
                            <p className="text-stone-500 text-sm mt-1">
                                Plant some seeds first!
                            </p>
                        </div>
                    ) : (
                        growingProjects.map((project) => {
                            const isExpanded = expandedProjects.has(project.id);
                            const selectedInProject = project.ideas.filter(
                                (i) => selectedIds.has(i.id)
                            ).length;
                            const allSelected =
                                selectedInProject === project.ideas.length;

                            return (
                                <div
                                    key={project.id}
                                    className="bg-earth-900/50 rounded-xl border border-earth-700 overflow-hidden"
                                >
                                    {/* Project Header */}
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-earth-700/30 transition-colors"
                                        onClick={() =>
                                            toggleProject(project.id)
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`transition-transform ${
                                                    isExpanded
                                                        ? "rotate-90"
                                                        : ""
                                                }`}
                                            >
                                                ▶
                                            </span>
                                            <div>
                                                <h3 className="font-semibold font-serif text-stone-100">
                                                    {project.name}
                                                </h3>
                                                <p className="text-xs text-stone-500">
                                                    {selectedInProject}/
                                                    {project.ideas.length} ideas
                                                    selected
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                allSelected
                                                    ? deselectAllInProject(
                                                          project
                                                      )
                                                    : selectAllInProject(
                                                          project
                                                      );
                                            }}
                                            className="text-xs font-medium text-passion-400 hover:text-passion-300 transition-colors"
                                        >
                                            {allSelected
                                                ? "Deselect All"
                                                : "Select All"}
                                        </button>
                                    </div>

                                    {/* Ideas List */}
                                    {isExpanded && (
                                        <div className="border-t border-earth-700 px-4 py-3 space-y-2">
                                            {project.ideas.map((idea) => {
                                                const isSelected =
                                                    selectedIds.has(idea.id);
                                                const completedTasks =
                                                    idea.tasks.filter(
                                                        (t) => t.is_completed
                                                    ).length;

                                                return (
                                                    <div
                                                        key={idea.id}
                                                        onClick={() =>
                                                            toggleIdea(idea.id)
                                                        }
                                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                                            isSelected
                                                                ? "bg-growth-500/20 border border-growth-500/50"
                                                                : "bg-earth-800/50 border border-transparent hover:border-earth-600"
                                                        }`}
                                                    >
                                                        <div
                                                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                                isSelected
                                                                    ? "bg-growth-500 border-growth-500"
                                                                    : "border-earth-600"
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <span className="text-white text-xs">
                                                                    ✓
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex-grow">
                                                            <p className="text-stone-200 font-medium">
                                                                {idea.name}
                                                            </p>
                                                            <p className="text-xs text-stone-500">
                                                                {idea.tasks
                                                                    .length ===
                                                                0
                                                                    ? "No steps yet"
                                                                    : `${completedTasks}/${idea.tasks.length} steps complete`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 mt-6 pt-4 border-t border-earth-700 flex justify-between items-center">
                    <button
                        onClick={() => setSelectedIds(new Set())}
                        className="text-stone-500 hover:text-stone-300 text-sm font-medium transition-colors"
                    >
                        Clear Selection
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 bg-earth-700 rounded-lg text-sm font-semibold text-stone-300 hover:bg-earth-600 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2.5 bg-gradient-to-r from-growth-500 to-growth-600 rounded-lg text-sm font-bold text-white hover:from-growth-400 hover:to-growth-500 transition-all shadow-lg disabled:opacity-50"
                            disabled={selectedIds.size === 0}
                        >
                            Enter Focus Grove
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default FocusSelectionModal;
