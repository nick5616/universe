// src/services/dataService.ts
import { initialProjects, Project, Domain } from "../lib/mockData";

const initialDomains: Domain[] = ["Art", "Code", "Music", "Content Creation"];

export interface ProjectApi {
    getProjects: () => Promise<Project[]>;
    addProject: (
        name: string,
        domain: Domain,
        description: string
    ) => Promise<Project>;
    updateProject: (project: Project) => Promise<Project>;
    deleteProject: (projectId: number) => Promise<void>;
    getDomains: () => Promise<Domain[]>;
    addDomain: (domain: Domain) => Promise<Domain>;
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

    async getDomains(): Promise<Domain[]> {
        const domainsJson = localStorage.getItem("universe-domains");
        if (domainsJson) {
            return JSON.parse(domainsJson);
        }
        localStorage.setItem(
            "universe-domains",
            JSON.stringify(initialDomains)
        );
        return initialDomains;
    },

    async addDomain(domain: Domain): Promise<Domain> {
        const domains = await this.getDomains();
        const trimmedDomain = domain.trim();
        if (!trimmedDomain || domains.includes(trimmedDomain)) {
            throw new Error("Domain already exists or is invalid");
        }
        const newDomains = [...domains, trimmedDomain];
        localStorage.setItem("universe-domains", JSON.stringify(newDomains));
        return trimmedDomain;
    },
};

export const dataService: ProjectApi = localStorageApi;
