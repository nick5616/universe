// src/lib/mockData.ts

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

export interface Project {
    id: number;
    name: string;
    domain: "Art" | "Code" | "Music" | "Content Creation";
    ideas: Idea[];
    last_touched_at: string;
}

export const initialProjects: Project[] = [
    {
        id: 1,
        name: "Amazfit Watchfaces",
        domain: "Code",
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
        last_touched_at: "2023-11-01T12:30:00Z",
        ideas: [
            {
                id: 102,
                name: "TikTok account for drawing with left hand",
                tasks: [
                    {
                        id: 1004,
                        name: "Brainstorm 10 initial video ideas",
                        is_completed: false,
                    },
                    {
                        id: 1005,
                        name: "Film and edit the first video",
                        is_completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: 3,
        name: "Tierlistify App",
        domain: "Code",
        last_touched_at: "2023-11-05T18:00:00Z",
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
                    {
                        id: 1008,
                        name: "Post about it on r/webdev and Indie Hackers",
                        is_completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        name: "Personal Blog",
        domain: "Content Creation",
        last_touched_at: "2023-09-20T11:00:00Z",
        ideas: [
            {
                id: 104,
                name: "Post: CS Highlight Detection Engine",
                tasks: [
                    {
                        id: 1009,
                        name: "Outline the blog post structure",
                        is_completed: false,
                    },
                    {
                        id: 1010,
                        name: "Write the technical deep-dive section",
                        is_completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: 5,
        name: "Red Bubble Stickers",
        domain: "Art",
        last_touched_at: "2023-11-04T14:00:00Z",
        ideas: [
            {
                id: 105,
                name: "'Assigned Cop At Birth' Sticker",
                tasks: [
                    {
                        id: 1011,
                        name: "Sketch 3 design variations",
                        is_completed: false,
                    },
                    {
                        id: 1012,
                        name: "Upload final design to Red Bubble",
                        is_completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: 6,
        name: "Song Mashups",
        domain: "Music",
        last_touched_at: "2023-10-28T20:00:00Z",
        ideas: [
            { id: 106, name: "Daft Punk vs. Knight Rider", tasks: [] },
            { id: 107, name: "Maintain a running list of ideas", tasks: [] },
        ],
    },
    {
        id: 7,
        name: "Original Songs",
        domain: "Music",
        last_touched_at: "2023-10-10T22:00:00Z",
        ideas: [
            {
                id: 108,
                name: "One-Hour Garage Band Song Challenge",
                tasks: [
                    {
                        id: 1013,
                        name: "Set a timer and record a demo",
                        is_completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: 8,
        name: "quest.me App",
        domain: "Code",
        last_touched_at: "2023-08-15T16:00:00Z",
        ideas: [
            {
                id: 109,
                name: "Move backend to Google Cloud Platform",
                tasks: [],
            },
            {
                id: 110,
                name: "Full UX overhaul",
                tasks: [
                    {
                        id: 1014,
                        name: "Audit current UI for dead ends and confusing flows",
                        is_completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: 9,
        name: "Portfolio Website",
        domain: "Code",
        last_touched_at: "2023-11-02T09:00:00Z",
        ideas: [
            {
                id: 111,
                name: "Move art assets to Google Cloud Storage",
                tasks: [],
            },
            { id: 112, name: "Create a secure art upload page", tasks: [] },
            {
                id: 113,
                name: "Gumroad Template",
                tasks: [
                    {
                        id: 1015,
                        name: "Research market for portfolio templates",
                        is_completed: false,
                    },
                ],
            },
        ],
    },
    {
        id: 10,
        name: "New App Ideas",
        domain: "Code",
        last_touched_at: "2023-10-05T23:00:00Z",
        ideas: [{ id: 114, name: "Vibe-Based AirPod DJ", tasks: [] }],
    },
];
