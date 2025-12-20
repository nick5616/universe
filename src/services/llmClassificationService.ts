import { Note, ClassificationResult, AppState } from "../types";

export interface LLMClassificationService {
    classifyNotes(
        notes: Note[],
        currentState: AppState
    ): Promise<ClassificationResult[]>;
}

// Build context about current state for LLM
// Reserved for future use - note import feature temporarily disabled
// @ts-ignore - Reserved for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _buildStateContext(_state: AppState): string {
    // Reserved for future use
    return "";
}

// Format notes for LLM
// Reserved for future use - note import feature temporarily disabled
// @ts-ignore - Reserved for future use
function _formatNotesForLLM(_notes: Note[]): string {
    // Reserved for future use
    return "";
}

// Parse LLM response into structured classifications
// Reserved for future use - note import feature temporarily disabled
// @ts-ignore - Reserved for future use
function _parseLLMResponse(
    _response: string,
    _noteIds: string[]
): ClassificationResult[] {
    // Reserved for future use
    try {
        // Try to parse as JSON first
        const parsed = JSON.parse(_response);
        if (Array.isArray(parsed)) {
            return parsed.map((item: any, idx: number) => ({
                noteId: _noteIds[idx] || `unknown_${idx}`,
                domain: item.domain || "Uncategorized",
                project: item.project
                    ? {
                          name: item.project.name || item.project,
                          description: item.project.description,
                          matchExisting: item.project.matchExisting,
                      }
                    : undefined,
                idea: item.idea
                    ? {
                          name: item.idea.name || item.idea,
                          description: item.idea.description,
                      }
                    : undefined,
                tasks: item.tasks || [],
                confidence: item.confidence || 0.7,
                reasoning: item.reasoning || "",
                shouldCreateDomain: item.shouldCreateDomain || false,
            }));
        }
    } catch (e) {
        // If not JSON, try to extract structured data from text
        console.warn(
            "LLM response not in JSON format, attempting text parsing",
            e
        );
    }

    // Fallback: create basic classifications
    return _noteIds.map((noteId: string) => ({
        noteId,
        domain: "Uncategorized",
        confidence: 0.5,
        reasoning: "Could not parse LLM response",
        shouldCreateDomain: false,
    }));
}

// Groq API implementation
// async function classifyWithGroq(notes: Note[], state: AppState): Promise<ClassificationResult[]> {
//     const apiKey = import.meta.env.VITE_GROQ_API_KEY;
//     if (!apiKey) {
//         throw new Error("Groq API key not found. Set VITE_GROQ_API_KEY in your .env file.");
//     }

//     const Groq = (await import("groq-sdk")).default;
//     const groq = new Groq({ apiKey });

//     const stateContext = buildStateContext(state);
//     const notesText = formatNotesForLLM(notes);
//     const noteIds = notes.map(n => n.id);

//     const prompt = `${stateContext}

// Classify the following notes. Return a JSON array where each object has:
// {
//   "domain": "string (existing domain name or new domain name)",
//   "project": { "name": "string", "description": "string (optional)", "matchExisting": number (project ID if matching existing) },
//   "idea": { "name": "string", "description": "string (optional)" },
//   "tasks": [{ "name": "string" }],
//   "confidence": number (0-1),
//   "reasoning": "string (explanation)",
//   "shouldCreateDomain": boolean
// }

// Notes to classify:
// ${notesText}

// Return only valid JSON array:`;

//     try {
//             const completion = await groq.chat.completions.create({
//                 messages: [
//                     {
//                         role: "system",
//                         content: "You are a helpful assistant that classifies notes into a hierarchical structure. Return a JSON object with a 'results' array containing classifications.",
//                     },
//                     {
//                         role: "user",
//                         content: prompt + "\n\nReturn your response as a JSON object with a 'results' array.",
//                     },
//                 ],
//                 model: "llama-3.1-70b-versatile", // Fast and free on Groq
//                 temperature: 0.3,
//                 response_format: { type: "json_object" },
//             });

//             const response = completion.choices[0]?.message?.content || '{"results":[]}';
//             // Groq with json_object returns an object
//             const parsed = JSON.parse(response);
//             const results = Array.isArray(parsed) ? parsed : (parsed.results || parsed.classifications || Object.values(parsed).filter(Array.isArray)[0] || [parsed]);

