// src/pages/Dashboard.tsx
import React, { useState } from "react";
import ProjectCard from "../components/ProjectCard";
import SmartWidgets from "../components/SmartWidgets";
import DomainFilter from "../components/DomainFilter";
import ProjectView from "../components/ProjectView";
import { initialProjects, Project } from "../lib/mockData";

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [activeDomain, setActiveDomain] = useState<"All" | Project["domain"]>(
        "All"
    );
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );

    const handleAddProject = () => {
        const newProjectName = prompt("Enter the name for the new project:");
        if (newProjectName) {
            const newProject: Project = {
                id: Date.now(), // simple unique id
                name: newProjectName,
                domain: "Code", // default domain
                ideas: [],
                last_touched_at: new Date().toISOString(),
            };
            setProjects([...projects, newProject]);
        }
    };

    const filteredProjects =
        activeDomain === "All"
            ? projects
            : projects.filter((p) => p.domain === activeDomain);

    if (selectedProject) {
        return (
            <ProjectView
                project={selectedProject}
                onBack={() => setSelectedProject(null)}
            />
        );
    }

    return (
        <div>
            <SmartWidgets />
            <div className="mt-8">
                <DomainFilter
                    activeDomain={activeDomain}
                    onSelectDomain={setActiveDomain}
                    onAddProject={handleAddProject}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 animate-fade-in">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() => setSelectedProject(project)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
