'use client';

import { FormEvent, useState } from "react";
import type { LessonDTO } from "@/services/lessonClientService";
import Button from "../common/Button";

interface AddLessonFormProps {
    onAddLesson: (lesson: Omit<LessonDTO, '_id'>) => Promise<void>;
}

export default function AddLessonForm({ onAddLesson }: AddLessonFormProps) {
    const [title, setTitle] = useState('');
    const [standardId, setStandardId] = useState('');
    const [objectives, setObjectives] = useState('');
    const [materials, setMaterials] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!title.trim() || !standardId.trim()) {
            setError('Title and Standard ID are required');
            return;
        }

        const objectiveItems = objectives
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        const materialItems = materials
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        setIsSubmitting(true);
        try {
            await onAddLesson({
                title: title.trim(),
                standard: standardId.trim(),
                objectives: objectiveItems,
                materials: materialItems,
            });

            setTitle('');
            setStandardId('');
            setObjectives('');
            setMaterials('');
        } catch {
            setError('Unable to add lesson. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Add Lesson</h2>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span>Title</span>
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Fractions Intro"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                </label>

                <label className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span>Standard ID</span>
                    <input
                        value={standardId}
                        onChange={(event) => setStandardId(event.target.value)}
                        placeholder="67a2..."
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                </label>

                <label className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span>Objectives (comma-separated)</span>
                    <input
                        value={objectives}
                        onChange={(event) => setObjectives(event.target.value)}
                        placeholder="Identify numerator and denominator, compare fractions"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                </label>

                <label className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span>Materials (comma-separated)</span>
                    <input
                        value={materials}
                        onChange={(event) => setMaterials(event.target.value)}
                        placeholder="Fraction strips, worksheet"
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                </label>
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Lesson'}
            </Button>
        </form>
    )
}