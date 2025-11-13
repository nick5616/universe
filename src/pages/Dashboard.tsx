import React, { useState, useEffect, useMemo } from "react";
import ProjectCard from "../components/ProjectCard";
import SmartWidgets from "../components/SmartWidgets";
import DomainFilter from "../components/DomainFilter";
import ProjectView from "../components/ProjectView";
import AddProjectModal from "../components/AddProjectModal";
import AddDomainModal from "../components/AddDomainModal";
import { Domain, Project } from "../lib/mockData";
import { dataService } from "../services/dataService";
import SortDropdown, { SortOption } from "../components/SortDropdown";

const Dashboard = () => {
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [activeDomain, setActiveDomain] = useState<"All" | Project["domain"]>(
        "All"
    );
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isAddDomainModalOpen, setAddDomainModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>("last_touched_at"); // NEW: State for sorting
    const [domainRefreshKey, setDomainRefreshKey] = useState(0); // Key to refresh DomainFilter

    // --- DATA FETCHING AND STATE MANAGEMENT ---
    useEffect(() => {
        // Load initial data from our service
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

    const handleAddDomain = async (domain: Domain) => {
        try {
            await dataService.addDomain(domain);
            setAddDomainModalOpen(false);
            // Refresh domains by incrementing the refresh key
            setDomainRefreshKey((prev) => prev + 1);
        } catch (error) {
            console.error("Failed to add domain:", error);
            // You could add error handling UI here if needed
        }
    };

    const handleDeleteProject = async (projectId: number) => {
        // This now works for both the card and the modal view
        if (selectedProject?.id === projectId) {
            setSelectedProject(null); // Close modal if the deleted project was open
        }
        await dataService.deleteProject(projectId);
        await refreshProjects();
    };

    const handleUpdateProject = async (updatedProject: Project) => {
        const returnedProject = await dataService.updateProject(updatedProject);
        await refreshProjects();
        // This fixes the bug: we update the selectedProject state with the *newest* version.
        setSelectedProject(returnedProject);
    };

    const handleSpontaneousClick = () => {
        // ... (This logic remains the same)
    };

    const filteredProjects = useMemo(() => {
        const list =
            activeDomain === "All"
                ? projects
                : projects.filter((p) => p.domain === activeDomain);

        return list.sort((a, b) => {
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
        return <div className="text-center p-10">Loading your universe...</div>;
    }

    return (
        <div>
            {isAddModalOpen && (
                <AddProjectModal
                    onClose={() => setAddModalOpen(false)}
                    onSave={handleAddProject}
                    refreshKey={domainRefreshKey}
                />
            )}
            {isAddDomainModalOpen && (
                <AddDomainModal
                    onClose={() => setAddDomainModalOpen(false)}
                    onSave={handleAddDomain}
                />
            )}

            {selectedProject && (
                <ProjectView
                    project={selectedProject}
                    onBack={() => setSelectedProject(null)}
                    onUpdateProject={handleUpdateProject}
                    onDeleteProject={handleDeleteProject} // Pass the handler here
                />
            )}

            <SmartWidgets onSpontaneousClick={handleSpontaneousClick} />
            <div className="mt-8">
                <div className="flex justify-between items-center border-b border-gray-700 mb-4">
                    <DomainFilter
                        activeDomain={activeDomain}
                        onSelectDomain={setActiveDomain}
                        onAddProjectClick={() => setAddModalOpen(true)}
                        onAddDomainClick={() => setAddDomainModalOpen(true)}
                        refreshKey={domainRefreshKey}
                    />
                    <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
                </div>
                <h2 className="text-2xl font-semibold">Your Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 animate-fade-in">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => setSelectedProject(project)}
                            onDelete={handleDeleteProject}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
