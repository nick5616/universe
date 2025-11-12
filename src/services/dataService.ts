// src/services/dataService.ts
import { initialProjects, Project, Domain } from "../lib/mockData";

export interface ProjectApi {
    getProjects: () => Promise<Project[]>;
    addProject: (
        name: string,
        domain: Domain,
        description: string
    ) => Promise<Project>;
    updateProject: (project: Project) => Promise<Project>;
    deleteProject: (projectId: number) => Promise<void>;
}

const localStorageApi: ProjectApi = {
    async getProjects(): Promise<Project[]> {
        const projectsJson = localStorage.getItem("universe-projects");
        if (projectsJson) {
            return JSON.parse(projectsJson);
        }
        localStorage.setItem(
            "universe-projects",
            JSON.stringify(initialProjects)
        );
        return initialProjects;
    },

    async addProject(name, domain, description): Promise<Project> {
        const projects = await this.getProjects();
        const newProject: Project = {
            id: Date.now(),
            name,
            domain,
            description,
            status: "Active",
            ideas: [],
            last_touched_at: new Date().toISOString(),
        };
        const newProjects = [...projects, newProject];
        localStorage.setItem("universe-projects", JSON.stringify(newProjects));
        return newProject;
    },

    async updateProject(updatedProject): Promise<Project> {
        const projects = await this.getProjects();
        // **KEY FEATURE**: Automatically update the timestamp on every update.
        const projectWithTimestamp = {
            ...updatedProject,
            last_touched_at: new Date().toISOString(),
        };
        const newProjects = projects.map((p) =>
            p.id === projectWithTimestamp.id ? projectWithTimestamp : p
        );
        localStorage.setItem("universe-projects", JSON.stringify(newProjects));
        return projectWithTimestamp;
    },

    async deleteProject(projectId): Promise<void> {
        const projects = await this.getProjects();
        const newProjects = projects.filter((p) => p.id !== projectId);
        localStorage.setItem("universe-projects", JSON.stringify(newProjects));
    },
};

export const dataService: ProjectApi = localStorageApi;
