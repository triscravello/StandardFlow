// services/plannerClientService.ts

export interface PlannerLesson {
    _id: string;
    title: string;
}

export interface PlannerEntryDTO {
    _id: string;
    lesson: PlannerLesson;
    date: string; // ISO string
    user?: string;
    createdAt?: string;
    updatedAt?: string;
}

async function parseJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const raw = await res.text();
        try {
            const parsed = JSON.parse(raw) as {
                error?: { message?: string };
                message?: string;
            };
            const parsedMessage = parsed?.error?.message || parsed?.message;
            throw new Error(parsedMessage || raw || `Request failed with status ${res.status}`);
        } catch {
            throw new Error(raw || `Request failed with status ${res.status}`);
        }
    }

    return res.json() as Promise<T>;
}

export const plannerService = {
    async user(): Promise<PlannerEntryDTO[]> {
        const res = await fetch('/api/planner/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const payload = await parseJson<
            PlannerEntryDTO[] | { success: boolean; data: PlannerEntryDTO[] }
        >(res);

        if (Array.isArray(payload)) {
            return payload;
        }

        if (payload && typeof payload === "object" && "data" in payload && Array.isArray(payload.data)) {
            return payload.data;
        }

        return [];
    },

    async create(lessonId: string, date: string): Promise<PlannerEntryDTO> {
        const res = await fetch('/api/planner/week', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lessonId, date }),
        });

        return parseJson<PlannerEntryDTO>(res);
    },

    async remove(entryId: string): Promise<void> {
        const res = await fetch(`/api/planner/week?entryId=${encodeURIComponent(entryId)}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        await parseJson<{ message: string }>(res);
    },

    async reschedule(entryId: string, newDate: string): Promise<PlannerEntryDTO> {
        const res = await fetch('/api/planner/week', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ entryId, newDate }),
        });

        return parseJson<PlannerEntryDTO>(res);
    }
};