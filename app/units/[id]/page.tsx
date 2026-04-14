type UnitDetailPageProps = {
    params: Promise<{ id: string }>;
};

export default async function UnitDetailPageProps({ params }: UnitDetailPageProps) {
    const { id } = await params;

    return (
        <section className="space-y-2">
            <h1 className="text-2xl font-semibold">Unit Details</h1>
            <p className="text-sm text-slate-600">Unit ID: {id}</p>
        </section>
    );
}