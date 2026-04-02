// app/units/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import UnitList from "@/components/units/UnitList";
import LoadingSpinner from "@/components/common/LoadingSpinner";
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
        <main className="mx-auto max-w-6xl space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Units</h1>
                <p className="mt-1 text-slate-600">
                    Review your instructional units and manage the lessons assigned to each unit.
                </p>
                <p className="mt-2 text-sm text-slate-500">Total units: {unitCount}</p>
            </header>

            {loading ? (
                <LoadingSpinner label="Loading units..." />
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : (
                <UnitList units={units} />
            )}
        </main>
    )
}