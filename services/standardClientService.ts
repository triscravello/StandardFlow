// /services/standardClientService.ts
export interface StandardDTO {
    _id: string;
    code: string;
    description: string;
    subject: string;
    gradeLevel: number;
}

export interface CreateStandardPayload {
    code: string;
    description: string;
    subject: string;
    gradeLeve: number;
}

async function parseJson<T>(res: Response): Promise<T> {
    const payload = await res.json().catch(() => null);

    if (!res.ok) {
        const message = payload && typeof payload === 'object' && 'error' in payload 
            ? String((payload as { error: unknown }).error)
            : `Request failed with status ${res.status}`;
        throw new Error(message);
    }

    return payload as T;
}

export const standardService = {
    async getStandards(): Promise<StandardDTO[]> {
        const res = await fetch('/api/standards', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const payload = await parseJson<{ success: boolean; data: StandardDTO[] }>(res);
        return payload.data ?? [];
    },

    async createStandard(payload: CreateStandardPayload): Promise<StandardDTO> {
        const res = await fetch('/api/standards', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const response = await parseJson<{ success: boolean; data: StandardDTO }>(res);
        return response.data;
    }
}