//         return results.map((item: any, idx: number) => ({
//             noteId: noteIds[idx] || `unknown_${idx}`,
//             domain: item.domain || "Uncategorized",
//             project: item.project ? {
//                 name: typeof item.project === "string" ? item.project : (item.project.name || "New Project"),
//                 description: typeof item.project === "object" ? item.project.description : undefined,
//                 matchExisting: typeof item.project === "object" ? item.project.matchExisting : undefined,
//             } : undefined,
//             idea: item.idea ? {
//                 name: typeof item.idea === "string" ? item.idea : (item.idea.name || "New Idea"),
//                 description: typeof item.idea === "object" ? item.idea.description : undefined,
//             } : undefined,
//             tasks: Array.isArray(item.tasks) ? item.tasks.map((t: any) => ({
//                 name: typeof t === "string" ? t : (t.name || t),
//             })) : [],
//             confidence: typeof item.confidence === "number" ? item.confidence : 0.7,
//             reasoning: item.reasoning || item.explanation || "",
//             shouldCreateDomain: item.shouldCreateDomain || false,
//         }));
//     } catch (error) {
//         console.error("Groq API error:", error);
//         throw error;
//     }
// }

// OpenAI API fallback
// async function classifyWithOpenAI(
//     notes: Note[],
//     state: AppState
// ): Promise<ClassificationResult[]> {
//     const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
//     if (!apiKey) {
//         throw new Error(
//             "OpenAI API key not found. Set VITE_OPENAI_API_KEY in your .env file."
//         );
//     }

//     const OpenAI = (await import("openai")).default;
//     const openai = new OpenAI({ apiKey });

//     const stateContext = buildStateContext(state);
//     const notesText = formatNotesForLLM(notes);
//     const noteIds = notes.map((n) => n.id);

//     const prompt = `${stateContext}

// Classify the following notes. Return a JSON array where each object has:
// {
//   "domain": "string",
//   "project": { "name": "string", "description": "string (optional)", "matchExisting": number (optional) },
//   "idea": { "name": "string", "description": "string (optional)" },
//   "tasks": [{ "name": "string" }],
//   "confidence": number (0-1),
//   "reasoning": "string",
//   "shouldCreateDomain": boolean
// }

// Notes to classify:
// ${notesText}

// Return only valid JSON array:`;

//     try {
//         const completion = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 {
//                     role: "system",
//                     content:
//                         "You are a helpful assistant that classifies notes into a hierarchical structure. Return a JSON object with a 'results' array containing classifications.",
//                 },
//                 {
//                     role: "user",
//                     content:
//                         prompt +
//                         "\n\nReturn your response as a JSON object with a 'results' array.",
//                 },
//             ],
//             temperature: 0.3,
//             response_format: { type: "json_object" },
//         });

//         const response =
//             completion.choices[0]?.message?.content || '{"results":[]}';
//         const parsed = JSON.parse(response);
//         const results = Array.isArray(parsed)
//             ? parsed
//             : parsed.results ||
//               parsed.classifications ||
//               Object.values(parsed).filter(Array.isArray)[0] || [parsed];

//         return results.map((item: any, idx: number) => ({
//             noteId: noteIds[idx] || `unknown_${idx}`,
//             domain: item.domain || "Uncategorized",
//             project: item.project
//                 ? {
//                       name:
//                           typeof item.project === "string"
//                               ? item.project
//                               : item.project.name || "New Project",
//                       description:
//                           typeof item.project === "object"
//                               ? item.project.description
//                               : undefined,
//                       matchExisting:
//                           typeof item.project === "object"
//                               ? item.project.matchExisting
//                               : undefined,
//                   }
//                 : undefined,
//             idea: item.idea
//                 ? {
//                       name:
//                           typeof item.idea === "string"
//                               ? item.idea
//                               : item.idea.name || "New Idea",
//                       description:
//                           typeof item.idea === "object"
//                               ? item.idea.description
//                               : undefined,
//                   }
//                 : undefined,
//             tasks: Array.isArray(item.tasks)
//                 ? item.tasks.map((t: any) => ({
//                       name: typeof t === "string" ? t : t.name || t,
//                   }))
//                 : [],
//             confidence:
//                 typeof item.confidence === "number" ? item.confidence : 0.7,
//             reasoning: item.reasoning || item.explanation || "",
//             shouldCreateDomain: item.shouldCreateDomain || false,
//         }));
//     } catch (error) {
//         console.error("OpenAI API error:", error);
//         throw error;
//     }
// }

// const llmClassificationService: LLMClassificationService = {
//     async classifyNotes(
//         notes: Note[],
//         currentState: AppState
//     ): Promise<ClassificationResult[]> {
//         if (notes.length === 0) return [];

//         // Try Groq first (free tier), fallback to OpenAI
//         try {
//             if (import.meta.env.VITE_GROQ_API_KEY) {
//                 return await classifyWithGroq(notes, currentState);
//             }
//         } catch (error) {
//             console.warn("Groq classification failed, trying OpenAI:", error);
//         }

//         // Fallback to OpenAI
//         if (import.meta.env.VITE_OPENAI_API_KEY) {
//             return await classifyWithOpenAI(notes, currentState);
//         }

//         throw new Error(
//             "No LLM API key configured. Please set VITE_GROQ_API_KEY or VITE_OPENAI_API_KEY"
//         );
//     },
// };

// export default llmClassificationService;
