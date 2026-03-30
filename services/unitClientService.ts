// services/unitClientService.ts
export interface UnitDTO {
    _id: string;
    name: string;
    gradeLevel?: number;
    startDate: string;
    endDate: string;
}

export interface UnitLessonDTO {
    id: string;
    lessonOrder: number;
    lesson: {
        _id: string;
        title: string;
        standard: string;
        objectives: string[];
        materials: string[];
    };
}

async function parseJson<T>(res: Response): Promise<T> {
    const payload = await res.json().catch(() => null);

    if (!res.ok) {
        const message = payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : `Request failed with status ${res.status}`;
        throw new Error(message);
    }

    return payload as T;
}

export const unitService = {
    async getUnits(): Promise<UnitDTO[]> {
        const res = await fetch("/api/units", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        const payload = await parseJson<{ success: Boolean; data: UnitDTO[] }>(res);
        return payload.data ?? [];
    },

    async getUnitLessons(unitId: string): Promise<UnitLessonDTO[]> {
        const res = await fetch(`/api/units/${unitId}/lessons`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });
        
        const payload = await parseJson<{ success: boolean; data: UnitLessonDTO[] }>(res);
        return payload.data ?? [];
    },

    async addLessonToUnit(unitId: string, lessonId: string, lessonOrder: number): Promise<void> {
        const res = await fetch(`/api/units/${unitId}/lessons`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ lessonId, lessonOrder }),
        });

        await parseJson<{ success: boolean }>(res);
    },

    async removeLessonFromUnit(unitId: string, lessonId: string): Promise<void> {
        const res = await fetch(`/api/units/${unitId}/lessons/${lessonId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }, 
            body: JSON.stringify({ lessonId }),
        });

        await parseJson<{ success: boolean }>(res);
    },
};