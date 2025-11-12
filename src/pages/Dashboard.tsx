import React, { useState, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import SmartWidgets from "../components/SmartWidgets";
import DomainFilter from "../components/DomainFilter";
import ProjectView from "../components/ProjectView";
import AddProjectModal from "../components/AddProjectModal";
import { Domain, Project } from "../lib/mockData";
import { dataService } from "../services/dataService"; // Our new service!

const Dashboard = () => {
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [activeDomain, setActiveDomain] = useState<"All" | Project["domain"]>(
        "All"
    );
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    const filteredProjects =
        activeDomain === "All"
            ? projects
            : projects.filter((p) => p.domain === activeDomain);

    if (isLoading) {
        return <div className="text-center p-10">Loading your universe...</div>;
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
                    onDeleteProject={handleDeleteProject} // Pass the handler here
                />
            )}

            <SmartWidgets onSpontaneousClick={handleSpontaneousClick} />
            <div className="mt-8">
                <DomainFilter
                    activeDomain={activeDomain}
                    onSelectDomain={setActiveDomain}
                    onAddProjectClick={() => setAddModalOpen(true)}
                />
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
