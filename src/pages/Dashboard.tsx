import React, { useState, useEffect, useMemo } from "react";
import { Project, Domain } from "../lib/mockData";
import { dataService } from "../services/dataService";
import ProjectCard from "../components/ProjectCard";
import SmartWidgets from "../components/SmartWidgets";
import DomainFilter from "../components/DomainFilter";
import ProjectView from "../components/ProjectView";
import AddProjectModal from "../components/AddProjectModal";
import SortDropdown, { SortOption } from "../components/SortDropdown";

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeDomain, setActiveDomain] = useState<"All" | Domain>("All");
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("last_touched_at");

    useEffect(() => {
        const loadProjects = async () => {
            setIsLoading(true);
            const fetchedProjects = await dataService.getProjects();
            setProjects(fetchedProjects);
            setIsLoading(false);
        };
        loadProjects();
    }, []);

    const refreshProjects = async () => {
        const fetchedProjects = await dataService.getProjects();
        setProjects(fetchedProjects);
    };

    const handleAddProject = async (
        name: string,
        domain: Domain,
        description: string
    ) => {
        await dataService.addProject(name, domain, description);
        await refreshProjects();
        setAddModalOpen(false);
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
        setSelectedProject(returnedProject);
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-xl text-stone-400 animate-pulse">
                    Loading your garden...
                </div>
            </div>
        );
    }

    return (
        <div>
            {isAddModalOpen && (
                <AddProjectModal
                    onClose={() => setAddModalOpen(false)}
                    onSave={handleAddProject}
                />
            )}

            {selectedProject && (
                <ProjectView
                    project={selectedProject}
                    onBack={() => setSelectedProject(null)}
                    onUpdateProject={handleUpdateProject}
                    onDeleteProject={handleDeleteProject}
                />
            )}

            <SmartWidgets onSpontaneousClick={handleSpontaneousClick} />

            <div className="mt-8">
                <h2 className="text-2xl font-bold font-serif text-stone-100 mb-4">
                    Your Garden
                </h2>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-6 border-b border-earth-700">
                    <DomainFilter
                        activeDomain={activeDomain}
                        onSelectDomain={setActiveDomain}
                        onAddProjectClick={() => setAddModalOpen(true)}
                    />
                    <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
                </div>

                {filteredAndSortedProjects.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-earth-700 rounded-xl bg-earth-800/30">
                        <div className="text-5xl mb-4">🌻</div>
                        <h3 className="text-xl font-semibold font-serif text-stone-300">
                            Your garden is empty!
                        </h3>
                        <p className="text-stone-500 mt-2">
                            Plant your first seed to get started.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
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
    );
};

export default Dashboard;
