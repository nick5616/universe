// src/pages/Dashboard.tsx
import { useState, useEffect, useMemo, useRef, ChangeEvent } from "react";
import { Project, Domain } from "../lib/mockData";
import { dataService } from "../services/dataService";
import { localStorageKey } from "../constants";
import { focusService } from "../services/focusService";
// Note import feature temporarily disabled for deployment
// import { noteImportService } from "../services/noteImportService";
// import llmClassificationService from "../services/llmClassificationService";
// import stateMutationService from "../services/stateMutationService";
// import autoSyncService from "../services/autoSyncService";
// import { ClassificationResult, AppState } from "../types";
// import { Note } from "../types";
import ProjectCard from "../components/ProjectCard";
import SmartWidgets from "../components/SmartWidgets";
import DomainFilter from "../components/DomainFilter";
import ProjectView from "../components/ProjectView";
import AddProjectModal from "../components/AddProjectModal";
import SortDropdown, { SortOption } from "../components/SortDropdown";
import FocusSelectionModal from "../components/FocusSelectionModal";
import FocusGroveView from "../components/FocusGroveView";
import AddDomainModal from "../components/AddDomainModal";
// Note import feature temporarily disabled for deployment
// import NoteSelectionModal from "../components/NoteSelectionModal";
// import ClassificationReviewModal from "../components/ClassificationReviewModal";
import SplashScreen from "../components/SplashScreen";
import ResponsibilitiesView from "../components/ResponsibilitiesView";

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeDomain, setActiveDomain] = useState<"All" | Domain>("All");
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isAddDomainModalOpen, setAddDomainModalOpen] = useState(false);
    const [pendingDomain, setPendingDomain] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isContentReady, setIsContentReady] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("last_touched_at");

    // Focus Grove State
    const [focusedIdeaIds, setFocusedIdeaIds] = useState<number[]>([]);
    const [isSelectionModalOpen, setSelectionModalOpen] = useState(false);
    const [isFocusGroveOpen, setFocusGroveOpen] = useState(false);

    // Responsibilities State
    const [isResponsibilitiesViewOpen, setResponsibilitiesViewOpen] =
        useState(false);


    // Note Import State - Temporarily disabled for deployment
    // const [importedNotes, setImportedNotes] = useState<Note[]>([]);
    // const [isNoteSelectionModalOpen, setNoteSelectionModalOpen] =
    //     useState(false);
    // const [isClassificationReviewModalOpen, setClassificationReviewModalOpen] =
    //     useState(false);
    // const [pendingClassifications, setPendingClassifications] = useState<
    //     ClassificationResult[]
    // >([]);
    // const [pendingNotesForReview, setPendingNotesForReview] = useState<Note[]>(
    //     []
    // );
    // const [isClassifying, setIsClassifying] = useState(false);
    // const stopPollingRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setIsContentReady(false);
            const [fetchedProjects, fetchedFocusIds] = await Promise.all([
                dataService.getProjects(),
                focusService.getFocusedIdeaIds(),
                // noteImportService.getImportedNotes(), // Temporarily disabled
            ]);
            setProjects(fetchedProjects);
            setFocusedIdeaIds(fetchedFocusIds);
            // setImportedNotes(fetchedNotes); // Temporarily disabled
            setIsLoading(false);
        };
        loadData();
    }, []);

    // Callback ref to detect when project cards are rendered
    const projectCardsCallbackRef = (node: HTMLDivElement | null) => {
        if (node && !isLoading) {
            // Wait for next frame to ensure all cards are rendered
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    // Small delay to ensure animations can start
                    setTimeout(() => {
                        setIsContentReady(true);
                    }, 100);
                });
            });
        }
    };

    // Callback ref for empty state
    const emptyStateCallbackRef = (node: HTMLDivElement | null) => {
        if (node && !isLoading && filteredAndSortedProjects.length === 0) {
            // Wait for next frame to ensure empty state is rendered
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        setIsContentReady(true);
                    }, 100);
                });
            });
        }
    };

    // Reset content ready state when loading starts
    useEffect(() => {
        if (isLoading) {
            setIsContentReady(false);
        }
    }, [isLoading]);

    // Auto-sync polling - Temporarily disabled for deployment
    // useEffect(() => {
    //     if (autoSyncService.isEnabled()) {
    //         const stopPolling = autoSyncService.startPolling(
    //             60000,
    //             (newNotes) => {
    //                 // Update imported notes when new ones are detected
    //                 noteImportService.getImportedNotes().then(setImportedNotes);
    //             }
    //         );
    //         stopPollingRef.current = stopPolling;
    //         return () => {
    //             if (stopPollingRef.current) {
    //                 stopPollingRef.current();
    //             }
    //         };
    //     }
    // }, []);

    const refreshProjects = async () => {
        const fetchedProjects = await dataService.getProjects();
        setProjects(fetchedProjects);
    };

    const handleAddProject = async (
        name: string,
        domain: string,
        description: string
    ) => {
        await dataService.addProject(name, domain as Domain, description);
        await refreshProjects();
        setAddModalOpen(false);
        setPendingDomain(null);
    };

    const handleAddDomain = () => {
        setAddDomainModalOpen(true);
    };

    const handleDomainCreated = (domainName: string) => {
        setPendingDomain(domainName);
        setAddDomainModalOpen(false);
        setAddModalOpen(true);
    };

    const handleDeleteProject = async (projectId: number) => {
        if (selectedProject?.id === projectId) {
            setSelectedProject(null);
        }
        await dataService.deleteProject(projectId);
        await refreshProjects();
    };

    const handleUpdateProject = async (updatedProject: Project) => {
        const returnedProject = await dataService.updateProject(updatedProject);
        await refreshProjects();
        if (selectedProject?.id === updatedProject.id) {
            setSelectedProject(returnedProject);
        }
    };

    // Reserved for future use
    // @ts-ignore - Reserved for future use
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAddIdea = async (_projectId: number, _ideaName: string) => {
        // Reserved for future use - function body commented out
        return;
    };

    // Reserved for future use
    // @ts-ignore - Reserved for future use
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleAddResponsibility = async (
        _projectId: number,
        _responsibilityName: string,
        _frequencyHours: number
    ) => {
        // Reserved for future use - function body commented out
        return;
    };

    const handleSpontaneousClick = () => {
        const allTasks = projects.flatMap((p) =>
            p.ideas.flatMap((i) =>
                i.tasks.map((t) => ({
                    ...t,
                    ideaName: i.name,
                    projectName: p.name,
                }))
            )
        );
        const incompleteTasks = allTasks.filter((t) => !t.is_completed);

        if (incompleteTasks.length === 0) {
            alert(
                "🎉 You've completed everything! Time to plant some new seeds."
            );
            return;
        }

        const randomTask =
            incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
        alert(
            `🌱 Your spontaneous task is:\n\nProject: ${randomTask.projectName}\nIdea: ${randomTask.ideaName}\nStep: ${randomTask.name}`
        );
    };

    // Focus Grove Handlers
    const handleFocusButtonClick = () => {
        if (focusedIdeaIds.length > 0) {
            setFocusGroveOpen(true);
        } else {
            setSelectionModalOpen(true);
        }
    };

    const handleSaveSelection = async (selectedIds: number[]) => {
        await focusService.setFocusedIdeaIds(selectedIds);
        setFocusedIdeaIds(selectedIds);
        setSelectionModalOpen(false);
        if (selectedIds.length > 0) {
            setFocusGroveOpen(true);
        }
    };

    const handleClearGrove = async () => {
        if (
            window.confirm(
                "Clear your Focus Grove? Your ideas will remain in your garden."
            )
        ) {
            await focusService.clearFocusGrove();
            setFocusedIdeaIds([]);
            setFocusGroveOpen(false);
        }
    };

    const handleChangeSelection = () => {
        setFocusGroveOpen(false);
        setSelectionModalOpen(true);
    };

    // Note Import Handlers - Temporarily disabled for deployment
    // const handleImportNotes = async () => {
    //     // Create file input
    //     const input = document.createElement("input");
    //     input.type = "file";
    //     input.accept = ".json,.txt";
    //     input.onchange = async (e) => {
    //         const file = (e.target as HTMLInputElement).files?.[0];
    //         if (!file) return;

    //         try {
    //             let parsedNotes: Note[] = [];
    //             const fileName = file.name.toLowerCase();

    //             if (fileName.includes("keep") || fileName.includes("google")) {
    //                 parsedNotes = await noteImportService.parseGoogleKeepExport(
    //                     file
    //                 );
    //             } else if (
    //                 fileName.includes("notes") ||
    //                 fileName.includes("apple")
    //             ) {
    //                 parsedNotes = await noteImportService.parseAppleNotesExport(
    //                     file
    //                 );
    //             } else {
    //                 // Try both parsers
    //                 try {
    //                     parsedNotes =
    //                         await noteImportService.parseGoogleKeepExport(file);
    //                 } catch {
    //                     parsedNotes =
    //                         await noteImportService.parseAppleNotesExport(file);
    //                 }
    //             }

    //             await noteImportService.saveNotes(parsedNotes);
    //             const updatedNotes = await noteImportService.getImportedNotes();
    //             setImportedNotes(updatedNotes);

    //             // Show note selection modal
    //             const unprocessed =
    //                 await noteImportService.getUnprocessedNotes();
    //             if (unprocessed.length > 0) {
    //                 setNoteSelectionModalOpen(true);
    //             }
    //         } catch (error) {
    //             console.error("Import error:", error);
    //             alert(
    //                 `Failed to import notes: ${
    //                     error instanceof Error ? error.message : "Unknown error"
    //                 }`
    //             );
    //         }
    //     };
    //     input.click();
    // };

    // const handleContextualizeNotes = async () => {
    //     const unprocessed = await noteImportService.getUnprocessedNotes();
    //     if (unprocessed.length > 0) {
    //         setNoteSelectionModalOpen(true);
    //     }
    // };

    // const handleAnalyzeSelected = async (selectedNoteIds: string[]) => {
    //     setIsClassifying(true);
    //     setNoteSelectionModalOpen(false);

    //     try {
    //         const notesToAnalyze = importedNotes.filter((n) =>
    //             selectedNoteIds.includes(n.id)
    //         );

    //         // Mark as processed
    //         await noteImportService.markNotesProcessed(selectedNoteIds);

    //         // Get current state
    //         const currentState: AppState = {
    //             projects,
    //             domains: Array.from(new Set(projects.map((p) => p.domain))),
    //         };

    //         // Classify with LLM
    //         // const classifications = await llmClassificationService.classifyNotes(notesToAnalyze, currentState);

    //         // setPendingClassifications(classifications);
    //         setPendingNotesForReview(notesToAnalyze);
    //         setClassificationReviewModalOpen(true);
    //     } catch (error) {
    //         console.error("Classification error:", error);
    //         alert(
    //             `Failed to classify notes: ${
    //                 error instanceof Error ? error.message : "Unknown error"
    //             }`
    //         );
    //     } finally {
    //         setIsClassifying(false);
    //     }
    // };

    // const handleCommitClassifications = async (
    //     selectedClassifications: ClassificationResult[]
    // ) => {
    //     try {
    //         // Get current state
    //         const currentState: AppState = {
    //             projects,
    //             domains: Array.from(new Set(projects.map((p) => p.domain))),
    //         };

    //         // Apply mutations
    //         const newState = stateMutationService.applyClassifications(
    //             selectedClassifications,
    //             currentState
    //         );

    //         // Save updated projects
    //         // Get all current projects
    //         const currentProjects = await dataService.getProjects();

    //         for (const project of newState.projects) {
    //             const existing = currentProjects.find(
    //                 (p) => p.id === project.id
    //             );
    //             if (existing) {
    //                 // Update existing project
    //                 await dataService.updateProject(project);
    //             } else {
    //                 // New project - add it directly to localStorage to preserve ID
    //                 const allProjects = await dataService.getProjects();
    //                 const updatedProjects = [...allProjects, project];
    //                 localStorage.setItem(
    //                     localStorageKey,
    //                     JSON.stringify(updatedProjects)
    //                 );
    //             }
    //         }

    //         // Mark notes as committed
    //         const committedNoteIds = selectedClassifications.map(
    //             (c) => c.noteId
    //         );
    //         await noteImportService.markNotesCommitted(committedNoteIds);

    //         // Refresh UI
    //         await refreshProjects();
    //         const updatedNotes = await noteImportService.getImportedNotes();
    //         setImportedNotes(updatedNotes);

    //         setClassificationReviewModalOpen(false);
    //         setPendingClassifications([]);
    //         setPendingNotesForReview([]);
    //     } catch (error) {
    //         console.error("Commit error:", error);
    //         alert(
    //             `Failed to commit classifications: ${
    //                 error instanceof Error ? error.message : "Unknown error"
    //             }`
    //         );
    //     }
    // };

    // Check for new unprocessed notes - Temporarily disabled
    const hasNewNotes = false; // useMemo(() => {
    //     return importedNotes.some((n) => !n.processed && !n.committed);
    // }, [importedNotes]);

    // JSON Backup handlers
    const jsonBackupFileInputRef = useRef<HTMLInputElement>(null);

    const handleExportBackup = async () => {
        try {
            const projects = await dataService.getProjects();
            const domains = await dataService.getDomains();

            const exportData = {
                projects,
                domains,
                exportedAt: new Date().toISOString(),
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `universe-export-${
                new Date().toISOString().split("T")[0]
            }.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export data:", error);
            alert("Failed to export data. Please try again.");
        }
    };

    const handleImportBackup = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const importData = JSON.parse(text);

            // Validate the imported data structure
            if (!importData.projects || !Array.isArray(importData.projects)) {
                throw new Error("Invalid import file: missing projects array");
            }
            if (!importData.domains || !Array.isArray(importData.domains)) {
                throw new Error("Invalid import file: missing domains array");
            }

            // Import projects
            localStorage.setItem(
                localStorageKey,
                JSON.stringify(importData.projects)
            );

            // Import domains
            localStorage.setItem(
                "universe-domains",
                JSON.stringify(importData.domains)
            );

            // Reset file input
            if (jsonBackupFileInputRef.current) {
                jsonBackupFileInputRef.current.value = "";
            }

            // Reload the page to reflect the imported data
            window.location.reload();
        } catch (error) {
            console.error("Failed to import data:", error);
            alert(
                `Failed to import data: ${
                    error instanceof Error
                        ? error.message
                        : "Invalid file format"
                }`
            );

            // Reset file input on error
            if (jsonBackupFileInputRef.current) {
                jsonBackupFileInputRef.current.value = "";
            }
        }
    };

    const handleImportBackupClick = () => {
        jsonBackupFileInputRef.current?.click();
    };

    // Extract unique domains from projects dynamically
    const availableDomains = useMemo(() => {
        const uniqueDomains = new Set<string>();
        projects.forEach((project) => {
            uniqueDomains.add(project.domain);
        });
        // Convert to array and sort for consistent ordering
        const domainArray = Array.from(uniqueDomains).sort();
        return ["All", ...domainArray] as ("All" | string)[];
    }, [projects]);

    // Get list of existing domains (excluding "All") for the project modal
    const existingDomains = useMemo(() => {
        const uniqueDomains = new Set<string>();
        projects.forEach((project) => {
            uniqueDomains.add(project.domain);
        });
        // Include default domains that might not have projects yet
        const defaultDomains = ["Art", "Code", "Music", "Content Creation"];
        defaultDomains.forEach((d) => uniqueDomains.add(d));
        return Array.from(uniqueDomains).sort();
    }, [projects]);

    // Reset to "All" if active domain no longer exists
    useEffect(() => {
        if (
            activeDomain !== "All" &&
            !availableDomains.includes(activeDomain)
        ) {
            setActiveDomain("All");
        }
    }, [activeDomain, availableDomains]);

    const filteredAndSortedProjects = useMemo(() => {
        const list =
            activeDomain === "All"
                ? projects
                : projects.filter((p) => p.domain === activeDomain);

        return [...list].sort((a, b) => {
            switch (sortBy) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "ideas":
                    return b.ideas.length - a.ideas.length;
                case "last_touched_at":
                default:
                    return (
                        new Date(b.last_touched_at).getTime() -
                        new Date(a.last_touched_at).getTime()
                    );
            }
        });
    }, [projects, activeDomain, sortBy]);

    const showSplash = isLoading || !isContentReady;

    return (
        <div>
            <SplashScreen isLoading={showSplash} />

            <div
                className={
                    showSplash
                        ? "opacity-0"
                        : "opacity-100 transition-opacity duration-500"
                }
            >
                {/* Modals */}
                {isAddDomainModalOpen && (
                    <AddDomainModal
                        onClose={() => setAddDomainModalOpen(false)}
                        onSave={handleDomainCreated}
                    />
                )}

                {isAddModalOpen && (
                    <AddProjectModal
                        onClose={() => {
                            setAddModalOpen(false);
                            setPendingDomain(null);
                        }}
                        onSave={handleAddProject}
                        initialDomain={pendingDomain || undefined}
                        availableDomains={existingDomains}
                    />
                )}

                {selectedProject && (
                    <ProjectView
                        project={selectedProject}
                        projects={projects}
                        onBack={() => setSelectedProject(null)}
                        onUpdateProject={handleUpdateProject}
                        onDeleteProject={handleDeleteProject}
                    />
                )}

                {isSelectionModalOpen && (
                    <FocusSelectionModal
                        projects={projects}
                        initialSelectedIds={focusedIdeaIds}
                        onClose={() => setSelectionModalOpen(false)}
                        onSave={handleSaveSelection}
                    />
                )}

                {isFocusGroveOpen && (
                    <FocusGroveView
                        projects={projects}
                        focusedIdeaIds={focusedIdeaIds}
                        onClose={() => setFocusGroveOpen(false)}
                        onUpdateProject={handleUpdateProject}
                        onChangeSelection={handleChangeSelection}
                        onClearGrove={handleClearGrove}
                    />
                )}

                {/* Note import modals temporarily disabled for deployment */}
                {/* {isNoteSelectionModalOpen && (
                    <NoteSelectionModal
                        notes={importedNotes.filter(
                            (n) => !n.processed && !n.committed
                        )}
                        onClose={() => setNoteSelectionModalOpen(false)}
                        onAnalyze={handleAnalyzeSelected}
                    />
                )}

                {isClassificationReviewModalOpen && (
                    <ClassificationReviewModal
                        classifications={pendingClassifications}
                        notes={pendingNotesForReview}
                        existingProjects={projects}
                        onClose={() => {
                            setClassificationReviewModalOpen(false);
                            setPendingClassifications([]);
                            setPendingNotesForReview([]);
                        }}
                        onCommit={handleCommitClassifications}
                    />
                )}

                {isClassifying && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="bg-earth-800 p-6 rounded-xl border border-earth-700">
                            <div className="flex items-center gap-3">
                                <div className="animate-spin text-growth-500 text-2xl">
                                    ⏳
                                </div>
                                <div>
                                    <p className="text-stone-200 font-semibold">
                                        Classifying notes...
                                    </p>
                                    <p className="text-stone-500 text-sm">
                                        This may take a moment
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )} */}

                {isResponsibilitiesViewOpen && (
                    <ResponsibilitiesView
                        projects={projects}
                        onClose={() => setResponsibilitiesViewOpen(false)}
                        onUpdateProject={handleUpdateProject}
                    />
                )}

                {/* Focus Grove Button */}
                <div className="mb-6">
                    <button
                        onClick={handleFocusButtonClick}
                        className="w-full p-4 bg-gradient-to-r from-earth-800 to-earth-800 hover:from-growth-600/20 hover:to-passion-600/20 border-2 border-dashed border-earth-700 hover:border-growth-500/50 rounded-xl transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                                🌿
                            </span>
                            <span className="font-semibold text-stone-300 group-hover:text-stone-100 transition-colors">
                                {focusedIdeaIds.length > 0
                                    ? `Enter Focus Grove (${
                                          focusedIdeaIds.length
                                      } ${
                                          focusedIdeaIds.length === 1
                                              ? "idea"
                                              : "ideas"
                                      })`
                                    : "Curate Your Focus Grove"}
                            </span>
                        </div>
                    </button>
                </div>

                {/* Life Graph Button */}
                <div className="mb-6">
                    <a
                        href="/life-graph"
                        className="block w-full p-4 bg-gradient-to-r from-earth-800 to-earth-800 hover:from-[#fbbf24]/10 hover:to-[#a78bfa]/10 border-2 border-dashed border-earth-700 hover:border-[#fbbf24]/40 rounded-xl transition-all duration-300 group no-underline"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                                ✦
                            </span>
                            <span className="font-semibold text-stone-300 group-hover:text-stone-100 transition-colors">
                                Life Graph
                            </span>
                        </div>
                    </a>
                </div>

                {/* Tend to Responsibilities Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setResponsibilitiesViewOpen(true)}
                        className="w-full p-4 bg-gradient-to-r from-earth-800 to-earth-800 hover:from-passion-600/20 hover:to-growth-600/20 border-2 border-dashed border-earth-700 hover:border-passion-500/50 rounded-xl transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform">
                                📋
                            </span>
                            <span className="font-semibold text-stone-300 group-hover:text-stone-100 transition-colors">
                                Tend to Responsibilities
                            </span>
                        </div>
                    </button>
                </div>

                <SmartWidgets
                    onSpontaneousClick={handleSpontaneousClick}
                    onImportNotes={() => {}} // Temporarily disabled
                    onContextualizeNotes={() => {}} // Temporarily disabled
                    hasNewNotes={hasNewNotes}
                    onExportBackup={handleExportBackup}
                    onImportBackup={handleImportBackupClick}
                />

                <input
                    ref={jsonBackupFileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                />

                <div className="mt-8">
                    <h2 className="text-2xl font-bold font-serif text-stone-100 mb-4">
                        Your Garden
                    </h2>

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-6 border-b border-earth-700">
                        <DomainFilter
                            activeDomain={activeDomain as "All" | Domain}
                            domains={availableDomains as ("All" | Domain)[]}
                            onSelectDomain={(domain) =>
                                setActiveDomain(domain as "All" | Domain)
                            }
                            onAddProjectClick={() => setAddModalOpen(true)}
                            onAddDomain={handleAddDomain}
                        />
                        <SortDropdown
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />
                    </div>

                    {filteredAndSortedProjects.length === 0 ? (
                        <div
                            ref={emptyStateCallbackRef}
                            className="text-center py-16 border-2 border-dashed border-earth-700 rounded-xl bg-earth-800/30"
                        >
                            <div className="text-5xl mb-4">🌻</div>
                            <h3 className="text-xl font-semibold font-serif text-stone-300">
                                Your garden is empty!
                            </h3>
                            <p className="text-stone-500 mt-2">
                                Plant your first seed to get started.
                            </p>
                        </div>
                    ) : (
                        <div
                            ref={projectCardsCallbackRef}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in"
                        >
                            {filteredAndSortedProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onClick={() => setSelectedProject(project)}
                                    onDelete={handleDeleteProject}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
