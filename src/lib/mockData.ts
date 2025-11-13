export interface Task {
    id: number;
    name: string;
    is_completed: boolean;
}

export interface Idea {
    id: number;
    name: string;
    tasks: Task[];
}

export type Domain = string; // Changed to string to allow dynamic domains

export interface Project {
    id: number;
    name: string;
    description: string;
    domain: Domain;
    status: "Active" | "On Hold";
    ideas: Idea[];
    last_touched_at: string;
}

export const initialProjects: Project[] = [
    {
        id: 1,
        name: "Amazfit Watchfaces",
        domain: "Code",
        status: "Active",
        description:
            "Creating and selling custom watchfaces on the Amazfit store.",
        last_touched_at: "2023-10-15T10:00:00Z",
        ideas: [
            {
                id: 101,
                name: "Ben 10 Omnitrix",
                tasks: [
                    {
                        id: 1001,
                        name: "Design the watch face UI in Figma",
                        is_completed: true,
                    },
                    {
                        id: 1002,
                        name: "Code the basic time-telling functionality",
                        is_completed: false,
                    },
                    {
                        id: 1003,
                        name: "Research legality of selling a copyrighted design",
                        is_completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: 2,
        name: "Social Media Content",
        domain: "Art",
        status: "Active",
        description:
            "An experimental TikTok account dedicated to drawing with my non-dominant hand.",
        last_touched_at: "2023-11-01T12:30:00Z",
        ideas: [
            {
                id: 102,
                name: "TikTok account for drawing with left hand",
                tasks: [],
            },
        ],
    },
    {
        id: 3,
        name: "Tierlistify App",
        domain: "Code",
        status: "On Hold",
        description:
            "A web app for creating and sharing tier lists. Currently on hold until I have time for a proper launch plan.",
        last_touched_at: "2023-09-05T18:00:00Z",
        ideas: [
            {
                id: 103,
                name: "Launch V1",
                tasks: [
                    {
                        id: 1006,
                        name: "Finalize the README",
                        is_completed: true,
                    },
                    {
                        id: 1007,
                        name: "Deploy to production server",
                        is_completed: false,
                    },
                ],
            },
        ],
    },
];
