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

export type Domain = "Art" | "Code" | "Music" | "Content Creation";

export interface Project {
    id: number;
    name: string;
    description: string;
    domain: Domain;
    status: "Growing" | "Dormant";
    ideas: Idea[];
    last_touched_at: string;
}

export const initialProjects: Project[] = [
    {
        id: 1,
        name: "Amazfit Watchfaces",
        domain: "Code",
        status: "Growing",
        description:
            "Creating and selling custom watchfaces on the Amazfit store.",
        last_touched_at: new Date().toISOString(),
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
        status: "Growing",
        description:
            "An experimental TikTok account dedicated to drawing with my non-dominant hand.",
        last_touched_at: new Date(Date.now() - 86400000 * 5).toISOString(),
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
        status: "Dormant",
        description: "A web app for creating and sharing tier lists.",
        last_touched_at: new Date(Date.now() - 86400000 * 30).toISOString(),
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
    {
        id: 4,
        name: "Song Mashups",
        domain: "Music",
        status: "Growing",
        description: "Creating unique mashups of songs that share a vibe.",
        last_touched_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        ideas: [
            { id: 104, name: "Daft Punk vs. Knight Rider", tasks: [] },
            { id: 105, name: "Maintain a running list of ideas", tasks: [] },
        ],
    },
];
