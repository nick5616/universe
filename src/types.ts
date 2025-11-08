// These types should match your Supabase tables
export interface Project {
    id: number;
    name: string;
    domain: string; // Or could be a separate Domain type
    ideaCount: number; // This might be a calculated value
    last_touched_at: string; // ISO date string
}
