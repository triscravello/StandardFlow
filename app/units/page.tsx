// app/units/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import UnitList from "@/components/units/UnitList";
import { unitService, type UnitDTO } from "@/services/unitClientService";

export default function UnitsPage() {
    const [units, setUnits] = useState<UnitDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUnits = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const unitData = await unitService.getUnits();
            setUnits(unitData);
        } catch {
            setError("Failed to load units.")
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchUnits();
    }, [fetchUnits]);

    const unitCount = useMemo(() => units.length, [units]);

    return (
        <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
            <header>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Units</h1>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    Review your instructional units and manage the lessons assigned to each unit.
                </p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Total units: {unitCount}</p>
            </header>

            {loading ? (
                <p className="text-zinc-600 dark:text-zinc-400">Loading units...</p>
            ) : error ? (
                <p className="text-red-600 dark:text-red-400">{error}</p>
            ) : (
                <UnitList units={units} />
            )}
        </main>
    )
}