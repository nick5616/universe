import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ClassificationResult, Note } from "../types";
import { Project } from "../lib/mockData";

interface ClassificationReviewModalProps {
    classifications: ClassificationResult[];
    notes: Note[];
    existingProjects: Project[];
    onClose: () => void;
    onCommit: (selectedClassifications: ClassificationResult[]) => void;
}

const ClassificationReviewModal: React.FC<ClassificationReviewModalProps> = ({
    classifications,
    notes,
    existingProjects: _existingProjects, // Reserved for future use
    onClose,
    onCommit,
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        new Set(classifications.map((c) => c.noteId))
    );
    const [edits, setEdits] = useState<
        Map<string, Partial<ClassificationResult>>
    >(new Map());

    const handleToggleClassification = (noteId: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(noteId)) {
            newSelected.delete(noteId);
        } else {
            newSelected.add(noteId);
        }
        setSelectedIds(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === classifications.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(classifications.map((c) => c.noteId)));
        }
    };

    const handleEdit = (noteId: string, field: string, value: any) => {
        const newEdits = new Map(edits);
        const existing = newEdits.get(noteId) || {};
        const original = classifications.find((c) => c.noteId === noteId);

        if (field.includes(".")) {
            const [parent, child] = field.split(".");
            // Merge with original to preserve other fields
            const originalParent = original?.[
                parent as keyof ClassificationResult
            ] as any;
            const existingParent = existing[
                parent as keyof ClassificationResult
            ] as any;

            newEdits.set(noteId, {
                ...existing,
                [parent]: {
                    ...originalParent,
                    ...existingParent,
                    [child]: value,
                },
            });
        } else {
            newEdits.set(noteId, {
                ...existing,
                [field]: value,
            });
        }
        setEdits(newEdits);
    };

    const getClassification = (noteId: string): ClassificationResult => {
        const original = classifications.find((c) => c.noteId === noteId);
        if (!original)
            throw new Error(`Classification not found for note ${noteId}`);
        const edit = edits.get(noteId);
        return { ...original, ...edit };
    };

    const getNote = (noteId: string): Note | undefined => {
        return notes.find((n) => n.id === noteId);
    };

    const handleCommit = () => {
        const selected = classifications
            .filter((c) => selectedIds.has(c.noteId))
            .map((c) => getClassification(c.noteId));
        onCommit(selected);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
            <div
                className="relative bg-earth-800 rounded-2xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-zoom-in flex flex-col border border-earth-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex-shrink-0 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-100 mb-2">
                        Review Classifications
                    </h2>
                    <p className="text-stone-400 text-sm">
                        Review and edit the LLM's classifications. Select which
                        ones to add to your hierarchy.
                    </p>
                </div>

                {/* Classifications List */}
                <div className="flex-grow overflow-y-auto mb-6">
                    {classifications.length === 0 ? (
                        <div className="text-center py-12 text-stone-500">
                            <p>No classifications to review.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Select All */}
                            <div className="flex items-center gap-3 pb-3 border-b border-earth-700">
                                <input
                                    type="checkbox"
                                    checked={
                                        selectedIds.size ===
                                            classifications.length &&
                                        classifications.length > 0
                                    }
                                    onChange={handleSelectAll}
                                    className="h-5 w-5 rounded bg-earth-700 border-earth-600 text-growth-500 focus:ring-growth-500 cursor-pointer"
                                />
                                <label className="text-stone-300 font-medium cursor-pointer">
                                    Select All ({classifications.length}{" "}
                                    classifications)
                                </label>
                            </div>

                            {/* Classifications */}
                            {classifications.map((classification) => {
                                const note = getNote(classification.noteId);
                                const edited = getClassification(
                                    classification.noteId
                                );
                                const isSelected = selectedIds.has(
                                    classification.noteId
                                );

                                return (
                                    <div
                                        key={classification.noteId}
                                        className={`p-5 rounded-lg border transition-all ${
                                            isSelected
                                                ? "bg-growth-500/10 border-growth-500/50"
                                                : "bg-earth-900/50 border-earth-700"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 mb-4">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    handleToggleClassification(
                                                        classification.noteId
                                                    )
                                                }
                                                className="h-5 w-5 rounded bg-earth-700 border-earth-600 text-growth-500 focus:ring-growth-500 cursor-pointer mt-0.5 flex-shrink-0"
                                            />
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-semibold text-stone-200 mb-1">
                                                    {note?.title || "Untitled"}
                                                </h3>
                                                <p className="text-stone-400 text-sm mb-3 line-clamp-2">
                                                    {note?.content}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Classification Fields */}
                                        <div className="ml-8 space-y-3">
                                            {/* Domain */}
                                            <div>
                                                <label className="text-xs text-stone-500 mb-1 block">
                                                    Domain
                                                </label>
                                                <input
                                                    type="text"
                                                    value={edited.domain}
                                                    onChange={(e) =>
                                                        handleEdit(
                                                            classification.noteId,
                                                            "domain",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full bg-earth-800 text-stone-200 text-sm p-2 rounded border border-earth-700 focus:ring-2 focus:ring-growth-500 outline-none"
                                                />
                                                {edited.shouldCreateDomain && (
                                                    <span className="text-xs text-growth-400 mt-1 block">
                                                        ✨ New domain will be
                                                        created
                                                    </span>
                                                )}
                                            </div>

                                            {/* Project */}
                                            {edited.project && (
                                                <div>
                                                    <label className="text-xs text-stone-500 mb-1 block">
                                                        Project
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            edited.project.name
                                                        }
                                                        onChange={(e) =>
                                                            handleEdit(
                                                                classification.noteId,
                                                                "project.name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-earth-800 text-stone-200 text-sm p-2 rounded border border-earth-700 focus:ring-2 focus:ring-growth-500 outline-none"
                                                    />
                                                    {edited.project
                                                        .matchExisting && (
                                                        <span className="text-xs text-stone-500 mt-1 block">
                                                            Matches existing
                                                            project ID:{" "}
                                                            {
                                                                edited.project
                                                                    .matchExisting
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Idea */}
                                            {edited.idea && (
                                                <div>
                                                    <label className="text-xs text-stone-500 mb-1 block">
                                                        Idea
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={edited.idea.name}
                                                        onChange={(e) =>
                                                            handleEdit(
                                                                classification.noteId,
                                                                "idea.name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-earth-800 text-stone-200 text-sm p-2 rounded border border-earth-700 focus:ring-2 focus:ring-growth-500 outline-none"
                                                    />
                                                </div>
                                            )}

                                            {/* Tasks */}
                                            {edited.tasks &&
                                                edited.tasks.length > 0 && (
                                                    <div>
                                                        <label className="text-xs text-stone-500 mb-1 block">
                                                            Tasks (
                                                            {
                                                                edited.tasks
                                                                    .length
                                                            }
                                                            )
                                                        </label>
                                                        <ul className="space-y-1">
                                                            {edited.tasks.map(
                                                                (task, idx) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="text-sm text-stone-300 bg-earth-800 p-2 rounded"
                                                                    >
                                                                        •{" "}
                                                                        {
                                                                            task.name
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}

                                            {/* Confidence & Reasoning */}
                                            <div className="pt-2 border-t border-earth-700">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs text-stone-500">
                                                        Confidence:
                                                    </span>
                                                    <div className="flex-1 bg-earth-800 rounded-full h-2">
                                                        <div
                                                            className="bg-growth-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${
                                                                    edited.confidence *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-stone-400">
                                                        {Math.round(
                                                            edited.confidence *
                                                                100
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                                {edited.reasoning && (
                                                    <p className="text-xs text-stone-500 italic">
                                                        {edited.reasoning}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-earth-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-earth-700 rounded-lg text-sm font-medium text-stone-300 hover:bg-earth-600 transition-all"
                    >
                        Cancel
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-stone-500 text-sm">
                            {selectedIds.size} selected
                        </span>
                        <button
                            onClick={handleCommit}
                            disabled={selectedIds.size === 0}
                            className="px-6 py-2 bg-gradient-to-r from-growth-500 to-growth-600 rounded-lg text-sm font-bold text-white hover:from-growth-400 hover:to-growth-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Commit Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ClassificationReviewModal;
