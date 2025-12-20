// These types should match your Supabase tables
export interface Project {
    id: number;
    name: string;
    domain: string; // Or could be a separate Domain type
    ideaCount: number; // This might be a calculated value
    last_touched_at: string; // ISO date string
}

// Note Import Types
export type ImportSource = "google_keep" | "apple_notes" | "manual";

export interface Note {
    id: string;
    title: string;
    content: string;
    source: ImportSource;
    importedAt: string; // ISO date string
    processed: boolean; // Whether it's been sent to LLM
    committed: boolean; // Whether it's been committed to state
    metadata?: {
        labels?: string[];
        color?: string;
        pinned?: boolean;
        archived?: boolean;
        createdTime?: string;
        editedTime?: string;
    };
}

export interface ClassificationResult {
    noteId: string;
    domain: string; // Can be existing or new domain name
    project?: {
        name: string;
        description?: string;
        matchExisting?: number; // ID of existing project if matched
    };
    idea?: {
        name: string;
        description?: string;
    };
    tasks?: Array<{
        name: string;
    }>;
    confidence: number; // 0-1
    reasoning: string; // LLM's explanation
    shouldCreateDomain: boolean; // Whether to create a new domain
}

export interface AppState {
    projects: import("./lib/mockData").Project[];
    domains: string[];
}
