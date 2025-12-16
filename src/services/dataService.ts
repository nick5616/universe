import { initialProjects, Project, Domain } from "../lib/mockData";
import { localStorageKey } from "../constants";
export interface ProjectApi {
    getProjects: () => Promise<Project[]>;
    getDomains: () => Promise<Domain[]>;
    addProject: (
        name: string,
        domain: Domain,
        description: string
    ) => Promise<Project>;
    updateProject: (project: Project) => Promise<Project>;
    deleteProject: (projectId: number) => Promise<void>;
}

const STORAGE_KEY = localStorageKey;
const initialDomains: Domain[] = [];

const localStorageApi: ProjectApi = {
    async getProjects(): Promise<Project[]> {
        const projectsJson = localStorage.getItem(STORAGE_KEY);
        if (projectsJson) {
            return JSON.parse(projectsJson);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
        return initialProjects;
    },

    async getDomains(): Promise<Domain[]> {
        const domainsJson = localStorage.getItem(STORAGE_KEY);
        if (domainsJson) {
            return JSON.parse(domainsJson);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDomains));
        return initialDomains;
    },

    async addProject(name, domain, description): Promise<Project> {
        const projects = await this.getProjects();
        const newProject: Project = {
            id: Date.now(),
            name,
            domain,
            description,
            status: "Growing",
            ideas: [],
            last_touched_at: new Date().toISOString(),
        };
        const newProjects = [...projects, newProject];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
        return newProject;
    },

    async updateProject(updatedProject): Promise<Project> {
        const projects = await this.getProjects();
        const projectWithTimestamp = {
            ...updatedProject,
            last_touched_at: new Date().toISOString(),
        };
        const newProjects = projects.map((p) =>
            p.id === projectWithTimestamp.id ? projectWithTimestamp : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
        return projectWithTimestamp;
    },

    async deleteProject(projectId): Promise<void> {
        const projects = await this.getProjects();
        const newProjects = projects.filter((p) => p.id !== projectId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    },
};

export const dataService: ProjectApi = localStorageApi;
