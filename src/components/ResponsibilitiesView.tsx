import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { Project, Responsibility } from "../lib/mockData";

interface ResponsibilitiesViewProps {
    projects: Project[];
    onClose: () => void;
    onUpdateProject: (updatedProject: Project) => void;
}

interface ResponsibilityWithProject extends Responsibility {
    projectId: number;
    projectName: string;
    projectDomain: string;
}

const ResponsibilitiesView: React.FC<ResponsibilitiesViewProps> = ({
    projects,
    onClose,
    onUpdateProject,
}) => {
    // Collect all responsibilities with their project info
    const allResponsibilities = useMemo(() => {
        const responsibilities: ResponsibilityWithProject[] = [];
        projects.forEach((project) => {
            project.responsibilities.forEach((responsibility) => {
                responsibilities.push({
                    ...responsibility,
                    projectId: project.id,
                    projectName: project.name,
                    projectDomain: project.domain,
                });
            });
        });
        return responsibilities;
    }, [projects]);

    // Sort by due date (overdue first, then by next due date)
    const sortedResponsibilities = useMemo(() => {
        return [...allResponsibilities].sort((a, b) => {
            const aDue = a.nextDueAt ? new Date(a.nextDueAt).getTime() : 0;
            const bDue = b.nextDueAt ? new Date(b.nextDueAt).getTime() : 0;
            const now = Date.now();

            // Overdue items first
            const aOverdue = aDue > 0 && aDue < now;
            const bOverdue = bDue > 0 && bDue < now;

            if (aOverdue && !bOverdue) return -1;
            if (!aOverdue && bOverdue) return 1;
            if (aOverdue && bOverdue) return aDue - bDue; // Most overdue first

            // Then by next due date (soonest first)
            if (aDue > 0 && bDue > 0) return aDue - bDue;
            if (aDue > 0) return -1;
            if (bDue > 0) return 1;
            return 0; // No due date - keep original order
        });
    }, [allResponsibilities]);

    const handleComplete = (responsibility: ResponsibilityWithProject) => {
        const project = projects.find((p) => p.id === responsibility.projectId);
        if (!project) return;

        const responsibilityIndex = project.responsibilities.findIndex(
            (r) => r.id === responsibility.id
        );
        if (responsibilityIndex === -1) return;

        const now = new Date();
        const nextDue = new Date(
            now.getTime() + responsibility.frequencyHours * 60 * 60 * 1000
        );

        const updatedResponsibility: Responsibility = {
            ...responsibility,
            lastCompletedAt: now.toISOString(),
            nextDueAt: nextDue.toISOString(),
        };

        const updatedResponsibilities = [...project.responsibilities];
        updatedResponsibilities[responsibilityIndex] = updatedResponsibility;

        onUpdateProject({
            ...project,
            responsibilities: updatedResponsibilities,
        });
    };

    const getTimeUntilDue = (responsibility: ResponsibilityWithProject) => {
        if (!responsibility.nextDueAt) return null;
        const now = new Date();
        const due = new Date(responsibility.nextDueAt);
        const diffMs = due.getTime() - now.getTime();
        if (diffMs < 0) return "Overdue";
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    };

    const isOverdue = (responsibility: ResponsibilityWithProject) => {
        if (!responsibility.nextDueAt) return false;
        return new Date(responsibility.nextDueAt) < new Date();
    };

    const overdueCount = sortedResponsibilities.filter(isOverdue).length;
    const dueSoonCount = sortedResponsibilities.filter((r) => {
        if (!r.nextDueAt || isOverdue(r)) return false;
        const due = new Date(r.nextDueAt);
        const hoursUntilDue =
            (due.getTime() - Date.now()) / (1000 * 60 * 60);
        return hoursUntilDue <= 24 && hoursUntilDue > 0;
    }).length;

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
                    <button
                        onClick={onClose}
                        className="mb-4 text-passion-400 hover:text-passion-300 transition-colors font-medium"
                    >
                        ← Back to Garden
                    </button>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-stone-100">
                            Tend to Responsibilities
                        </h2>
                        {(overdueCount > 0 || dueSoonCount > 0) && (
                            <div className="flex gap-3 text-sm">
                                {overdueCount > 0 && (
                                    <span className="bg-passion-500/20 text-passion-400 px-3 py-1 rounded-full font-semibold">
                                        {overdueCount} Overdue
                                    </span>
                                )}
                                {dueSoonCount > 0 && (
                                    <span className="bg-growth-500/20 text-growth-400 px-3 py-1 rounded-full font-semibold">
                                        {dueSoonCount} Due Soon
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Responsibilities List */}
                <div className="flex-grow overflow-y-auto">
                    {sortedResponsibilities.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed border-earth-700 rounded-xl bg-earth-800/30">
                            <div className="text-5xl mb-4">✨</div>
                            <h3 className="text-xl font-semibold font-serif text-stone-300">
                                All caught up!
                            </h3>
                            <p className="text-stone-500 mt-2">
                                You have no responsibilities to tend to.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {sortedResponsibilities.map((responsibility) => {
                                const overdue = isOverdue(responsibility);
                                const timeUntilDue = getTimeUntilDue(
                                    responsibility
                                );

                                return (
                                    <div
                                        key={`${responsibility.projectId}-${responsibility.id}`}
                                        className={`bg-earth-900/50 p-5 rounded-xl border transition-colors ${
                                            overdue
                                                ? "border-passion-500/50 bg-passion-500/10"
                                                : "border-earth-700 hover:border-earth-600"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-bold font-serif text-stone-100 text-lg">
                                                        {responsibility.name}
                                                    </h3>
                                                    <span className="bg-passion-500/20 text-passion-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                                                        {
                                                            responsibility.projectDomain
                                                        }
                                                    </span>
                                                </div>
                                                {responsibility.description && (
                                                    <p className="text-stone-400 text-sm mb-2">
                                                        {
                                                            responsibility.description
                                                        }
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-4 text-sm text-stone-500">
                                                    <span>
                                                        Every{" "}
                                                        {
                                                            responsibility.frequencyHours
                                                        }{" "}
                                                        hours
                                                    </span>
                                                    {responsibility.lastCompletedAt && (
                                                        <span>
                                                            Last:{" "}
                                                            {new Date(
                                                                responsibility.lastCompletedAt
                                                            ).toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                {timeUntilDue && (
                                                    <div
                                                        className={`mt-2 text-sm font-medium ${
                                                            overdue
                                                                ? "text-passion-400"
                                                                : "text-growth-400"
                                                        }`}
                                                    >
                                                        {overdue ? "⚠️ " : "⏰ "}
                                                        {overdue
                                                            ? "Overdue"
                                                            : `Due in ${timeUntilDue}`}
                                                    </div>
                                                )}
                                                <div className="mt-2 text-xs text-stone-600">
                                                    Project:{" "}
                                                    {
                                                        responsibility.projectName
                                                    }
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleComplete(
                                                        responsibility
                                                    )
                                                }
                                                className="px-4 py-2 bg-growth-600 hover:bg-growth-500 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0"
                                            >
                                                ✓ Complete
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ResponsibilitiesView;

