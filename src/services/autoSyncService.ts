import { Note } from "../types";
import { noteImportService } from "./noteImportService";

export interface AutoSyncService {
    isEnabled(): boolean;
    enable(): void;
    disable(): void;
    checkForNewNotes(): Promise<Note[]>;
    startPolling(intervalMs: number, onNewNotes: (notes: Note[]) => void): () => void; // Returns stop function
}

const AUTO_SYNC_STORAGE_KEY = "passionfruit-auto-sync-enabled";
const LAST_SYNC_STORAGE_KEY = "passionfruit-last-sync-time";

const autoSyncService: AutoSyncService = {
    isEnabled(): boolean {
        const enabled = localStorage.getItem(AUTO_SYNC_STORAGE_KEY);
        return enabled === "true";
    },

    enable(): void {
        localStorage.setItem(AUTO_SYNC_STORAGE_KEY, "true");
    },

    disable(): void {
        localStorage.setItem(AUTO_SYNC_STORAGE_KEY, "false");
    },

    async checkForNewNotes(): Promise<Note[]> {
        if (!this.isEnabled()) {
            return [];
        }

        const lastSyncTime = localStorage.getItem(LAST_SYNC_STORAGE_KEY);
        const allNotes = await noteImportService.getImportedNotes();
        
        // Filter notes imported after last sync
        if (lastSyncTime) {
            const lastSync = new Date(lastSyncTime);
            return allNotes.filter(note => 
                new Date(note.importedAt) > lastSync && !note.committed
            );
        }

        // First sync: return all uncommitted notes
        return allNotes.filter(note => !note.committed);
    },

    startPolling(intervalMs: number, onNewNotes: (notes: Note[]) => void): () => void {
        if (!this.isEnabled()) {
            return () => {}; // No-op stop function
        }

        const intervalId = setInterval(async () => {
            try {
                const newNotes = await this.checkForNewNotes();
                if (newNotes.length > 0) {
                    onNewNotes(newNotes);
                    // Update last sync time
                    localStorage.setItem(LAST_SYNC_STORAGE_KEY, new Date().toISOString());
                }
            } catch (error) {
                console.error("Auto-sync error:", error);
            }
        }, intervalMs);

        // Return stop function
        return () => {
            clearInterval(intervalId);
        };
    },
};

export default autoSyncService;

