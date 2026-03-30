// app/standards/page.tsx
'use client';

import { useCallback, useEffect, useState, useMemo } from "react";
import AddStandardForm from "@/components/standards/AddStandardForm";
import StandardList from "@/components/standards/StandardList";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { standardService, type StandardDTO } from "@/services/standardClientService";

export default function StandardsPage() {
    const [standards, setStandards] = useState<StandardDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStandards = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const standardData = await standardService.getStandards();
            setStandards(standardData);
        } catch {
            setError('Failed to load standards.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchStandards();
    }, [fetchStandards]);

    const handleAddStandard = useCallback(async (standard: Omit<StandardDTO, '_id'>) => {
        const createdStandard = await standardService.createStandard({
            code: standard.code,
            description: standard.description,
            subject: standard.subject,
            gradeLevel: standard.gradeLevel,
        });

        setStandards((prevStandards) => [...prevStandards, createdStandard]);
    }, []);

    const standardCount = useMemo(() => standards.length, [standards]);

    return (
        <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Standards</h1>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    Review and manage learning standards across grade levels and subjects.
                </p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">Total standards: {standardCount}</p>
            </header>

            <AddStandardForm onAddStandard={handleAddStandard} />

            {loading ? (
                <LoadingSpinner label="Loading standards..." />
            ) : error ? (
                <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : (
                <StandardList standards={standards} />
            )}
        </main>
    );
}