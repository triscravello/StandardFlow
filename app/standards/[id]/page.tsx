type StandardDetailPageProps = {
    params: Promise<{ id: string }>;
};

export default async function StandardDetailPage({ params }: StandardDetailPageProps) {
    const { id } = await params;

    return (
        <section className="space-y-2">
            <h1 className="text-2xl font-semibold">Standard Details</h1>
            <p className="text-sm text-slate-600"> Standard ID: {id}</p>
        </section>
    );
}