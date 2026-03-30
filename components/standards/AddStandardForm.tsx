// /components/standards/AddStandardForm.tsx
'use client';

import { FormEvent, useState } from "react";
import type { StandardDTO } from "@/services/standardClientService";

interface AddStandardFormProps {
    onAddStandard: (standard: Omit<StandardDTO, '_id'>) => Promise<void>;
}

export default function AddStandardForm({ onAddStandard }: AddStandardFormProps) {
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [gradeLevel, setGradeLevel] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        const parsedGradeLevel = Number(gradeLevel);

        if (!code.trim() || !description.trim() || !subject.trim() || Number.isNaN(parsedGradeLevel)) {
            setError('Please fill in all fields with valid values.');
            return;
        }

        setIsSubmitting(true);

        try {
            await onAddStandard({
                code: code.trim().toUpperCase(),
                description: description.trim(),
                subject: subject.trim(),
                gradeLevel: parsedGradeLevel,
            })

            setCode('');
            setDescription('');
            setSubject('');
            setGradeLevel('');
        } catch {
            setError('Unable to add standard. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Add Standard</h2>

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span>Code</span>
                    <input
                        placeholder="CCSS.MATH.3.NF.A.1"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                </label>

                <label className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span>Subject</span>
                    <input
                        placeholder="Mathematics"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                </label>

                <label className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span>Description</span>
                    <input
                        placeholder="Understand a fraction as a number on the number line."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                </label>

                <label className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                    <span>Grade Level</span>
                    <input
                        placeholder="3"
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                </label>
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-600 dark:hover:bg-zinc-300"
            >
                {isSubmitting ? 'Adding...' : 'Add Standard'}
            </button>
        </form>
    );
}