// /components/standards/StandardCard.tsx
import type { StandardDTO } from "@/services/standardClientService";


interface StandardCardProps {
    standard: StandardDTO;
}

export default function StandardCard({ standard }: StandardCardProps) {
    return (
        <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{standard.code}</h3>
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    Grade {standard.gradeLevel}
                </span>
            </div>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{standard.description}</p>

            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                Subject: <span className="font-medium">{standard.subject}</span>
            </p>
        </article>
    );
}