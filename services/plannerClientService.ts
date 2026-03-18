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
        const message = await res.text();
        throw new Error(message || `Request failed with status ${res.status}`);
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

        return parseJson<PlannerEntryDTO[]>(res);
    }
};