// app/lessons/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import AddLessonForm from '@/components/lessons/AddLessonForm';
import LessonList from '@/components/lessons/LessonList';
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { lessonService, type LessonDTO } from "@/services/lessonClientService";

export default function LessonsPage() {
    const [lessons, setLessons] = useState<LessonDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLessons = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const lessonData = await lessonService.getLessons();
            setLessons(lessonData);
        } catch {
            setError('Failed to load lessons.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchLessons();
    }, [fetchLessons]);

    const handleAddLesson = useCallback(async (lesson: Omit<LessonDTO, '_id'>) => {
        const createdLesson = await lessonService.createLesson({
            title: lesson.title,
            standardId: lesson.standard,
            objectives: lesson.objectives,
            materials: lesson.materials,
        });

        setLessons((prevLessons) => [createdLesson, ...prevLessons]);
    }, []);

    const lessonCount = useMemo(() => lessons.length, [lessons]);

    return(
        <main className="mx-auto max-w-6xl space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Lessons</h1>
                <p className="mt-1 text-slate-600">
                    Manage your lesson library and add new lessons quickly.
                </p>
                <p className="mt-2 text-sm text-slate-500">Total lessons: {lessonCount}</p>
            </header>

            <AddLessonForm onAddLesson={handleAddLesson} />

            {loading ? (
                <LoadingSpinner label="Loading lessons..." />
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <LessonList lessons={lessons} />
            )}
        </main>
    );
}
