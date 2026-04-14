type LessonDetailPageProps = {
    params: Promise<{ id: string }>;
};

export default async function LessonDetailPage({ params }: LessonDetailPageProps) {
    const { id } = await params;

    return (
        <section className="space-y-2">
            <h1 className="text-2xl font-semibold">Lesson Details</h1>
            <p className="text-sm text-slate-600">Lesson ID: {id}</p>
        </section>
    );
}