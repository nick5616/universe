import { ClassificationResult } from "../types";
import { Project, Idea, Domain } from "../lib/mockData";

export interface AppState {
    projects: Project[];
}

export interface StateMutationService {
    applyClassifications(
        classifications: ClassificationResult[],
        currentState: AppState
    ): AppState;
}

// Helper to find similar project names (fuzzy matching)
function findSimilarProject(
    projectName: string,
    projects: Project[]
): Project | null {
    const normalized = projectName.toLowerCase().trim();
    return (
        projects.find(
            (p) =>
                p.name.toLowerCase().trim() === normalized ||
                p.name.toLowerCase().includes(normalized) ||
                normalized.includes(p.name.toLowerCase())
        ) || null
    );
}

// Helper to find similar idea names within a project
function findSimilarIdea(ideaName: string, ideas: Idea[]): Idea | null {
    const normalized = ideaName.toLowerCase().trim();
    return (
        ideas.find(
            (i) =>
                i.name.toLowerCase().trim() === normalized ||
                i.name.toLowerCase().includes(normalized) ||
                normalized.includes(i.name.toLowerCase())
        ) || null
    );
}

// Helper to check if domain exists
function domainExists(domainName: string, projects: Project[]): boolean {
    return projects.some((p) => p.domain === domainName);
}

// Helper to generate unique ID
function generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
}

const stateMutationService: StateMutationService = {
    applyClassifications(
        classifications: ClassificationResult[],
        currentState: AppState
    ): AppState {
        const newProjects = [...currentState.projects];
        const now = new Date().toISOString();

        for (const classification of classifications) {
            const { domain, project, idea, tasks, shouldCreateDomain } =
                classification;

            // Ensure domain exists or create it
            if (shouldCreateDomain && !domainExists(domain, newProjects)) {
                // Domain will be created implicitly when we add a project to it
            }

            // Find or create project
            let targetProject: Project | undefined;

            if (project?.matchExisting !== undefined) {
                // Use existing project ID if specified
                targetProject = newProjects.find(
                    (p) => p.id === project.matchExisting
                );
            } else if (project?.name) {
                // Try to find similar project
                const similar = findSimilarProject(project.name, newProjects);
                if (similar && similar.domain === domain) {
                    targetProject = similar;
                }
            }

            // Create new project if needed
            if (!targetProject && project?.name) {
                targetProject = {
                    id: generateId(),
                    name: project.name,
                    description: project.description || "",
                    domain: domain as Domain, // Domain type now allows string
                    status: "Growing" as const,
                    ideas: [],
                    responsibilities: [],
                    last_touched_at: now,
                };
                newProjects.push(targetProject);
            }

            // Add idea to project
            if (targetProject && idea?.name) {
                // Check for similar idea
                const similarIdea = findSimilarIdea(
                    idea.name,
                    targetProject.ideas
                );

                if (!similarIdea) {
                    // Create new idea
                    const newIdea: Idea = {
                        id: generateId(),
                        name: idea.name,
                        tasks: (tasks || []).map((t) => ({
                            id: generateId(),
                            name: t.name,
                            is_completed: false,
                        })),
                    };
                    targetProject.ideas.push(newIdea);
                } else {
                    // Merge tasks into existing idea
                    const existingTaskNames = new Set(
                        similarIdea.tasks.map((t) => t.name.toLowerCase())
                    );
                    const newTasks = (tasks || [])
                        .filter(
                            (t) => !existingTaskNames.has(t.name.toLowerCase())
                        )
                        .map((t) => ({
                            id: generateId(),
                            name: t.name,
                            is_completed: false,
                        }));
                    similarIdea.tasks.push(...newTasks);
                }

                // Update project timestamp
                targetProject.last_touched_at = now;
            } else if (targetProject && tasks && tasks.length > 0) {
                // If no idea specified but tasks exist, create a default idea
                const defaultIdea: Idea = {
                    id: generateId(),
                    name: "Tasks",
                    tasks: tasks.map((t) => ({
                        id: generateId(),
                        name: t.name,
                        is_completed: false,
                    })),
                };
                targetProject.ideas.push(defaultIdea);
                targetProject.last_touched_at = now;
            }
        }

        return {
            projects: newProjects,
        };
    },
};

export default stateMutationService;
