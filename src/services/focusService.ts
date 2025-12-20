// src/services/focusService.ts

const STORAGE_KEY = "passionfruit-focus-grove";

export interface FocusApi {
    getFocusedIdeaIds: () => Promise<number[]>;
    setFocusedIdeaIds: (ids: number[]) => Promise<void>;
    clearFocusGrove: () => Promise<void>;
    addIdeaToFocus: (ideaId: number) => Promise<void>;
    removeIdeaFromFocus: (ideaId: number) => Promise<void>;
}

const localStorageFocusApi: FocusApi = {
    async getFocusedIdeaIds(): Promise<number[]> {
        const idsJson = localStorage.getItem(STORAGE_KEY);
        if (idsJson) {
            return JSON.parse(idsJson);
        }
        return [];
    },

    async setFocusedIdeaIds(ids: number[]): Promise<void> {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    },

    async clearFocusGrove(): Promise<void> {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    },

    async addIdeaToFocus(ideaId: number): Promise<void> {
        const ids = await this.getFocusedIdeaIds();
        if (!ids.includes(ideaId)) {
            ids.push(ideaId);
            await this.setFocusedIdeaIds(ids);
        }
    },

    async removeIdeaFromFocus(ideaId: number): Promise<void> {
        const ids = await this.getFocusedIdeaIds();
        const newIds = ids.filter((id) => id !== ideaId);
        await this.setFocusedIdeaIds(newIds);
    },
};

export const focusService: FocusApi = localStorageFocusApi;
