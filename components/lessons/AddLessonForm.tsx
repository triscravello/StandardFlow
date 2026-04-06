'use client';

import { FormEvent, useState } from "react";
import type { LessonDTO } from "@/services/lessonClientService";
import Button from "../common/Button";

interface CreateLessonInput {
    title: string;
    standardCode: string;
    objectives?: string[];
    materials?: string[];
}

interface AddLessonFormProps {
    onAddLesson: (lesson: CreateLessonInput) => Promise<void>;
}

export default function AddLessonForm({ onAddLesson }: AddLessonFormProps) {
    const [title, setTitle] = useState('');
    const [standardCode, setStandardCode] = useState('');
    const [objectives, setObjectives] = useState('');
    const [materials, setMaterials] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!title.trim() || !standardCode.trim()) {
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
                standardCode: standardCode.trim(),
                objectives: objectiveItems,
                materials: materialItems,
            });

            console.log({
                title: title.trim(),
                standardCode: standardCode.trim(),
                objectives: objectiveItems,
                materials: materialItems,
            });

            setTitle('');
            setStandardCode('');
            setObjectives('');
            setMaterials('');
            setSuccessMessage('Lesson added successfully.');
        } catch {
            setError('Unable to add lesson. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Add Lesson</h2>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-slate-700">
                    <span>Title</span>
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Fractions Intro"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                    <span>Standard Code</span>
                    <input
                        value={standardCode}
                        onChange={(event) => setStandardCode(event.target.value)}
                        placeholder="MA.912.DP.1.3"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                    <span>Objectives (comma-separated)</span>
                    <input
                        value={objectives}
                        onChange={(event) => setObjectives(event.target.value)}
                        placeholder="Identify numerator and denominator, compare fractions"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                </label>

                <label className="space-y-1 text-sm text-slate-700">
                    <span>Materials (comma-separated)</span>
                    <input
                        value={materials}
                        onChange={(event) => setMaterials(event.target.value)}
                        placeholder="Fraction strips, worksheet"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Lesson'}
            </Button>
        </form>
    )
}