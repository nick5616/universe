import { Note, ImportSource } from "../types";

const NOTES_STORAGE_KEY = "passionfruit-imported-notes";

export interface NoteImportService {
    parseGoogleKeepExport(file: File): Promise<Note[]>;
    parseAppleNotesExport(file: File): Promise<Note[]>;
    saveNotes(notes: Note[]): Promise<void>;
    getImportedNotes(): Promise<Note[]>;
    getUnprocessedNotes(): Promise<Note[]>;
    markNotesProcessed(noteIds: string[]): Promise<void>;
    markNotesCommitted(noteIds: string[]): Promise<void>;
    detectNewNotes(existingIds: string[]): Promise<Note[]>;
}

// Google Keep Takeout format parser
async function parseGoogleKeepExport(file: File): Promise<Note[]> {
    const text = await file.text();
    let data: any;
    
    try {
        data = JSON.parse(text);
    } catch (e) {
        throw new Error("Invalid JSON file. Please ensure you exported from Google Takeout.");
    }

    // Google Keep Takeout can be a single object or array
    const notes = Array.isArray(data) ? data : [data];
    
    return notes.map((note: any, index: number) => {
        // Handle different Google Keep export formats
        const title = note.title || note.textContent?.split('\n')[0] || `Untitled Note ${index + 1}`;
        const content = note.textContent || note.text || note.content || "";
        
        return {
            id: note.id || `google_keep_${Date.now()}_${index}`,
            title: title.trim() || "Untitled",
            content: content.trim(),
            source: "google_keep" as ImportSource,
            importedAt: new Date().toISOString(),
            processed: false,
            committed: false,
            metadata: {
                labels: note.labels || [],
                color: note.color,
                pinned: note.isPinned || false,
                archived: note.isArchived || false,
                createdTime: note.createdTimestampUsec 
                    ? new Date(parseInt(note.createdTimestampUsec) / 1000).toISOString()
                    : undefined,
                editedTime: note.userEditedTimestampUsec
                    ? new Date(parseInt(note.userEditedTimestampUsec) / 1000).toISOString()
                    : undefined,
            },
        };
    }).filter((note: Note) => note.content.length > 0 || note.title !== "Untitled");
}

// Apple Notes export parser (expects JSON format from Shortcuts or manual export)
async function parseAppleNotesExport(file: File): Promise<Note[]> {
    const text = await file.text();
    let data: any;
    
    try {
        data = JSON.parse(text);
    } catch (e) {
        throw new Error("Invalid JSON file. Please export Apple Notes as JSON.");
    }

    // Handle different Apple Notes export formats
    const notes = Array.isArray(data) ? data : (data.notes || [data]);
    
    return notes.map((note: any, index: number) => {
        const title = note.title || note.name || `Untitled Note ${index + 1}`;
        const content = note.body || note.content || note.text || "";
        
        return {
            id: note.id || note.uuid || `apple_notes_${Date.now()}_${index}`,
            title: title.trim() || "Untitled",
            content: content.trim(),
            source: "apple_notes" as ImportSource,
            importedAt: new Date().toISOString(),
            processed: false,
            committed: false,
            metadata: {
                createdTime: note.created ? new Date(note.created).toISOString() : undefined,
                editedTime: note.modified ? new Date(note.modified).toISOString() : undefined,
            },
        };
    }).filter((note: Note) => note.content.length > 0 || note.title !== "Untitled");
}

const localStorageNoteService: NoteImportService = {
    async parseGoogleKeepExport(file: File): Promise<Note[]> {
        return parseGoogleKeepExport(file);
    },

    async parseAppleNotesExport(file: File): Promise<Note[]> {
        return parseAppleNotesExport(file);
    },

    async saveNotes(notes: Note[]): Promise<void> {
        const existing = await this.getImportedNotes();
        const existingIds = new Set(existing.map(n => n.id));
        
        // Merge new notes with existing, avoiding duplicates
        const newNotes = notes.filter(n => !existingIds.has(n.id));
        const allNotes = [...existing, ...newNotes];
        
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(allNotes));
    },

    async getImportedNotes(): Promise<Note[]> {
        const notesJson = localStorage.getItem(NOTES_STORAGE_KEY);
        if (!notesJson) return [];
        return JSON.parse(notesJson);
    },

    async getUnprocessedNotes(): Promise<Note[]> {
        const notes = await this.getImportedNotes();
        return notes.filter(n => !n.processed);
    },

    async markNotesProcessed(noteIds: string[]): Promise<void> {
        const notes = await this.getImportedNotes();
        const updated = notes.map(n => 
            noteIds.includes(n.id) ? { ...n, processed: true } : n
        );
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    },

    async markNotesCommitted(noteIds: string[]): Promise<void> {
        const notes = await this.getImportedNotes();
        const updated = notes.map(n => 
            noteIds.includes(n.id) ? { ...n, committed: true } : n
        );
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updated));
    },

    async detectNewNotes(existingIds: string[]): Promise<Note[]> {
        const notes = await this.getImportedNotes();
        const existingSet = new Set(existingIds);
        return notes.filter(n => !existingSet.has(n.id) && !n.committed);
    },
};

export const noteImportService: NoteImportService = localStorageNoteService;

