// /components/standards/StandardList.tsx
import StandardCard from "./StandardCard";
import type { StandardDTO } from "@/services/standardClientService";

interface StandardListProps {
    standards: StandardDTO[];
}

export default function StandardList({ standards }: StandardListProps) {
    if (!standards.length) {
        return (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
                No standards found. Please add your first standard below.
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {standards.map((standard) => (
                <StandardCard key={standard._id} standard={standard} />
            ))}
        </div>
    );
}