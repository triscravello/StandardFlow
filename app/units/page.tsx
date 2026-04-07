// app/units/page.tsx
'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import UnitList from "@/components/units/UnitList";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { unitService, type UnitDTO } from "@/services/unitClientService";

export default function UnitsPage() {
    const [units, setUnits] = useState<UnitDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [gradeLevel, setGradeLevel] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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

    const handleCreateUnit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name.trim() || !startDate || !endDate) {
            setError("Unit name, start date, and end date are required");
            return;
        }
        
        try {
            const createdUnit = await unitService.createUnit({
                name: name.trim(),
                gradeLevel: gradeLevel ? Number(gradeLevel) : undefined,
                startDate,
                endDate,
                lessons: [],
            });
            setUnits((prev) => [createdUnit, ...prev]);
            setName("");
            setGradeLevel("");
            setStartDate("");
            setEndDate("");
            setError(null);
        } catch {
            setError("Failed to create unit.")
        }
    }, [endDate, gradeLevel, name, startDate]);

    return (
        <main className="mx-auto max-w-6xl space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <header>
                <h1 className="text-3xl font-bold text-slate-900">Units</h1>
                <p className="mt-1 text-slate-600">
                    Review your instructional units and manage the lessons assigned to each unit.
                </p>
                <p className="mt-2 text-sm text-slate-500">Total units: {unitCount}</p>
            </header>

            <form onSubmit={handleCreateUnit} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-4">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Unit name" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                <input value={gradeLevel} onChange={(e) => setName(e.target.value)} placeholder="Grade level" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                <input value={startDate} onChange={(e) => setName(e.target.value)} placeholder="Start date" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                <input value={endDate} onChange={(e) => setName(e.target.value)} placeholder="End date" className="rounded border border-slate-300 px-3 py-2 text-sm" />
                <button type="submit" className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white md:col-span-4">Create Unit</button>
            </form>

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