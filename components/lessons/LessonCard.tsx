import { LessonDTO } from "@/services/lessonClientService";

interface LessonCardProps {
    lesson: LessonDTO;
}

export default function LessonCard({ lesson }: LessonCardProps) {
    return (
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">{lesson.title}</h3>

            <p className="mt-2 text-sm text-slate-600">
                Standard: <span className="font-medium">{lesson.standardCode || lesson.standard}</span>
            </p>

            {lesson.objectives.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-semibold text-slate-600">Objectives</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                        {lesson.objectives.map((objective) => (
                            <li key={objective}>{objective}</li>
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
}