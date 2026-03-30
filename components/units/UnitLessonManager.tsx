// components/units/UnitLessonManager.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { unitService, type UnitLessonDTO } from "@/services/unitClientService";
import { lessonService, type LessonDTO } from "@/services/lessonClientService";

interface UnitLessonManagerProps {
    unitId: string;
}

export default function UnitLessonManager({ unitId }: UnitLessonManagerProps) {
    const [availableLessons, setAvailableLessons] = useState<LessonDTO[]>([]);
    const [unitLessons, setUnitLessons] = useState<UnitLessonDTO[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [lessons, assignedLessons] = await Promise.all([
                lessonService.getLessons(),
                unitService.getUnitLessons(unitId),
            ]);

            const sortedAssignedLessons = [...assignedLessons].sort((a, b) => a.lessonOrder - b.lessonOrder);
            setAvailableLessons(lessons);
            setUnitLessons(sortedAssignedLessons);

            if (!selectedLessonId && lessons.length > 0) {
                setSelectedLessonId(lessons[0]._id);
            }
        } catch {
            setError("Failed to load lessons for this unit.");
        } finally {
            setLoading(false);
        }
    }, [selectedLessonId, unitId]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    const assignedLessonsIds = useMemo(() => new Set(unitLessons.map(entry => entry.lesson._id)), [unitLessons]);

    const selectableLessons = useMemo(
        () => availableLessons.filter((lesson) => !assignedLessonsIds.has(lesson._id)),
        [assignedLessonsIds, availableLessons]
    );

    useEffect(() => {
        if (selectableLessons.length > 0 && !selectableLessons.some(lesson => lesson._id === selectedLessonId)) {
            setSelectedLessonId(selectableLessons[0]._id);
        }
    }, [selectableLessons, selectedLessonId]);

    const handleAddLesson = useCallback(async () => {
        if (!selectedLessonId) return;

        setUpdating(true);
        setError(null);

        try {
            await unitService.addLessonToUnit(unitId, selectedLessonId, unitLessons.length);
            await fetchData();
        } catch {
            setError("Unable to add lesson to unit.");
        } finally {
            setUpdating(false);
        }
    }, [fetchData, selectedLessonId, unitId, unitLessons.length]);

    const handleRemoveLesson = useCallback(
        async (lessonId: string) => {
            setUpdating(true);
            setError(null);

            try {
                await unitService.removeLessonFromUnit(unitId, lessonId);
                await fetchData();
            } catch {
                setError("Unable to remove lesson from unit.");
            } finally {
                setUpdating(false);
            }
        },
        [fetchData, unitId]
    );

    if (loading) {
        return <p className="text-sm text-zinc-600 dark:text-zinc-400">Loading unit lessons...</p>;
    }

    return (
        <section className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Unit Lessons</h4>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <select 
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:text-zinc-950 dark:text-zinc-100" 
                    value={selectedLessonId}
                    onChange={(event) => setSelectedLessonId(event.target.value)}
                    disabled={!selectableLessons.length || updating}
                >
                    {selectableLessons.length ? (
                        selectableLessons.map((lesson) => (
                            <option key={lesson._id} value={lesson._id}>
                                {lesson.title}
                            </option>
                        ))
                    ) : (
                        <option value="">All available lessons are already in this unit</option>
                    )}
                </select>

                <button
                    type="button"
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
                    onClick={handleAddLesson}
                    disabled={!selectedLessonId || !selectableLessons.length || updating}
                >
                    {updating ? 'Updating...' : 'Add Lesson'}
                </button>
            </div>

            {unitLessons.length > 0 ? (
                <ul className="space-y-2">
                    {unitLessons.map((entry, index) => (
                        <li key={entry.id} className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
                            <span className="text-zinc-800 dark:text-zinc-100">
                                {index + 1}. {entry.lesson.title}
                            </span>
                            <button
                                type="button"
                                className="text-sm font-medium text-red-600 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => void handleRemoveLesson(entry.lesson._id)}
                                disabled={updating}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">No lessons assigned to this unit yet.</p>
            )}
        </section>
    );
}