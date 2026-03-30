// /component/units/UnitList.tsx
import UnitCard from "./UnitCard";
import type { UnitDTO } from "@/services/unitClientService";

interface UnitListProps {
    units: UnitDTO[];
}

export default function UnitList({ units }: UnitListProps) {
    if (!units.length) {
        return (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
                No units found. Create a unit to start organizing lessons.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {units.map((unit) => (
                <UnitCard key={unit._id} unit={unit} />
            ))}
        </div>
    )
}